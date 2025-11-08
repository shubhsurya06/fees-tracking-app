import { Component, OnInit, signal, inject } from '@angular/core';
import { Header } from '../header/header';
import { IBranch } from '../../core/model/branch-model';
import { BranchService } from '../../core/services/branch/branch-service';
import { InstituteService } from '../../core/services/institute/institute-service';
import { IInstituteModel } from '../../core/model/institute-model';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NgClass } from '@angular/common';
import { UserService } from '../../core/services/user/user-service';
import { ApiConstant } from '../../core/constant/constant';

@Component({
  selector: 'app-branch',
  imports: [Header, ReactiveFormsModule, NgClass],
  templateUrl: './branch.html',
  styleUrl: './branch.scss'
})
export class Branch implements OnInit {

  branchService = inject(BranchService);
  userService = inject(UserService);
  InstituteService = inject(InstituteService);
  isBranchLoading = signal<boolean>(false);
  isAddEditBranchLoader = signal<boolean>(false);
  branchList = signal<IBranch[]>([]);
  instituteList = signal<IInstituteModel[]>([]);
  branchForm!: FormGroup;
  instituteAdminRole = ApiConstant.USER_ROLES.INSTITUTE_ADMIN;

  constructor(private fb: FormBuilder) {
    this.branchForm = this.fb.group({
      branchId: [0],
      branchName: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required],
      location: ['', Validators.required],
      instituteId: ['', Validators.required],
      branchContactNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      branchEmail: ['', [Validators.required, Validators.email]],
      branchCode: ['', Validators.required]
    });

    // get roles userService, if not available, then set in userService.
    if (!Object.keys(this.userService.loggedInUser()).length) {
      this.userService.getLoggedInUser();
    }

    // check loggedInUser role and set default value of insitituteId of user if he is InstituteAdmin
    if (this.userService.loggedInUser() && this.userService.loggedInUser().role === this.instituteAdminRole) {
      this.branchForm.controls['instituteId'].setValue(this.userService.loggedInUser().instituteId)
    }
  }

  ngOnInit(): void {
    this.getAllInstitutes();
    this.getAllBranches();
  }

  getAllInstitutes() {
    this.InstituteService.getAllInstitutes().subscribe({
      next: (res: any) => {
        this.instituteList.set(res.data);
      },
      error: (err: any) => {
        console.error('Error fetching institutes:', err);
        alert(err.message);
      }
    });
  }

  onGetAllBranchSuccess(res: any) {
    res.map((branch: IBranch) => {
      const institute = this.instituteList().find((inst: IInstituteModel) => inst.instituteId === branch.instituteId);
      branch.instituteName = institute ? institute.name : 'N/A';
      return branch;
    })
    this.branchList.set(res);
  }

  getAllBranches() {
    this.isBranchLoading.set(true);
    this.branchService.getAllBranches().subscribe({
      next: (res: any) => {
        this.isBranchLoading.set(false);
        console.log('Institute List for mapping:', this.instituteList(), res);
        this.onGetAllBranchSuccess(res);
      },
      error: (err: any) => {
        console.error('Error fetching branches:', err);
        this.isBranchLoading.set(false);
        alert(err.message);
      }
    });
  }

  createBranch() {
    if (this.branchForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.branchForm.controls).forEach(key => {
        const control = this.branchForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isAddEditBranchLoader.set(true);
    const branchData: IBranch = this.branchForm.value;

    if (branchData.branchId) {
      // Update existing branch
      this.branchService.updateBranch(branchData).subscribe({
        next: (res: any) => {
          this.handleBranchSuccess(res.data, 'Branch updated successfully');
        },
        error: this.handleBranchError.bind(this)
      });
    } else {
      // Create new branch
      this.branchService.createBranch(branchData).subscribe({
        next: (res: any) => {
          this.handleBranchSuccess(res.data, 'Branch created successfully');
        },
        error: this.handleBranchError.bind(this)
      });
    }
  }

  editBranch(branch: IBranch) {
    this.branchForm.patchValue({
      branchId: branch.branchId,
      branchName: branch.branchName,
      branchCode: branch.branchCode,
      branchContactNo: branch.branchContactNo,
      branchEmail: branch.branchEmail,
      city: branch.city,
      state: branch.state,
      pincode: branch.pincode,
      location: branch.location,
      instituteId: branch.instituteId
    });
  }

  deleteBranch(branchId: number | undefined) {
    if (!branchId) return;

    const isConfirmed = confirm('Are you sure you want to delete this branch?');
    if (!isConfirmed) return;

    this.branchService.deleteBranch(branchId).subscribe({
      next: (res: any) => {
        alert('Branch deleted successfully');
        this.branchList.update(list => list.filter(b => b.branchId !== branchId));
      },
      error: (error: any) => {
        console.error('Error deleting branch:', error);
        alert(error.message || 'Error deleting branch');
      }
    });
  }

  cancelEdit() {
    this.branchForm.reset();
    this.branchForm.patchValue({
      branchId: 0,
      instituteId: 0
    });
  }

  private handleBranchSuccess(branchData: IBranch, message: string) {
    this.isAddEditBranchLoader.set(false);
    alert(message);
    try {
      this.closeModal();
    } catch (e) {
      // ignore if bootstrap not available
    }
    this.cancelEdit();

    // Update the branch list
    this.branchList.update(list => {
      const index = list.findIndex(b => b.branchId === branchData.branchId);
      if (index === -1) {
        return [...list, branchData];
      } else {
        list[index] = branchData;
        return [...list];
      }
    });
  }

  /**
   * Close bootstrap modal with id 'staticBackdrop' programmatically.
   */
  private closeModal() {
    const modalEl = document.getElementById('staticBackdrop');
    if (!modalEl) return;
    const bootstrap = (window as any).bootstrap;
    if (bootstrap && bootstrap.Modal) {
      const inst = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      inst.hide();
      return;
    }
    // fallback: click close button if modal API not found
    const closeBtn = modalEl.querySelector('.btn-close') as HTMLElement | null;
    closeBtn?.click();
  }

  private handleBranchError(error: any) {
    console.error('Error saving branch:', error);
    this.isAddEditBranchLoader.set(false);
    alert(error.message || 'Error saving branch');
  }
}

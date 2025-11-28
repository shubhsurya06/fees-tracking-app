import { Component, OnInit, signal, inject, Output, computed, OnDestroy } from '@angular/core';
import { IBranch } from '../../core/model/branch-model';
import { BranchService } from '../../core/services/branch/branch-service';
import { InstituteService } from '../../core/services/institute/institute-service';
import { IInstituteModel } from '../../core/model/institute-model';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { UserService } from '../../core/services/user/user-service';
import { APP_CONSTANT } from '../../core/constant/appConstant';
import { CommonService } from '../../core/services/common/common-service';
import { IAlert } from '../../core/model/alert-model';
import { AlertBox } from '../../shared/reusableComponent/alert-box/alert-box';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-branch',
  imports: [ReactiveFormsModule, NgClass, AlertBox, FormsModule],
  templateUrl: './branch.html',
  styleUrl: './branch.scss'
})
export class Branch implements OnInit, OnDestroy {

  branchService = inject(BranchService);
  userService = inject(UserService);
  InstituteService = inject(InstituteService);
  commonService = inject(CommonService);

  isBranchLoading = signal<boolean>(false);
  isAddEditBranchLoader = signal<boolean>(false);
  branchList = signal<IBranch[]>([]);
  instituteList = signal<IInstituteModel[]>([]);
  branchForm!: FormGroup;
  instituteAdminRole = APP_CONSTANT.USER_ROLES.INSTITUTE_ADMIN;

  // data related to alert box - showing on ADD/UPDATE - SUCCESS/ERROR
  @Output() isSuccessAlert = signal<boolean>(false);
  @Output() alertObj = signal<IAlert | any>({});
  isShowAlert = signal<boolean>(false);
  isShowCardView = signal<boolean>(false);

  searchText: string = '';
  searchSubject = new Subject<string>();
  subscription: any;
  filteredSearchText = signal<string>('');

  filteredBranchList = computed(() => {
    return this.branchList().filter(branch => {
      return branch.branchName.toLowerCase().includes(this.filteredSearchText().toLowerCase());
    })
  });

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
    // TO DO - WHEN APPLICATION WILL GET DEVELOPED FULLY, THEN ONLY CALL BELOW FOR SUPER_ADMIN
    // if (this.userService.loggedInUser() && this.userService.loggedInUser().role === APP_CONSTANT.USER_ROLES.SYSTEM_ADMIN) {
    //   console.log('################################################ SYSTEM ADMIN ROLE############')
    // }
    this.getAllInstitutes();
    this.getAllBranches();

    this.subscription = this.searchSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((searchText) => {
      this.filteredSearchText.set(searchText);
    });
  }

  ngOnDestroy(): void {
    this.subscription.destroy();
  }

  onSearchBranch() {
    this.searchSubject.next(this.searchText);
  }

  /**
   * get all institutes from commonService on page load
   */
  async getAllInstitutes() {
    let list = await this.commonService.returnAllInstitute();
    this.instituteList.set(list);
  }

  /**
   * Add insitituteName in all branches after all branches data will be available, used map here
   * @param res 
   */
  onGetAllBranchSuccess(res: any) {
    res.map((branch: IBranch) => {
      const institute = this.instituteList().find((inst: IInstituteModel) => inst.instituteId === branch.instituteId);
      branch.instituteName = institute ? institute.name : 'N/A';
      return branch;
    })
    this.branchList.set(res);
  }

  // toggle between card and table view
  toggleView(flag: boolean) {
    this.isShowCardView.set(flag);
  }

  /**
   * get all branches
   */
  getAllBranches() {
    this.isBranchLoading.set(true);
    this.branchService.getAllBranches().subscribe({
      next: (res: any) => {
        this.isBranchLoading.set(false);
        console.log('Institute List for mapping:', this.instituteList(), res.data);
        this.onGetAllBranchSuccess(res.data);
      },
      error: (err: any) => {
        console.error('Error fetching branches:', err);
        this.showAlert(false, err);
        this.isBranchLoading.set(false);
      }
    });
  }

  /**
   * show alert box on create and update (for success, error)
   * @param isSuccess 
   * @param res 
   */
  showAlert(isSuccess: boolean, res: any) {
    this.isShowAlert.set(true);
    this.isSuccessAlert.set(isSuccess);
    this.alertObj.set({
      type: isSuccess ? APP_CONSTANT.ALERT_CONSTANT.TYPE.SUCCESS : APP_CONSTANT.ALERT_CONSTANT.TYPE.DANGER,
      title: isSuccess ? APP_CONSTANT.ALERT_CONSTANT.TITLE.SUCCESS : APP_CONSTANT.ALERT_CONSTANT.TITLE.DANGER,
      message: res.message
    });
    setTimeout(() => {
      this.isShowAlert.set(false);
    }, APP_CONSTANT.TIMEOUT);
  }

  /**
   * add and update new branch from here
   * @returns 
   */
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
          this.handleBranchSuccess(res);
        },
        error: this.handleBranchError.bind(this)
      });
    } else {
      // Create new branch
      this.branchService.createBranch(branchData).subscribe({
        next: (res: any) => {
          this.handleBranchSuccess(res);
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

  /**
   * delete branch data from here
   * @param branchId 
   * @returns 
   */
  deleteBranch(branchId: number | undefined) {
    if (!branchId) return;

    const isConfirmed = confirm('Are you sure you want to delete this branch?');
    if (!isConfirmed) return;

    this.branchService.deleteBranch(branchId).subscribe({
      next: (res: any) => {
        this.showAlert(true, res);
        this.branchList.update(list => list.filter(b => b.branchId !== branchId));
      },
      error: (error: any) => {
        console.error('Error deleting branch:', error);
        this.showAlert(false, error);
      }
    });
  }

  /**
   * User is editing branch, but later he don't wants to edit, then cancelForm edit and reset form
   */
  cancelEdit() {
    this.branchForm.reset();
    this.branchForm.patchValue({
      branchId: 0,
      instituteId: 0
    });
  }

  /**
   * when branch add/udpate gets success, then reset loader, update list
   * @param branchData 
   * @param message 
   */
  private handleBranchSuccess(branchData: any) {
    this.isAddEditBranchLoader.set(false);
    this.showAlert(true, branchData);
    let res: IBranch = branchData.data;
    try {
      this.closeModal();
    } catch (e) {
      // ignore if bootstrap not available
    }
    this.cancelEdit();

    // Update the branch list
    this.branchList.update(list => {
      const index = list.findIndex(b => b.branchId === res.branchId);
      if (index === -1) {
        return [...list, res];
      } else {
        list[index] = res;
        return [...list];
      }
    })
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

  /**
   * Set loader to false, when branch add/edit gets failed
   * @param error 
   */
  private handleBranchError(error: any) {
    console.error('Error saving branch:', error);
    this.isAddEditBranchLoader.set(false);
    this.showAlert(false, error);
  }
}

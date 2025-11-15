import { Component, inject, OnInit, Output, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PackageMasterModel } from '../../core/model/package-master-model';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { AlertBox } from '../../shared/reusableComponent/alert-box/alert-box';
import { IAlert } from '../../core/model/alert-model';
import { APP_CONSTANT } from '../../core/constant/appConstant';
import { PackageMasterService } from '../../core/services/package-master/package-master-service';
import { CommonService } from '../../core/services/common/common-service';
import { ActivationService } from '../../core/services/activation/activation-service';
import { IActivation } from '../../core/model/activation-model';
import { IInstituteModel } from '../../core/model/institute-model';
import { UserService } from '../../core/services/user/user-service';

@Component({
  selector: 'app-activation',
  imports: [DatePipe, ReactiveFormsModule, NgClass, NgFor, NgIf],
  templateUrl: './activation.html',
  styleUrl: './activation.scss'
})
export class Activation implements OnInit {
  activationService = inject(ActivationService);
  activationList = signal<IActivation[]>([]);
  isActivationLoading = signal<boolean>(false);
  activationForm!: FormGroup;
  addUpdateLoader = signal<boolean>(false);
  fb = inject(FormBuilder);

  packageMasterList = signal<PackageMasterModel[]>([]);
  packageMasterSer = inject(PackageMasterService);

  instituteList = signal<IInstituteModel[]>([]);
  commonService = inject(CommonService);

  userService = inject(UserService);

  // data related to alert box - showing on ADD/UPDATE - SUCCESS/ERROR
  @Output() isSuccessAlert = signal<boolean>(false);
  @Output() alertObj = signal<IAlert | any>({});
  isShowAlert = signal<boolean>(false);

  constructor() {
    if (!Object.keys(this.userService.loggedInUser()).length) {
      this.userService.getLoggedInUser();
    }

    this.getAllInstitutes();
    this.getAllPackages();

    this.activationForm = this.fb.group({
      activationId: [0, Validators.required],
      packageId: [0, Validators.required],
      instituteId: [0, Validators.required],
      activatedBy: [0, Validators.required],
      isActive: [0],
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
    })

    this.activationForm.controls['activatedBy'].setValue(this.userService.loggedInUser().userId);
  }

  ngOnInit(): void {
    // setTimeout(() => {
    // }, 3000)
    this.getAllActivations();
  }

  /**
 * return packageId from packageForm if available
 */
  get activationId() {
    return this.activationForm.get('activationId')?.value;
  }

  // V3 Validation: show error if touched OR form submitted
  showError(controlName: string): boolean {
    const control = this.activationForm.get(controlName);
    return !!control && control.invalid && (control.touched);
  }

  /**
   * get all institute list
   */
  async getAllInstitutes() {
    let list = await this.commonService.returnAllInstitute();
    this.instituteList.set(list);
  }

  /**
   * get all pacakge-master list
   */
  getAllPackages() {
    // this.isPackageLoading.set(true);
    this.packageMasterSer.getAllPackages().subscribe({
      next: (res: any) => {
        this.packageMasterList.set(res.data || []);
      },
      error: (err: any) => {
        console.error('Error fetching packages in activation.ts:', err.message);
      }
    });
  }

  onGetActivationList(res: any) {
    res.map((act: IActivation) => {
      // set institute name in response of get list of activation
      let institute = this.instituteList().find(inst => inst.instituteId === act.instituteId);
      if (institute) {
        act.instituteName = institute.name;
      }

      // set package master name in response of get list of activation
      let pkg = this.packageMasterList().find(pckg => pckg.packageId === act.packageId);
      if (pkg) {
        act.packageName = pkg.packageName;
      }
    })

    this.activationList.set(res);
  }

  /**
   * get all activation list
   */
  getAllActivations() {
    this.isActivationLoading.set(true);
    this.activationService.getAllActivation().subscribe({
      next: (res: any) => {
        this.isActivationLoading.set(false);
        this.onGetActivationList(res.data);
        this.activationList.set(res.data || []);
      },
      error: (err: any) => {
        console.error('Error fetching packages:', err.message);
        // this.showAlert(false, err);
        this.isActivationLoading.set(false);
      }
    });
  }

  /**
   * do some activity after activation gets added and updated sucessfully
   * @param res 
   */
  onAddEditActivationSuccess(res: any) {
    this.closeModal();
    const act: IActivation = res.data;
    this.addUpdateLoader.set(false);

    this.activationForm.reset();

    // store institute name in activation data
    let institute = this.instituteList().find(inst => inst.instituteId === act.instituteId);
    act.instituteName = institute?.name;

    let index = this.activationList().findIndex((item: IActivation) => item.activationId === act.activationId);
    if (index === -1) {
      this.activationList().push(act);
    } else {
      this.activationList()[index] = act;
    }
  }

  /**
   * update actvation details from here
   * @param activation 
   */
  updateActivation(activation: IActivation) {
    this.activationService.updateActivation(activation).subscribe({
      next: (res: any) => {
        console.log('Package updated successfully:', res);
        this.onAddEditActivationSuccess(res);
      },
      error: (err: any) => {
        this.addUpdateLoader.set(false);
        alert(err.message);
        console.error('Error updating activation:', err);
        // this.onAddUpdatePackageError(err);
      }
    });
  }

  /**
   * Create and Update activation details from here
   * @returns 
   */
  createActivation() {
    if (this.activationForm.invalid) {
      alert('Form is not valid. Please enter all details.')
      return;
    }

    this.addUpdateLoader.set(true);

    let activation: IActivation = this.activationForm.value;

    console.log('✅ Activation Form Submitted:', activation);

    if (this.activationId) {
      this.updateActivation(activation);
      return;
    }

    // TODO: API CALL HERE
    this.activationService.createActivation(activation).subscribe({
      next: (res: any) => {
        this.onAddEditActivationSuccess(res);
      }, error: (error: any) => {
        this.addUpdateLoader.set(false);
        console.error('Some error while adding activation data:', error);
      }
    })

  }

  editActivation(Act: IActivation) {
    this.activationForm.patchValue({
      activationId: Act.activationId,
      packageId: Act.packageId,
      instituteId: Act.instituteId,
      activatedBy: Act.activatedBy,
      isActive: Act.isActive,
      startDate: new Date(Act.startDate).toISOString().substring(0, 10),
      endDate: new Date(Act.endDate).toISOString().substring(0, 10)
    })
  }

  /**
   * delete activation details from here
   * @param id 
   * @returns 
   */
  deleteActivation(id: number) {
    if (!confirm('Are you sure you want to delete this activation?')) {
      return;
    }
    this.activationService.deleteActivation(id).subscribe({
      next: (res: any) => {
        this.activationList.update(list => list.filter(item => item.activationId !== id));
        alert('Activation has been deleted successfully!')
      }, error: (error: any) => {
        console.error('Some error while deleting activation:', error);
      }
    })
  }

  cancelEdit() {
    this.activationForm.reset();
    this.closeModal()
  }

  private closeModal() {
    const modalEl = document.getElementById('addActivationModal');
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
}

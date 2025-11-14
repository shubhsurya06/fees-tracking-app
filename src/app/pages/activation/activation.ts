import { Component, inject, OnInit, Output, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PackageMasterModel } from '../../core/model/package-master-model';
import { DatePipe, NgClass } from '@angular/common';
import { AlertBox } from '../../shared/reusableComponent/alert-box/alert-box';
import { IAlert } from '../../core/model/alert-model';
import { APP_CONSTANT } from '../../core/constant/appConstant';
import { PackageMasterService } from '../../core/services/package-master/package-master-service';
import { CommonService } from '../../core/services/common/common-service';
import { ActivationService } from '../../core/services/activation/activation-service';
import { IActivation } from '../../core/model/activation-model';
import { IInstituteModel } from '../../core/model/institute-model';

@Component({
  selector: 'app-activation',
  imports: [DatePipe],
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


  // data related to alert box - showing on ADD/UPDATE - SUCCESS/ERROR
  @Output() isSuccessAlert = signal<boolean>(false);
  @Output() alertObj = signal<IAlert | any>({});
  isShowAlert = signal<boolean>(false);

  constructor() {
    this.getAllInstitutes();
    this.getAllPackages();
  }

  ngOnInit(): void {
    // setTimeout(() => {
    // }, 3000)
    this.getAllActivations();
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

  editActivation(Act: IActivation) {

  }

  deleteActivation(id: number) {

  }
}

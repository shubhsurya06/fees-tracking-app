import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Header } from '../header/header';
import { PackageMasterModel } from '../../core/model/package-master-model';
import { PackageMasterService } from '../../core/services/package-master/package-master-service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-package-master',
  imports: [Header, ReactiveFormsModule, NgClass],
  templateUrl: './package-master.html',
  styleUrl: './package-master.scss'
})
export class PackageMaster implements OnInit {
  title = signal('Package Master Page');

  packageMasterService = inject(PackageMasterService);
  packageList = signal<PackageMasterModel[]>([]);
  isPackageLoading = signal<boolean>(false);
  isAddUpdatePkgLoader = signal<boolean>(false);
  packageForm: FormGroup;
  isEditMode = signal<boolean>(false);
  addPackageMasterLoader = signal<boolean>(false);
  fb = inject(FormBuilder);

  constructor() {
    this.packageForm = this.fb.group({
      packageId: [0],
      packageName: ['', Validators.required],
      oneTimeTotalCost: ['', Validators.required],
      emiTotalCost: ['', Validators.required],
      maxBranches: ['', Validators.required],
      maxStudents: ['', Validators.required],
      isSmsAlert: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllPackages();
  }

  /**
   * Get all packages from server
   */
  getAllPackages() {
    this.isPackageLoading.set(true);
    this.packageMasterService.getAllPackages().subscribe({
      next: (res: any) => {
        this.isPackageLoading.set(false);
        this.packageList.set(res.data || []);
      },
      error: (err: any) => {
        console.error('Error fetching packages:', err.message);
        alert(err.message);
        this.isPackageLoading.set(false);
      }
    });
  }

  /**
   * After Add/Update package operations
   */
  onPackageAddUpdate() {
    this.isAddUpdatePkgLoader.set(false);
    this.packageForm.reset();
    this.getAllPackages();

    if (this.isEditMode()) {
      this.isEditMode.set(false);
    }
  }

  /**
   * Create new package
   */
  createPackage() {
    if (this.packageForm.valid) {
      this.isAddUpdatePkgLoader.set(true);
      const packageData: PackageMasterModel = this.packageForm.value;

      if (this.isEditMode()) {
        this.updatePackageMaster(packageData);
        return;
      }

      console.log('Creating package with data:', packageData);
      packageData.packageId = 0; // Ensure packageId is 0 for new package

      this.packageMasterService.createPackage(packageData).subscribe({
        next: (res: any) => {
          this.isAddUpdatePkgLoader.set(false);
          this.packageForm.reset();
          this.getAllPackages();
        },
        error: (err: any) => {
          console.error('Error creating package:', err.message);
          this.isAddUpdatePkgLoader.set(false);
          alert(err.message);
        }
      });
    } else {
      console.warn('Package form is invalid');
    }
  }

  /**
   *  Update existing package
   */
  updatePackageMaster(packageData: PackageMasterModel) {
    this.packageMasterService.updatePackage(packageData).subscribe({
      next: (res: any) => {
        console.log('Package updated successfully:', res);
        this.onPackageAddUpdate();
      },
      error: (err: any) => {
        console.error('Error updating package:', err.message);
        this.isAddUpdatePkgLoader.set(false);
        alert(err.message);
      }
    });
  }

  /**
   * @param packageMaster 
   */
  editPackage(packageMaster: PackageMasterModel) {
    this.isEditMode.set(true);
    this.packageForm.patchValue({
      packageId: packageMaster.packageId,
      packageName: packageMaster.packageName,
      oneTimeTotalCost: packageMaster.oneTimeTotalCost,
      emiTotalCost: packageMaster.emiTotalCost,
      maxBranches: packageMaster.maxBranches,
      maxStudents: packageMaster.maxStudents,
      isSmsAlert: packageMaster.isSmsAlert
    });
  }

  /**
   * delete package master
   * @param id 
   * @returns 
   */
  deletePackage(id: number) {
    let isDelete = confirm('Are you sure you want to delete this Package Master?');
    console.log('Delete confirmation result:', isDelete);

    if (!isDelete) {
      return;
    }

    this.packageMasterService.deletePackage(id).subscribe({
      next: (res: any) => {
        console.log('Package deleted successfully:', res);
        this.getAllPackages();
      },
      error: (err: any) => {
        console.error('Error deleting package:', err.message);
        alert(err.message);
      }
    });
  }

  /**
   * Cancel Edit Mode
   */
  cancelEdit() {
    this.packageForm.reset();
    this.isEditMode.set(false);
  }

}

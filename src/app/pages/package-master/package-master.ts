import { Component, ElementRef, inject, OnInit, Output, signal, ViewChild, AfterViewInit, computed } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { PackageMasterModel } from '../../core/model/package-master-model';
import { PackageMasterService } from '../../core/services/package-master/package-master-service';
import { NgClass } from '@angular/common';
import { AlertBox } from '../../shared/reusableComponent/alert-box/alert-box';
import { IAlert } from '../../core/model/alert-model';
import { APP_CONSTANT } from '../../core/constant/appConstant';
import { CommonService } from '../../core/services/common/common-service';
import { Subject, Subscription } from 'rxjs';
import { IPagination } from '../../core/model/pagination-model';

@Component({
  selector: 'app-package-master',
  imports: [ReactiveFormsModule, NgClass, AlertBox, FormsModule],
  templateUrl: './package-master.html',
  styleUrl: './package-master.scss'
})
export class PackageMaster implements OnInit, AfterViewInit {
  title = signal('Package Master Page');

  @ViewChild('insideHeader') insideHeader!: ElementRef;
  @ViewChild('paginationContainer') paginationContainer!: ElementRef;

  packageMasterService = inject(PackageMasterService);
  packageList = signal<PackageMasterModel[]>([]);
  isPackageLoading = signal<boolean>(false);
  isAddUpdatePkgLoader = signal<boolean>(false);
  packageForm: FormGroup;
  addPackageMasterLoader = signal<boolean>(false);
  fb = inject(FormBuilder);

  // data related to alert box - showing on ADD/UPDATE - SUCCESS/ERROR
  @Output() isSuccessAlert = signal<boolean>(false);
  @Output() alertObj = signal<IAlert | any>({});
  isShowAlert = signal<boolean>(false);

  commonService = inject(CommonService);
  isShowCardView = signal<boolean>(false);
  searchText: string = '';
  searchSubject = new Subject<string>();
  subscription!: Subscription;
  filteredSearchText = signal<string>('');

  // pagination data
  pagination: IPagination = {
    totalRecords: 0,
    totalPages: 0,
    pageNumbers: []
  };
  currentPageNo = signal<number>(1);

  filterdPackageList = computed(() => {
    let searchTerm = this.filteredSearchText().toLowerCase();
    let endIndex = this.currentPageNo() * APP_CONSTANT.PAGE_SIZE;

    return this.packageList().slice(0, endIndex).filter(pkg => {
      return pkg.packageName.toLowerCase().includes(searchTerm);
    })
  });

  constructor() {
    this.packageForm = this.fb.group({
      packageId: [0],
      packageName: ['', Validators.required],
      oneTimeTotalCost: ['', Validators.required],
      emiTotalCost: ['', Validators.required],
      maxBranches: ['', Validators.required],
      maxStudents: ['', Validators.required],
      isSmsAlert: [true]
    });
  }

  ngOnInit(): void {
    this.getAllPackages();
  }

  /**
   * set heights of navbar, insideHeader and pagination container height
   */
  ngAfterViewInit(): void {
    APP_CONSTANT.SCREEN_HEIGHTS.INSIDE_HEADER_HEIGHT = this.insideHeader.nativeElement.offsetHeight;
    APP_CONSTANT.SCREEN_HEIGHTS.PAGINATION_HEIGHT = this.paginationContainer.nativeElement.offsetHeight;
    this.commonService.constantHeights.set(APP_CONSTANT.SCREEN_HEIGHTS);
  }

  // toggle between card and table view
  toggleView(flag: boolean) {
    this.isShowCardView.set(flag);
  }

  /**
   * search master value and emit searchTerm in searchSubject
   */
  onSearch() {
    this.searchSubject.next(this.searchText);
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
   * return packageId from packageForm if available
   */
  get pacakgeMasterId() {
    return this.packageForm.get('packageId')?.value;
  }

  onGetPackageList(data: PackageMasterModel[]) {
    this.packageList.set(data || []);

    this.pagination = this.commonService.setPaginationData(data.length);
    this.goToPage(this.currentPageNo());
  }

  /**
  * go to next page
  * @param page 
  */
  goToPage(page: number) {
    if (page > 0 && page <= this.pagination.totalPages) {
      this.currentPageNo.set(page);
    }
  }

  /**
   * Get all packages from server
   */
  getAllPackages() {
    this.isPackageLoading.set(true);
    this.packageMasterService.getAllPackages().subscribe({
      next: (res: any) => {
        // this.showAlert(true, res);
        this.isPackageLoading.set(false);
        this.onGetPackageList(res.data || []);
      },
      error: (err: any) => {
        console.error('Error fetching packages:', err.message);
        this.showAlert(false, err);
        this.isPackageLoading.set(false);
      }
    });
  }

  /**
   * After Add/Update package operations
   */
  onPackageAddUpdate(pkg: any) {
    this.showAlert(true, pkg);
    this.closeModal();
    const res: PackageMasterModel = pkg.data;
    this.isAddUpdatePkgLoader.set(false);
    this.packageForm.reset();

    let index = this.packageList().findIndex((item: PackageMasterModel) => item.packageId === res.packageId);
    if (index === -1) {
      this.packageList().push(res);
    } else {
      this.packageList()[index] = res;
    }
  }

  /**
   * Create new package
   */
  createPackage() {
    if (this.packageForm.valid) {
      this.isAddUpdatePkgLoader.set(true);
      const packageData: PackageMasterModel = this.packageForm.value;

      if (this.pacakgeMasterId) {
        this.updatePackageMaster(packageData);
        return;
      }

      console.log('Creating package with data:', packageData);
      packageData.packageId = 0; // Ensure packageId is 0 for new package

      this.packageMasterService.createPackage(packageData).subscribe({
        next: (res: any) => {
          this.onPackageAddUpdate(res);
        },
        error: (err: any) => {
          console.error('Error creating package:', err);
          this.onAddUpdatePackageError(err);
        }
      });
    } else {
      console.warn('Package form is invalid');
    }
  }

  /**
   * handle error when add/udpate package got failed
   * @param err 
   */
  onAddUpdatePackageError(err: any) {
    console.error('Error updating package:', err.message);
    this.isAddUpdatePkgLoader.set(false);
    this.showAlert(false, err);
  }

  /**
   *  Update existing package
   */
  updatePackageMaster(packageData: PackageMasterModel) {
    this.packageMasterService.updatePackage(packageData).subscribe({
      next: (res: any) => {
        console.log('Package updated successfully:', res);
        this.onPackageAddUpdate(res);
      },
      error: (err: any) => {
        console.error('Error updating package:', err);
        this.onAddUpdatePackageError(err);
      }
    });
  }

  /**
   * @param packageMaster 
   */
  editPackage(packageMaster: PackageMasterModel) {
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
        this.showAlert(true, res);
        let updatedList: PackageMasterModel[] = this.packageList().filter(pkg => pkg.packageId !== id);
        this.onGetPackageList(updatedList);
      },
      error: (err: any) => {
        console.error('Error deleting package:', err.message);
        this.showAlert(true, err);
      }
    });
  }

  /**
   * Cancel Edit Mode
   */
  cancelEdit() {
    this.packageForm.reset();
  }

  /**
 * Close bootstrap modal with id 'staticBackdrop' programmatically.
 */
  private closeModal() {
    const modalEl = document.getElementById('addPackageModal');
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

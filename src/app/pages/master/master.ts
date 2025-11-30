import { Component, effect, inject, OnInit, Output, signal, computed, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MasterService } from '../../core/services/master/master-service';
import { IMaster } from '../../core/model/master-model';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgClass, TitleCasePipe, NgStyle } from '@angular/common';
import { AlertBox } from '../../shared/reusableComponent/alert-box/alert-box';
import { APP_CONSTANT } from '../../core/constant/appConstant';
import { IAlert } from '../../core/model/alert-model';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { IPagination } from '../../core/model/pagination-model';
import { CommonService } from '../../core/services/common/common-service';

@Component({
  selector: 'app-master',
  imports: [ReactiveFormsModule, NgClass, TitleCasePipe, FormsModule, AlertBox, NgStyle],
  templateUrl: './master.html',
  styleUrl: './master.scss'
})
export class Master implements OnInit, AfterViewInit {

  @ViewChild('insideHeader') insideHeader!: ElementRef;
  @ViewChild('paginationContainer') paginationContainer!: ElementRef

  title = signal('Master Page');
  masterService = inject(MasterService);
  isMasterListLoading = signal<boolean>(false);
  isAddUpdateLoader = signal<boolean>(false);
  masterList = signal<IMaster[]>([]);
  masterForm: FormGroup;

  // data related to alert box - showing on ADD/UPDATE - SUCCESS/ERROR
  @Output() isSuccessAlert = signal<boolean>(false);
  @Output() alertObj = signal<IAlert | any>({});
  isShowAlert = signal<boolean>(false);

  masterForList: string[] = ['Payment Mode', 'Reference By'];
  selectedFilter: string = '';

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

  /**
   * set masterList data in new variable after search and pagination
   */
  filteredMasterList = computed(() => {
    let endIndex = this.currentPageNo() * APP_CONSTANT.PAGE_SIZE;
    let searchTerm = this.filteredSearchText().toLowerCase();

    return this.masterList().slice(0, endIndex).filter(master => {
      return master.masterValue.toLowerCase().includes(searchTerm);
    })
  })

  constructor(private readonly fb: FormBuilder) {
    this.masterForm = this.fb.group({
      masterId: [0],
      masterFor: ['', Validators.required],
      masterValue: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getAllMasters();

    this.subscription = this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe({
      next: (searchText => {
        this.filteredSearchText.set(searchText);
      })
    })
  }

  /**
   * set heights of navbar, insideHeader and pagination container height
   */
  ngAfterViewInit(): void {
    APP_CONSTANT.SCREEN_HEIGHTS.INSIDE_HEADER_HEIGHT = this.insideHeader.nativeElement.offsetHeight;
    APP_CONSTANT.SCREEN_HEIGHTS.PAGINATION_HEIGHT = this.paginationContainer.nativeElement.offsetHeight;
    this.commonService.constantHeights.set(APP_CONSTANT.SCREEN_HEIGHTS);
  }

  /**
   * return remaining height after substracting heights of navbar, insideHeader, pagination container height
   */
  get heights() {
    return this.commonService.currentViewportHeight(40);
  }

  /**
   * get masterId from masterForm if availale, used for editing master
   */
  get masterFormControlId() {
    return this.masterForm.get('masterId')?.value || 0;
  }

  /**
   * after get mastetList data, initialize pagination data
   * @param res 
   */
  onGetMasterSuccess(res: any) {
    this.isMasterListLoading.set(false);
    this.masterList.set(res?.data ?? []);

    this.pagination = this.commonService.setPaginationData(res.data.length);
    console.log('pagination data in master list:', this.pagination)
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
   * Get all masters from server
   */
  getAllMasters() {
    this.isMasterListLoading.set(true);
    this.masterService.getAllMasters().subscribe({
      next: (res: any) => {
        // this.showAlert(true, res);
        this.onGetMasterSuccess(res);
      },
      error: (error) => {
        console.log('Error while getting master data:', error);
        this.showAlert(true, error);
      }
    });
  }

  /**
   * search master value and emit searchTerm in searchSubject
   */
  onSearchMaster() {
    this.searchSubject.next(this.searchText);
  }

  // toggle between card and table view
  toggleView(flag: boolean) {
    this.isShowCardView.set(flag);
  }

  /**
   * filter master data basedon paymentMode or referenceBy
   * @param event 
   */
  onTrackByChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedFilter = value;
    if (this.selectedFilter === '') {
      this.getAllMasters();
      return;
    }

    if (this.selectedFilter) {
      this.isMasterListLoading.set(true);
      this.masterService.getMasterByType(this.selectedFilter).subscribe({
        next: (res: any) => {
          this.showAlert(true, res);
          this.onGetMasterSuccess(res);
        },
        error: (error) => {
          console.log('Error while filtering master data:', error);
          this.showAlert(true, error);
        }
      });
    }
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
 * Close bootstrap modal with id 'staticBackdrop' programmatically.
 */
  private closeModal() {
    const modalEl = document.getElementById('masterModal');
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
   * On Master Add or Update reset form and get all masters again
   */
  onMasterAddUpdate(res: any) {
    this.showAlert(true, res);
    this.closeModal();
    this.isAddUpdateLoader.set(false);
    let index = this.masterList().findIndex((item: IMaster) => item.masterId === res.data.masterId);
    if (index === -1) {
      this.masterList().push(res.data);
    } else {
      this.masterList()[index] = res.data;
    }
    this.masterForm.reset();
  }

  /**
   * handle error while create and update master
   * @param error 
   */
  onMastetAddUpdateError(error: any) {
    this.isAddUpdateLoader.set(false);
    this.showAlert(false, error);
  }

  /**
   * Update Master
   */
  updateMaster(master: IMaster) {
    this.masterService.updateMaster(master).subscribe({
      next: (res: any) => {
        this.onMasterAddUpdate(res);
      },
      error: (error) => {
        console.log('Error while updating master:', error);
        this.onMastetAddUpdateError(error);
      }
    })
  }

  /**
   * Create master form here and also update master if in edit mode
   * @returns 
   */
  addUpdateMaster() {
    if (this.masterForm.invalid) {
      return;
    }

    this.isAddUpdateLoader.set(true);
    let req: IMaster = this.masterForm.value;

    if (this.masterFormControlId) {
      this.updateMaster(req);
      return;
    }

    this.createMaster(req);
  }

  /**
   * Create new master from here
   * @param req 
   */
  createMaster(req: IMaster) {
    this.masterService.createMaster(req).subscribe({
      next: (res: any) => {
        this.onMasterAddUpdate(res);
      },
      error: (error) => {
        console.log('Some error while creating master:', error);
        this.onMastetAddUpdateError(error);
      }
    })
  }

  /**
   * Edit Master and set some values to make form in edit mode
   * @param master 
   */
  editMaster(master: IMaster) {
    this.masterForm.patchValue({
      masterId: master.masterId,
      masterFor: master.masterFor,
      masterValue: master.masterValue
    });
  }

  /**
   * Cancel Edit Mode
   */
  cancelEdit() {
    this.masterForm.reset();
  }

  /**
   * Delete master from here and load all masters again
   * @param master 
   */
  deleteMaster(id: number) {
    let isDelete = confirm('Are you sure you want to delete this master?');
    console.log('Delete confirmation result:', isDelete);

    if (!isDelete) {
      return;
    }
    this.masterService.deleteMaster(id).subscribe({
      next: (res: any) => {
        this.showAlert(true, res);
        let updatedList = this.masterList();
        updatedList = updatedList.filter((master: IMaster) => master.masterId != id);
        this.masterList.set(updatedList);
      },
      error: (error) => {
        console.log('Error while deleting master:', error);
        this.showAlert(false, error);
      }
    })
  }

}

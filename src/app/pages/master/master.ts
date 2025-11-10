import { Component, effect, inject, OnInit, Output, signal } from '@angular/core';
import { Header } from '../header/header';
import { MasterService } from '../../core/services/master/master-service';
import { IMaster } from '../../core/model/master-model';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgClass, TitleCasePipe, NgStyle } from '@angular/common';
import { AlertBox } from '../../shared/reusableComponent/alert-box/alert-box';
import { APP_CONSTANT } from '../../core/constant/appConstant';
import { IAlert } from '../../core/model/alert-model';

@Component({
  selector: 'app-master',
  imports: [Header, ReactiveFormsModule, NgClass, TitleCasePipe, FormsModule, AlertBox],
  templateUrl: './master.html',
  styleUrl: './master.scss'
})
export class Master implements OnInit {

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

  constructor(private readonly fb: FormBuilder) {
    this.masterForm = this.fb.group({
      masterId: [0],
      masterFor: ['', Validators.required],
      masterValue: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getAllMasters();
  }

  /**
   * get masterId from masterForm if availale, used for editing master
   */
  get masterFormControlId() {
    return this.masterForm.get('masterId')?.value || 0;
  }

  /**
   * Get all masters from server
   */
  getAllMasters() {
    this.isMasterListLoading.set(true);
    this.masterService.getAllMasters().subscribe({
      next: (res: any) => {
        // this.showAlert(true, res);
        this.isMasterListLoading.set(false);
        this.masterList.set(res?.data ?? []);
      },
      error: (error) => {
        console.log('Error while getting master data:', error);
        this.showAlert(true, error);
      }
    });
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
          this.isMasterListLoading.set(false);
          this.showAlert(true, res);
          this.masterList.set(res?.data ?? []);
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

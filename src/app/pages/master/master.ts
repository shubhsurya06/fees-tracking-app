import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from '../header/header';
import { MasterService } from '../../core/services/master/master-service';
import { IMaster } from '../../core/model/master-model';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgClass, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-master',
  imports: [Header, ReactiveFormsModule, NgClass, TitleCasePipe, FormsModule],
  templateUrl: './master.html',
  styleUrl: './master.scss'
})
export class Master implements OnInit {

  title = signal('Master Page');
  masterService = inject(MasterService);
  getMasterLoader = signal<boolean>(false);
  addMasterLoader = signal<boolean>(false);
  masterList = signal<IMaster[]>([]);
  masterForm!: FormGroup;
  isEditMode = signal<boolean>(false);
  editMasterId = signal<number>(0);

  trackByList: string[] = ['Payment Mode', 'reference By'];
  selectedFilter: string = '';

  constructor(private fb: FormBuilder) {
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
   * Get all masters from server
   */
  getAllMasters() {
    this.getMasterLoader.set(true);
    this.masterService.getAllMasters().subscribe({
      next: (res: any) => {
        this.getMasterLoader.set(false);
        console.log('this is master list:', res.message);
        this.masterList.set(res?.data ?? []);
      },
      error: (error) => {
        console.log('Error while getting master data:', error);
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
    console.log('Selected filter:', value);
    if (this.selectedFilter === '') {
      this.getAllMasters();
      return;
    }

    if (this.selectedFilter) {
      this.getMasterLoader.set(true);
      this.masterService.getMasterByType(this.selectedFilter).subscribe({
        next: (res: any) => {
          this.getMasterLoader.set(false);
          console.log('Filtered master list:', res.message);
          this.masterList.set(res?.data ?? []);
        },
        error: (error) => {
          console.log('Error while filtering master data:', error);
        }
      });
    }
  }

  /**
   * Create master form here and also update master if in edit mode
   * @returns 
   */
  createMaster() {
    if (this.masterForm.invalid) {
      return;
    }

    if (this.isEditMode() && this.editMasterId() > 0) {
      this.updateMaster();
      return;
    }

    this.addMasterLoader.set(true);
    let req: IMaster = {
      masterId: 0,
      masterFor: this.masterForm.value.masterFor,
      masterValue: this.masterForm.value.masterValue,
    }

    this.masterService.createMaster(req).subscribe({
      next: (res: any) => {
        alert(res.message);
        console.log(res.message, ' ', res);
        this.onMasterAddUpdate();
      },
      error: (error) => {
        console.log('Some error while creating master:', error);
      }
    })
  }

  /**
   * On Master Add or Update reset form and get all masters again
   */
  onMasterAddUpdate() {
    this.addMasterLoader.set(false);
    this.getAllMasters();
    this.masterForm.reset();

    if (this.isEditMode() && this.editMasterId() > 0) {
      this.isEditMode.set(false);
      this.editMasterId.set(0)
    }
  }

  /**
   * Edit Master and set some values to make form in edit mode
   * @param master 
   */
  editMaster(master: IMaster) {
    this.isEditMode.set(true);
    this.editMasterId.set(master.masterId);
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
    this.isEditMode.set(false);
    this.editMasterId.set(0)
  }

  /**
   * Update Master
   */
  updateMaster() {
    this.addMasterLoader.set(true);
    let req: IMaster = {
      masterId: this.editMasterId(),
      masterFor: this.masterForm.value.masterFor,
      masterValue: this.masterForm.value.masterValue,
    }

    this.masterService.updateMaster(req).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.onMasterAddUpdate();
      },
      error: (error) => {
        alert(error.message);
        console.log('Error while updating master:', error);
      }
    })
  }

  /**
   * Delete master from here and load all masters again
   * @param master 
   */
  deleteMaster(id: number) {
    this.masterService.deleteMaster(id).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.getAllMasters();
      },
      error: (error) => {
        console.log('Error while deleting master:', error);
      }
    })
  }

}

import { Component, OnInit, Output, inject, signal } from '@angular/core';
import { APP_CONSTANT } from '../../core/constant/appConstant';
import { DatePipe, NgClass, NgFor } from '@angular/common';
import { UserService } from '../../core/services/user/user-service';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { IInstituteModel } from '../../core/model/institute-model';
import { CommonService } from '../../core/services/common/common-service';
import { AlertBox } from '../../shared/reusableComponent/alert-box/alert-box';
import { IAlert } from '../../core/model/alert-model';
import { IStudent } from '../../core/model/student-model';
import { StudentService } from '../../core/services/student/student-service';
import { IMaster } from '../../core/model/master-model';
import { MasterService } from '../../core/services/master/master-service';

@Component({
  selector: 'app-student',
  imports: [AlertBox, ReactiveFormsModule, NgClass, NgFor],
  templateUrl: './student.html',
  styleUrl: './student.scss'
})
export class Student implements OnInit {
  isShowAlert = signal<boolean>(false);
  @Output() isSuccessAlert = signal<boolean>(false);
  @Output() alertObj = signal<IAlert | any>({});

  userService = inject(UserService);
  commonService = inject(CommonService);
  studentService = inject(StudentService);
  isStudentListLoading = signal<boolean>(false);
  isAddEditStudLoader = signal<boolean>(false);
  studentList = signal<IStudent[]>([]);
  instituteAdminRole = APP_CONSTANT.USER_ROLES.INSTITUTE_ADMIN;
  instituteList = signal<IInstituteModel[]>([]);
  refByMasterList = signal<IMaster[]>([]);
  masterService = inject(MasterService);
  studentForm!: FormGroup;
  fb = inject(FormBuilder);
  isAddEditStudentLoader = signal<boolean>(false);
  isShowCardView = signal<boolean>(true);

  constructor() {
    if (!Object.keys(this.userService.loggedInUser()).length) {
      this.userService.getLoggedInUser();
    }

    this.studentForm = this.fb.group({
      studentId: [0, Validators.required],
      refrenceById: [0, Validators.required],
      instituteId: [0, Validators.required],
      name: ['', Validators.required],
      contactNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      qualification: ['', Validators.required],
      collegeName: ['', Validators.required],
      collegeCity: ['', Validators.required],
      familyDetails: ['', Validators.required],
      aadharCard: ['', Validators.required],
      profilePhotoName: ['', Validators.required]
    })

    this.studentForm.controls['instituteId'].setValue(this.userService.loggedInUser().instituteId);

  }

  ngOnInit(): void {
    this.getMasterByReference();
    this.getStudentByInstitute();
  }

  // toggle between card and table view
  toggleView(flag: boolean) {
    this.isShowCardView.set(flag);
  }

  /**
   * get master list for 'Reference By' type from masterService on page load
   */
  getMasterByReference() {
    this.masterService.getMasterByType('Reference By').subscribe({
      next: (res: any) => {
        this.refByMasterList.set(res?.data ?? []);
      },
      error: (error) => {
        console.log('Some error while loading master by ref List in enrollments:', error);
      }
    });
  }

  /**
   * get all students from commonService on page load
   */
  async getStudentByInstitute() {
    let instituteId: number | undefined = this.userService.loggedInUser().instituteId;

    let id = this.userService.loggedInUser().instituteId;

    this.isStudentListLoading.set(true);
    this.studentService.getStudentByInstitute(id).subscribe({
      next: (res: any) => {
        this.isStudentListLoading.set(false);
        this.studentList.set(res.data);
        console.log('getting all studnet list:', res);
      }, error: (error: any) => {
        console.log('Error  while  getting all student  enrollmentslist:', error);
      }
    })
  }

  /**
   * Perform actions when Add/Update student is success
   * @param studentData 
   */
  private onAddEditStudentSuccess(studentData: any) {
    this.isAddEditStudLoader.set(false);
    let res: IStudent = studentData.data;
    this.studentForm.reset();

    try {
      this.closeModal();
    } catch (e) {
      // ignore if bootstrap not available
    }
    this.cancelEdit();

    // Update the branch list
    this.studentList.update(list => {
      const index = list.findIndex(b => b.studentId === res.studentId);
      if (index === -1) {
        return [...list, res];
      } else {
        list[index] = res;
        return [...list];
      }
    })
  }

  /**
   * Perform actions when Add/Edit student having any error
   * @param err 
   */
  handleStudentAddEditError(err: any) {
    this.isAddEditStudLoader.set(false);
    alert(err.message);
  }

  /**
   * Add/Update new student from here
   * @returns 
   */
  createStudent() {
    if (this.studentForm.invalid) {
      alert('Please enter all fields of form.')
      return;
    }

    console.log('Student form details:', this.studentForm.value);

    this.isAddEditStudLoader.set(true);
    const studentData: IStudent = this.studentForm.value;

    if (studentData.studentId) {
      // Update existing branch
      this.studentService.updateStudent(studentData).subscribe({
        next: (res: any) => {
          this.onAddEditStudentSuccess(res);
        },
        error: this.handleStudentAddEditError.bind(this)
      });
    } else {
      // Create new branch
      this.studentService.createStudent(studentData).subscribe({
        next: (res: any) => {
          this.onAddEditStudentSuccess(res);
        },
        error: this.handleStudentAddEditError.bind(this)
      });
    }
  }

  /**
   * Set student data from here when click on edit student button
   * @param student 
   */
  editStudent(student: IStudent) {
    this.studentForm.patchValue(student);
  }

  /**
   * When student is in edit mode and student cancels edit, then perform form reset
   */
  cancelEdit() {
    this.studentForm.reset();
  }

  /**
   * delete student data from here and update studentList
   * @param id 
   * @returns 
   */
  deleteStudent(id: number) {
    if (!id) return;

    const isConfirmed = confirm('Are you sure you want to delete this Student?');
    if (!isConfirmed) return;

    this.studentService.deleteStudent(id).subscribe({
      next: (res: any) => {
        this.studentList.update(list => list.filter(b => b.studentId !== id));
      },
      error: (error: any) => {
        console.error('Error deleting branch:', error);
      }
    });
  }

  /**
   * Close bootstrap modal with id 'staticBackdrop' programmatically.
   */
  private closeModal() {
    const modalEl = document.getElementById('studentModalId');
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

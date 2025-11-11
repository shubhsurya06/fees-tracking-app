import { Component, signal, inject, Output, OnInit } from '@angular/core';
import { AlertBox } from '../../shared/reusableComponent/alert-box/alert-box';
import { IAlert } from '../../core/model/alert-model';
import { IEnrollment } from '../../core/model/enrollment-model';
import { CommonService } from '../../core/services/common/common-service';
import { IInstituteModel } from '../../core/model/institute-model';
import { UserService } from '../../core/services/user/user-service';
import { EnrollmentService } from '../../core/services/enrollment/enrollment-service';
import { DatePipe, NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ICourses } from '../../core/model/course-model';
import { IMaster } from '../../core/model/master-model';
import { CourseService } from '../../core/services/course/course-service';
import { MasterService } from '../../core/services/master/master-service';

@Component({
  selector: 'app-enrollment',
  imports: [AlertBox, DatePipe, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './enrollment.html',
  styleUrl: './enrollment.scss'
})
export class Enrollment implements OnInit {
  isShowAlert = signal<boolean>(false);
  @Output() isSuccessAlert = signal<boolean>(false);
  @Output() alertObj = signal<IAlert | any>({});

  commonService = inject(CommonService);
  userService = inject(UserService);
  enrollmentService = inject(EnrollmentService);
  courseService = inject(CourseService);
  masterService = inject(MasterService);
  isEnrollmentListLoading = signal<boolean>(false);
  isAddEditEnrollment = signal<boolean>(false);
  instituteList = signal<IInstituteModel[]>([]);
  courseList = signal<ICourses[]>([]);
  refByMasterList = signal<IMaster[]>([]);
  enrollmentList = signal<any[]>([]);
  enrollmentForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    if (!Object.keys(this.userService.loggedInUser()).length) {
      this.userService.getLoggedInUser();
    }

    this.enrollmentForm = this.fb.group({
      courseId: [0, Validators.required],
      enrollmentDoneByUserId: [0, Validators.required],
      finalAmount: [0, Validators.required],
      discountGiven: [0, Validators.required],
      discountApprovedByUserId: [0, Validators.required],
      refrenceById: [0, Validators.required],
      instituteId: [0, Validators.required],
      isFeesCompleted: [false, Validators.required],
      enrollmentDate: [new Date(), Validators.required],
      name: ['', Validators.required],
      contactNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      qualification: ['', Validators.required],
      collegeName: ['', Validators.required],
      collegeCity: ['', Validators.required],
      familyDetails: ['', Validators.required],
      aadharCard: ['', [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
      profilePhotoName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('current logged in user:', this.userService.loggedInUser());
    this.getAllInstitutes();
    this.getAllCourse();
    this.getMasterByReference();
    this.getInstituteEnrollments();
  }

  get f() { return this.enrollmentForm.controls; }

  /**
  * get all institutes from commonService on page load
  */
  async getAllInstitutes() {
    let list = await this.commonService.returnAllInstitute();
    this.instituteList.set(list);
  }

  getAllCourse() {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.courseList.set(res)
      }, error: (err) => {
        console.error('Some error while loading course List in enrollments:', err);
      }
    })
  }

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

  getInstituteEnrollments() {
    let id = this.userService.loggedInUser().instituteId;

    this.isEnrollmentListLoading.set(true);
    this.enrollmentService.getInstituteEnrollments(id).subscribe({
      next: (res: any) => {
        this.isEnrollmentListLoading.set(false);
        this.enrollmentList.set(res.data);
        console.log('getting all institute enrollments:', res);
      }, error: (error: any) => {
        console.log('Error  while  getting all institute enrollments:', error);
      }
    })
  }

  editEnrollment(enrollment: any) {

    this.enrollmentForm.patchValue({
      enrollmentId: enrollment.enrollmentId,
      studentId: enrollment.enrollmentId,
      courseId: enrollment.enrollmentId,
      enrollmentDoneByUserId: enrollment.enrollmentId,
      enrollmentDate: enrollment.enrollmentId,
      finalAmount: enrollment.enrollmentId,
      discountGiven: enrollment.enrollmentId,
      discountApprovedByUserId: enrollment.enrollmentId,
      isFeesCompleted: enrollment.enrollmentId,
      isConfirmed: enrollment.enrollmentId,
    })
  }

  deleteEnrollment(id: number) {

  }

  // Returns yyyy-MM-dd (for input type="date")
  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // V3 Validation: show error if touched OR form submitted
  showError(controlName: string): boolean {
    const control = this.enrollmentForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  onSubmit() {
    this.submitted = true;

    if (this.enrollmentForm.invalid) {
      this.enrollmentForm.markAllAsTouched();
      return;
    }

    this.isAddEditEnrollment.set(true);

    console.log('✅ Enrollment Form Submitted:', this.enrollmentForm.value);

    // TODO: API CALL HERE

    // Reset flags after successful submit
    this.submitted = false;
    this.enrollmentForm.reset();
    // this.initForm(); // resets date to today again
  }

}

import { Component, signal, inject, Output, OnInit } from '@angular/core';
import { AlertBox } from '../../shared/reusableComponent/alert-box/alert-box';
import { IAlert } from '../../core/model/alert-model';
import { IEnrollment } from '../../core/model/enrollment-model';
import { CommonService } from '../../core/services/common/common-service';
import { IInstituteModel } from '../../core/model/institute-model';
import { UserService } from '../../core/services/user/user-service';
import { EnrollmentService } from '../../core/services/enrollment/enrollment-service';
import { DatePipe, NgIf } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-enrollment',
  imports: [AlertBox, DatePipe, ReactiveFormsModule, NgIf],
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
  isEnrollmentListLoading = signal<boolean>(false);
  instituteList = signal<IInstituteModel[]>([]);
  enrollmentList = signal<any[]>([]);
  enrollmentForm!: FormGroup;
  submitted = false;


  // Dummy Dropdown Data
  courseList = [
    { id: 1, name: 'Computer Technology' },
    { id: 2, name: 'Web Development' },
    { id: 3, name: 'Full Stack Developer' }
  ];

  referenceList = [
    { id: 1, name: 'Friend' },
    { id: 2, name: 'Facebook' },
    { id: 3, name: 'Walk-In' }
  ];

  instituteList1 = [
    { id: 1, name: 'Main Branch' },
    { id: 2, name: 'Branch 2' },
    { id: 3, name: 'Branch 3' }
  ];

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
      courseId: enrollment.courseId,
      enrollmentDoneByUserId: enrollment.enrollmentDoneByUserId,
      finalAmount: enrollment.finalAmount,
      discountGiven: enrollment.discountGiven,
      discountApprovedByUserId: enrollment.discountApprovedByUserId,
      refrenceById: enrollment.refrenceById,
      instituteId: enrollment.instituteId,
      isFeesCompleted: enrollment.isFeesCompleted,
      enrollmentDate: enrollment.enrollmentDate,
      name: enrollment.name,
      contactNo: enrollment.contactNo,
      email: enrollment.email,
      city: enrollment.city,
      state: enrollment.state,
      pincode: enrollment.pincode,
      qualification: enrollment.qualification,
      collegeName: enrollment.collegeName,
      collegeCity: enrollment.collegeCity,
      familyDetails: enrollment.familyDetails,
      aadharCard: enrollment.aadharCard,
      profilePhotoName: enrollment.profilePhotoName
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

    console.log('✅ Enrollment Form Submitted:', this.enrollmentForm.value);

    // TODO: API CALL HERE

    // Reset flags after successful submit
    this.submitted = false;
    this.enrollmentForm.reset();
    // this.initForm(); // resets date to today again
  }

}

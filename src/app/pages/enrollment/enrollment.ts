import { Component, signal, inject, Output, OnInit } from '@angular/core';
import { AlertBox } from '../../shared/reusableComponent/alert-box/alert-box';
import { IAlert } from '../../core/model/alert-model';
import { IEnrollment } from '../../core/model/enrollment-model';
import { CommonService } from '../../core/services/common/common-service';
import { IInstituteModel } from '../../core/model/institute-model';
import { UserService } from '../../core/services/user/user-service';
import { EnrollmentService } from '../../core/services/enrollment/enrollment-service';
import { DatePipe, NgIf, NgFor, NgClass } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ICourses } from '../../core/model/course-model';
import { IMaster } from '../../core/model/master-model';
import { CourseService } from '../../core/services/course/course-service';
import { MasterService } from '../../core/services/master/master-service';
import { APP_CONSTANT } from '../../core/constant/appConstant';

@Component({
  selector: 'app-enrollment',
  imports: [AlertBox, DatePipe, ReactiveFormsModule, NgIf, NgFor, NgClass],
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
  editEnrollmentForm!: FormGroup;
  submitted = false;
  isShowCardView = signal<boolean>(false);

  // filter related changes starts
  filter = {
    studentId: 0,
    courseId: 0,
    fromDate: "",
    toDate: "",
    pageNumber: 1,
    pageSize: 5,
    sortBy: "",
    sortDirection: ""
  }

  totalRecords: number = 0;
  totalPages: number = 0;
  pageNumbers: number[] = [];
  isPaginationLoader = signal<boolean>(false);
  // filter related changes ends

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

    this.enrollmentForm.controls['enrollmentDoneByUserId'].setValue(this.userService.loggedInUser().userId);
    this.enrollmentForm.controls['discountApprovedByUserId'].setValue(this.userService.loggedInUser().userId);
    if (this.userService.loggedInUser().role === APP_CONSTANT.USER_ROLES.INSTITUTE_ADMIN) {
      this.enrollmentForm.controls['instituteId'].setValue(this.userService.loggedInUser().instituteId);
    }

    this.editEnrollmentForm = this.fb.group({
      enrollmentId: [0],
      studentId: [0],
      courseId: ['', Validators.required],
      enrollmentDoneByUserId: [0],
      enrollmentDate: [new Date(), Validators.required],
      finalAmount: [0, [Validators.required, Validators.min(0)]],
      discountGiven: [0, [Validators.min(0)]],
      discountApprovedByUserId: [0],
      isFeesCompleted: [false],
      isConfirmed: [false]
    });
  }

  ngOnInit(): void {
    console.log('current logged in user:', this.userService.loggedInUser());
    this.getAllInstitutes();
    this.getAllCourse();
    this.getMasterByReference();
    this.getInstituteEnrollments();
    // this.getEnrollmentNByFilter()
  }

  get f() { return this.enrollmentForm.controls; }

  // toggle between card and table view
  toggleView(flag: boolean) {
    this.isShowCardView.set(flag);
  }

  /**
  * get all institutes from commonService on page load
  */
  async getAllInstitutes() {
    let list = await this.commonService.returnAllInstitute();
    this.instituteList.set(list);
  }

  /**
   * get all courses from courseService on page load
   */
  getAllCourse() {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.courseList.set(res);
      }, error: (err) => {
        console.error('Some error while loading course List in enrollments:', err);
      }
    })
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
   * get all enrollments for logged in user's institute from enrollmentService on page load
   */
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

  // get all pending enrollments whose payments has not been completed
  getPendingEnrollments() {
    let id = this.userService.loggedInUser().instituteId;
    this.isEnrollmentListLoading.set(true);
    this.enrollmentService.getPendingEnrollments(id).subscribe({
      next: (res: any) => {
        this.isEnrollmentListLoading.set(false);
        res.data.map((enrll: IEnrollment) => {
          enrll.enrollmentName = enrll.studentName + ', ' + enrll?.courseName;
          return enrll;
        });
        this.enrollmentList.set(res.data);
      },
      error: (err: any) => {
        this.isEnrollmentListLoading.set(false);
        console.log('Error while fetching enrollments', err);
      }
    });
  }

  getEnrollmentNByFilter(isPaginated: boolean = false) {

    isPaginated ? this.isPaginationLoader.set(true) : this.isEnrollmentListLoading.set(true);

    this.enrollmentService.getEnrollmentNByFilter(this.filter).subscribe({
      next: (result: any) => {
        isPaginated ? this.isPaginationLoader.set(false) : this.isEnrollmentListLoading.set(false);

        this.enrollmentList.update(old => [...old, ...result.data]);

        this.totalRecords = result.totalRecords;
        this.totalPages = Math.ceil(this.totalRecords / this.filter.pageSize);
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (error: any) => {
        console.error('Error fetching enrollments:', error);
      }
    })
  }

  goToPage(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.filter.pageNumber = pageNumber;
      this.getEnrollmentNByFilter(true);
    }
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

  /**
   * Handle after add or update enrollment
   * @param res API response
   */
  onAddUpdateEnrollment(res: any, isFromAdd: boolean) {
    this.isAddEditEnrollment.set(false);
    this.submitted = false;
    this.enrollmentForm.reset();
    if (isFromAdd) {
      this.closeModal();
    } else {
      this.closeModalEdit();
    }

    this.enrollmentList.update(list => {
      let index = list.findIndex(item => item.enrollmentId === res.data.enrollmentId);
      if (index === -1) {
        return [...list, res.data];
      } else {
        let item = list[index];
        item.finalAmount = res.data.finalAmount;
        item.discountGiven = res.data.discountGiven;
        item.enrollmentDate = res.data.enrollmentDate;
        item.isFeesCompleted = res.data.isFeesCompleted;
        item.isConfirmed = res.data.isConfirmed;
        list[index] = item;
        return [...list];
      }
    })
  }

  /**
   * Handle form submission for adding new enrollment
   */
  onSubmit() {
    this.submitted = true;

    if (this.enrollmentForm.invalid) {
      this.enrollmentForm.markAllAsTouched();
      return;
    }

    this.isAddEditEnrollment.set(true);

    if (this.userService.loggedInUser().role == APP_CONSTANT.USER_ROLES.SYSTEM_ADMIN) {
      this.enrollmentForm.controls['instituteId'].setValue(Number(this.enrollmentForm.value.instituteId));
    }

    this.enrollmentForm.patchValue({
      refrenceById: Number(this.enrollmentForm.value.refrenceById)
    });

    let enrollment: IEnrollment = this.enrollmentForm.value;

    console.log('✅ Enrollment Form Submitted:', enrollment);

    // TODO: API CALL HERE
    this.enrollmentService.createStudentEnrollment(enrollment).subscribe({
      next: (res: any) => {
        this.onAddUpdateEnrollment(res, true);
      }, error: (error: any) => {
        this.isAddEditEnrollment.set(false);
        console.error('Some error while adding enrollment:', error);
      }
    })
    // this.initForm(); // resets date to today again
  }

  /**
   * Handle form submission for editing existing enrollment
   */
  onEditEnrollment() {
    this.isAddEditEnrollment.set(true);

    this.editEnrollmentForm.patchValue({
      discountApprovedByUserId: this.userService.loggedInUser().userId,
      enrollmentDoneByUserId: this.userService.loggedInUser().userId,
      enrollmentDate: new Date(this.editEnrollmentForm.value.enrollmentDate).toISOString()
    });

    let enrollment: IEnrollment = this.editEnrollmentForm.value;

    console.log('✅ Enrollment Form Submitted:', enrollment);

    // TODO: API CALL HERE
    this.enrollmentService.updateEnrollment(enrollment).subscribe({
      next: (res: any) => {
        let obj = {
          message: 'Enrollment updated successfully',
          data: enrollment
        }
        this.onAddUpdateEnrollment(obj, false);
      }, error: (error: any) => {
        this.isAddEditEnrollment.set(false);
        console.error('Some error while adding enrollment:', error);
      }
    })
  }

  /**
   * Populate editEnrollmentForm with selected enrollment data
   * @param enrollment selected enrollment data
   */
  editEnrollment(enrollment: any) {
    let course: any = this.courseList().find(c => c.courseName === enrollment.courseName);

    this.editEnrollmentForm.patchValue({
      enrollmentId: enrollment.enrollmentId,
      studentId: enrollment.studentId,
      courseId: course.courseId,
      enrollmentDoneByUserId: enrollment.enrollmentDoneByUserId,
      enrollmentDate: enrollment.enrollmentDate ? enrollment.enrollmentDate.split('T')[0] : '',
      finalAmount: enrollment.finalAmount,
      discountGiven: enrollment.discountGiven,
      discountApprovedByUserId: enrollment.discountApprovedByUserId,
      isFeesCompleted: enrollment.isFeesCompleted,
      isConfirmed: enrollment.isConfirmed,
    })
  }

  /**
   *  Delete enrollment by id
   * @param id 
   * @returns 
   */
  deleteEnrollment(id: number) {
    if (!confirm('Are you sure you want to delete this enrollment?')) {
      return;
    }
    this.enrollmentService.deleteEnrollment(id).subscribe({
      next: (res: any) => {
        this.enrollmentList.update(list => list.filter(item => item.enrollmentId !== id));
        this.isSuccessAlert.set(true);
        this.alertObj.set({
          type: 'success',
          message: 'Enrollment deleted successfully'
        });
        this.isShowAlert.set(true);
        setTimeout(() => {
          this.isShowAlert.set(false);
        }, APP_CONSTANT.TIMEOUT);
      }, error: (error: any) => {
        console.error('Some error while deleting enrollment:', error);
      }
    })
  }

  /**
   * Close bootstrap modal with id 'staticBackdrop' programmatically.
   */
  private closeModal() {
    const modalEl = document.getElementById('enrollmentModal');
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

  /*
    * Close bootstrap modal with id 'editEnrollmentModal' programmatically.
  */
  private closeModalEdit() {
    const modalEl = document.getElementById('editEnrollmentModal');
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

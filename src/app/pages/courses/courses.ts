import { Component, OnInit, Output, inject, signal } from '@angular/core';
import { ICourses } from '../../core/model/course-model';
import { CourseService } from '../../core/services/course/course-service';
import { APP_CONSTANT } from '../../core/constant/appConstant';
import { DatePipe, NgClass } from '@angular/common';
import { UserService } from '../../core/services/user/user-service';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { IInstituteModel } from '../../core/model/institute-model';
import { CommonService } from '../../core/services/common/common-service';
import { AlertBox } from '../../shared/reusableComponent/alert-box/alert-box';
import { IAlert } from '../../core/model/alert-model';

@Component({
  selector: 'app-courses',
  imports: [DatePipe, ReactiveFormsModule, NgClass, AlertBox],
  templateUrl: './courses.html',
  styleUrl: './courses.scss'
})
export class Courses implements OnInit {

  courseService = inject(CourseService);
  userService = inject(UserService);
  commonService = inject(CommonService);
  isCourseListLoading = signal<boolean>(false);
  isAddUpdateLoader = signal<boolean>(false);
  courseList = signal<ICourses[]>([]);
  instituteAdminRole = APP_CONSTANT.USER_ROLES.INSTITUTE_ADMIN;
  instituteList = signal<IInstituteModel[]>([]);
  courseForm!: FormGroup;
  isAddEditCourseLoader = signal<boolean>(false);

  isShowAlert = signal<boolean>(false);
  @Output() isSuccessAlert = signal<boolean>(false);
  @Output() alertObj = signal<IAlert | any>({});

  constructor(private fb: FormBuilder) {

    this.courseForm = this.fb.group({
      courseId: [0],
      courseName: ['', Validators.required],
      courseCost: ['', Validators.required],
      creratedDate: [Date.now()],
      isActive: [true],
      duration: ['', Validators.required],
      instituteId: ['', Validators.required],
      courseDescription: ['', Validators.required]
    });

    if (!Object.keys(this.userService.loggedInUser()).length) {
      this.userService.getLoggedInUser();
    }

    // set default loggedIn user's instituteId in the form if he is instituteAdmin
    if (this.userService.loggedInUser().role === this.instituteAdminRole) {
      this.courseForm.controls['instituteId'].setValue(this.userService.loggedInUser().instituteId);
      console.log('this is institute role::', this.courseForm.value.instituteId, this.courseForm);
    }
  }

  ngOnInit(): void {
    this.getAllInstitutes();
    this.getAllCourses();
  }

  /**
  * get all institutes from commonService on page load
  */
  async getAllInstitutes() {
    let list = await this.commonService.returnAllInstitute();
    this.instituteList.set(list);
  }

  /**
   * Get all course list from here
   */
  getAllCourses() {
    this.isCourseListLoading.set(true);
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.isCourseListLoading.set(false);
        this.courseList.set(res)
      }, error: (err) => {
        this.showAlert(false, err);
      }
    })
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
   * when branch add/udpate gets success, then reset loader, update list
   * @param branchData 
   * @param message 
   */
  private handleCourseSuccess(courseData: any, prevCourseId: number) {
    this.showAlert(true, courseData);
    this.isAddEditCourseLoader.set(false);
    try {
      this.closeModal();
    } catch (e) {
      // ignore if bootstrap not available
    }
    this.cancelEdit();

    // if course is updated, then call getAllCourse(), as API returning only message, not data
    if (prevCourseId) {
      this.getAllCourses();
    } else {
      // if new course is added, then modify data only
      this.courseList.update(list => {
        const index = list.findIndex(c => c.courseId === courseData.data.courseId);
        if (index === -1) {
          return [...list, courseData.data];
        } else {
          list[index] = courseData.data;
          return [...list];
        }
      });
    }
  }

  /**
   * Set loader to false, when branch add/edit gets failed
   * @param error 
   */
  private handleCourseError(error: any) {
    console.error('Error saving course:', error);
    this.showAlert(false, error);
    this.isAddEditCourseLoader.set(false);
  }

  /**
   * update course from here and send data to API for update
   * @param courseData 
   */
  private updateCourse(courseData: ICourses) {
    this.courseService.updateCourse(courseData).subscribe({
      next: (res: any) => {
        this.handleCourseSuccess(res, courseData.courseId);
      },
      error: this.handleCourseError.bind(this)
    });
  }

  private createCourse(courseData: ICourses) {
    courseData.creratedDate = new Date(courseData.creratedDate).toISOString();
    // Create new branch
    this.courseService.createCourse(courseData).subscribe({
      next: (res: any) => {
        this.handleCourseSuccess(res, courseData.courseId);
      },
      error: this.handleCourseError.bind(this)
    });
  }

  /**
   * add / edit course from here
   * @returns 
   */
  addEditCourse() {
    if (this.courseForm.invalid) {
      return;
    }

    this.isAddEditCourseLoader.set(true);
    const courseData: ICourses = this.courseForm.value;

    if (courseData.courseId) {
      // Update existing branch
      this.updateCourse(courseData);
    } else {
      this.createCourse(courseData);
    }
  }

  private closeModal() {
    const modalEl = document.getElementById('courseModal');
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
   * when click on edit course, set formData
   * @param course 
   */
  editCourse(course: ICourses) {
    this.courseForm.patchValue({
      courseId: course.courseId,
      courseName: course.courseName,
      courseCost: course.courseCost,
      creratedDate: course.creratedDate,
      isActive: course.isActive,
      duration: course.duration,
      instituteId: course.instituteId,
      courseDescription: course.courseDescription
    })
  }

  /**
   * Call delete course API from here and delete course
   * @param courseId 
   * @returns 
   */
  deleteCourse(courseId: number) {
    if (!courseId) return;

    const isConfirmed = confirm('Are you sure you want to delete this course?');
    if (!isConfirmed) return;

    this.courseService.deleteCourse(courseId).subscribe({
      next: (res: any) => {
        console.log('Course deleted successfully: ', res);
        this.showAlert(true, res);
        this.courseList.update(list => list.filter(c => c.courseId !== courseId));
      },
      error: (error: any) => {
        console.error('Error deleting Course:', error);
        this.showAlert(true, error);
      }
    });
  }

  /**
   * When user was editing course, but later don't wants to edit, and cancels edit course, reset form data
   */
  cancelEdit() {
    this.courseForm.reset();
  }

}


// {
//   "message": "Course created successfully",
//   "data": {
//     "courseId": 1,
//     "courseName": "Computer Science",
//     "courseCost": 20000,
//     "duration": "3 months",
//     "creratedDate": "2025-11-08T08:35:30.5661189+05:30",
//     "courseDescription": "basic computer science course"
//     "isActive": true,
//     "instituteId": 10,
//   }
// }

// add toggle button to change view from CARD to TABLE
//
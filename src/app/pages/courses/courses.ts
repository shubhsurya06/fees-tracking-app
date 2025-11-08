import { Component, OnInit, inject, signal } from '@angular/core';
import { ICourses } from '../../core/model/course-model';
import { CourseService } from '../../core/services/course/course-service';
import { APP_CONSTANT } from '../../core/constant/appConstant';
import { Header } from '../header/header';
import { DatePipe } from '@angular/common';
import { UserService } from '../../core/services/user/user-service';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-courses',
  imports: [Header, DatePipe, ReactiveFormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.scss'
})
export class Courses implements OnInit {

  courseService = inject(CourseService);
  userService = inject(UserService);
  isCourseListLoading = signal<boolean>(false);
  isAddUpdateLoader = signal<boolean>(false);
  courseList = signal<ICourses[]>([]);
  instituteRole = APP_CONSTANT.USER_ROLES.INSTITUTE_ADMIN;
  courseForm!: FormGroup;

  constructor(private fb: FormBuilder) {

    this.courseForm = this.fb.group({
      courseId: [0],
      courseName: ['', Validators.required],
      courseCost: ['', Validators.required],
      creratedDate: ['', Validators.required],
      isActive: ['', Validators.required],
      duration: ['', Validators.required],
      instituteId: ['', Validators.required],
      courseDescription: ['', Validators.required]
    });

    if (!Object.keys(this.userService.loggedInUser()).length) {
      this.userService.getLoggedInUser();
    }

    if (this.userService.loggedInUser().role === this.instituteRole) {
      this.courseForm.controls['instituteId'].setValue(this.userService.loggedInUser().instituteId);
      console.log('this is institute role::', this.courseForm.value.instituteId, this.courseForm);
    }


  }

  ngOnInit(): void {
    this.getAllCourses();
  }

  getAllCourses() {
    this.isCourseListLoading.set(true);
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.isCourseListLoading.set(false);
        this.courseList.set(res)
      }, error: (err) => {

      }
    })
  }


  editCourse(course: ICourses) {

  }

  deleteCourse(course: ICourses) {

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
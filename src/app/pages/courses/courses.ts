import { Component, OnInit, inject, signal } from '@angular/core';
import { ICourses } from '../../core/model/course-model';
import { CourseService } from '../../core/services/course/course-service';
import { ApiConstant } from '../../core/constant/constant';
import { Header } from '../header/header';

@Component({
  selector: 'app-courses',
  imports: [Header],
  templateUrl: './courses.html',
  styleUrl: './courses.scss'
})
export class Courses implements OnInit {

  courseService = inject(CourseService);
  isCourseListLoading = signal<boolean>(false);
  isAddUpdateLoader = signal<boolean>(false);
  courseList = signal<ICourses[]>([]);

  constructor() {

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

}


// {
//   "message": "Course created successfully",
//   "data": {
//     "courseId": 1,
//     "courseName": "Computer Science",
//     "courseCost": 20000,
//     "creratedDate": "2025-11-08T08:35:30.5661189+05:30",
//     "isActive": true,
//     "duration": "3 months",
//     "instituteId": 10,
//     "courseDescription": "basic computer science course"
//   }
// }

// add toggle button to change view from CARD to TABLE
//
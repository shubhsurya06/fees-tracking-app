import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_CONSTANT } from '../../constant/apiConstant';
import { APP_CONSTANT } from '../../constant/appConstant';
import { delay } from 'rxjs';
import { ICourses } from '../../model/course-model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  http = inject(HttpClient);
  baseUrl = environment.API_URL;


  /**
   * get all course list
   * @returns 
  */
  getAllCourses() {
    let url = this.baseUrl + API_CONSTANT.CONTROLLER_TYPES.COURSE + API_CONSTANT.COURSE_APIS.GET_ALL_COURSES;
    return this.http.get(url).pipe(
      delay(500)
    );
  }

  /**
   * Call createCourse API from here and create course
   * @param courseData 
   * @returns 
   */
  createCourse(courseData: ICourses) {
    let url = this.baseUrl + API_CONSTANT.CONTROLLER_TYPES.COURSE + API_CONSTANT.COURSE_APIS.CREATE_COURSES;
    return this.http.post(url, courseData);
  }

  /**
   * Call updateCourse API from here and udpate course
   * @param courseData 
   * @returns 
   */
  updateCourse(courseData: ICourses) {
    let url = this.baseUrl + API_CONSTANT.CONTROLLER_TYPES.COURSE + API_CONSTANT.COURSE_APIS.UPDATE_COURSES;
    return this.http.put(url, courseData);
  }

  
  /**
   * Call deleteCourse API from here and delete course
   * @param courseData 
   * @returns 
   */
  deleteCourse(id: number | undefined) {
    return this.http.delete(`${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.COURSE}${API_CONSTANT.COURSE_APIS.DELETE_COURSES}${APP_CONSTANT.SLASH_CONST}${id}`);
  }
}

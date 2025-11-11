import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_CONSTANT } from '../../constant/apiConstant';
import { APP_CONSTANT } from '../../constant/appConstant';
import { delay } from 'rxjs';
import { IEnrollment } from '../../model/enrollment-model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  http = inject(HttpClient);
  baseUrl = environment.API_URL;


  /**
   * get all course list
   * @returns 
  */
  getInstituteEnrollments(id: number | undefined) {
    let url = this.baseUrl + API_CONSTANT.CONTROLLER_TYPES.ENROLLMENT + API_CONSTANT.ENROLLMENT_APIS.GET_ALL_ENROLLMENT + APP_CONSTANT.SLASH_CONST + id;
    return this.http.get(url).pipe(
      delay(1000)
    );
  }

  /**
   * Call createCourse API from here and create course
   * @param courseData 
   * @returns 
   */
  createStudentEnrollment(enrollment: IEnrollment) {
    let url = this.baseUrl + API_CONSTANT.CONTROLLER_TYPES.ENROLLMENT + API_CONSTANT.ENROLLMENT_APIS.CREATE_ENROLLMENT;
    return this.http.post(url, enrollment).pipe(
      delay(500)
    );
  }

  /**
   * Call updateCourse API from here and udpate course
   * @param courseData 
   * @returns 
   */
  updateCourse(courseData: IEnrollment) {
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

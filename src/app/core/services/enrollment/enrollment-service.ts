import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_CONSTANT } from '../../constant/apiConstant';
import { APP_CONSTANT } from '../../constant/appConstant';
import { delay, map } from 'rxjs';
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

  getPendingEnrollments(id: number | undefined) {
    let url = this.baseUrl + API_CONSTANT.CONTROLLER_TYPES.ENROLLMENT + API_CONSTANT.ENROLLMENT_APIS.GET_ALL_PENDING + APP_CONSTANT.SLASH_CONST + id;
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
   * Call updateEnrollment API from here and udpate enrollment
   * @param courseData 
   * @returns 
   */
  updateEnrollment(enrollment: any) {
    let url = this.baseUrl + API_CONSTANT.CONTROLLER_TYPES.ENROLLMENT + API_CONSTANT.ENROLLMENT_APIS.UPDATE_ENROLLMENT;
    return this.http.put(url + APP_CONSTANT.SLASH_CONST + enrollment.enrollmentId, enrollment);
    // .pipe(
    //   map((res: any) => {
    //     let obj = {
    //       message: 'Enrollment updated successfully',
    //       data: res.data
    //     }
    //     return obj;
    //   }
    // ));
  }


  /**
   * Call deleteEnrollment API from here and delete enrollment
   * @param courseData 
   * @returns 
   */
  deleteEnrollment(id: number | undefined) {
    return this.http.delete(`${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.ENROLLMENT}${API_CONSTANT.ENROLLMENT_APIS.DELETE_ENROLLMENT}${APP_CONSTANT.SLASH_CONST}${id}`);
  }
}

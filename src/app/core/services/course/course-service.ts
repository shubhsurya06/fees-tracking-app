import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_CONSTANT } from '../../constant/apiConstant';
import { APP_CONSTANT } from '../../constant/appConstant';
import { delay } from 'rxjs';

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
      delay(1000)
    );
  }
}

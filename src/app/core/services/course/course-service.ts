import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiConstant } from '../../constant/constant';
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
    let url = this.baseUrl + ApiConstant.CONTROLLER_TYPES.COURSE + ApiConstant.COURSE_APIS.GET_ALL_COURSES;
    return this.http.get(url).pipe(
      delay(1000)
    );
  }
}

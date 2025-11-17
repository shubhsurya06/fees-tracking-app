import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_CONSTANT } from '../../constant/apiConstant';
import { APP_CONSTANT } from '../../constant/appConstant';
import { delay } from 'rxjs/operators';
import { IStudent } from '../../model/student-model';


@Injectable({
  providedIn: 'root'
})
export class StudentService {
  http = inject(HttpClient)
  baseUrl: string = environment.API_URL;

  getStudentByInstitute(id: number | undefined) {
    let url = `${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.STUDENT}${API_CONSTANT.STUDENT_APIS.GET_STUDENT_BY_INSTITUTE}`;
    return this.http.get(url + APP_CONSTANT.SLASH_CONST + id);
  }

  createStudent(student: IStudent) {
    let url = `${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.STUDENT}`;
    return this.http.post(url, student);
  }

  updateStudent(student: IStudent) {
    let url = `${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.STUDENT}`;
    return this.http.put(url + APP_CONSTANT.SLASH_CONST + student.studentId, student);
  }

  deleteStudent(id: number) {
    let url = `${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.STUDENT}`;
    return this.http.delete(url + APP_CONSTANT.SLASH_CONST + id);
  }
}

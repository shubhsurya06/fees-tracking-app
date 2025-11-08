import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_CONSTANT } from '../../constant/apiConstant';
import { APP_CONSTANT } from '../../constant/appConstant';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InstituteService {

  http = inject(HttpClient)
  baseUrl: string = environment.API_URL;

  getAllInstitutes() {
    return this.http.get(`${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.INSTITUTE}${API_CONSTANT.INSTITUTE_APIS.GET_ALL_INSTITUTES}`);
    // .pipe(
    //   delay(1000)
    // );
  }

  deleteInstitute(id: number | undefined) {
    return this.http.delete(`${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.INSTITUTE}${API_CONSTANT.INSTITUTE_APIS.DELETE_INSTITUTE}${APP_CONSTANT.SLASH_CONST}${id}`);
  }

  getInstituteDetails(id: string) {
    return this.http.get(`${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.INSTITUTE}${API_CONSTANT.INSTITUTE_APIS.GET_SINGLE_INSTITUTE}${APP_CONSTANT.SLASH_CONST}${id}`);
  }

  createInstitute(instituteData: any) {
    return this.http.post(`${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.INSTITUTE}${API_CONSTANT.INSTITUTE_APIS.CREATE_INSTITUTE}`, instituteData).pipe(
      delay(1000)
    );
  }

  updateInstitute(instituteData: any) {
    return this.http.put(`${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.INSTITUTE}${API_CONSTANT.INSTITUTE_APIS.UPDATE_INSTITUTE}${APP_CONSTANT.SLASH_CONST}${instituteData.instituteId}`, instituteData).pipe(
      delay(1000)
    );
  }
  
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiConstant } from '../../constant/constant';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InstituteService {

  http = inject(HttpClient)
  baseUrl: string = environment.API_URL;

  getAllInstitutes() {
    return this.http.get(`${this.baseUrl}${ApiConstant.CONTROLLER_TYPES.INSTITUTE}${ApiConstant.INSTITUTE_APIS.GET_ALL_INSTITUTES}`).pipe(
      delay(1000)
    );
  }

  deleteInstitute(id: number | undefined) {
    return this.http.delete(`${this.baseUrl}${ApiConstant.CONTROLLER_TYPES.INSTITUTE}${ApiConstant.INSTITUTE_APIS.DELETE_INSTITUTE}${ApiConstant.SLASH_CONST}${id}`);
  }

  getInstituteDetails(id: string) {
    return this.http.get(`${this.baseUrl}${ApiConstant.CONTROLLER_TYPES.INSTITUTE}${ApiConstant.INSTITUTE_APIS.GET_SINGLE_INSTITUTE}${ApiConstant.SLASH_CONST}${id}`);
  }

  createInstitute(instituteData: any) {
    return this.http.post(`${this.baseUrl}${ApiConstant.CONTROLLER_TYPES.INSTITUTE}${ApiConstant.INSTITUTE_APIS.CREATE_INSTITUTE}`, instituteData).pipe(
      delay(1000)
    );
  }

  updateInstitute(instituteData: any) {
    return this.http.put(`${this.baseUrl}${ApiConstant.CONTROLLER_TYPES.INSTITUTE}${ApiConstant.INSTITUTE_APIS.UPDATE_INSTITUTE}${ApiConstant.SLASH_CONST}${instituteData.instituteId}`, instituteData).pipe(
      delay(1000)
    );
  }
  
}

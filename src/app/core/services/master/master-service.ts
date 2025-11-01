import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiConstant } from '../../constant/constant';
import { Observable } from 'rxjs';
import { IMaster } from '../../model/master-model';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  private baseUrl: string = environment.API_URL;

  http = inject(HttpClient);

  getAllMasters() {
    let url = this.baseUrl + ApiConstant.API_TYPES.MASTER + ApiConstant.MASTER_APIS.GET_ALL_MASTER;
    return this.http.get(url);
  }

  createMaster(req: IMaster) {
    let url = this.baseUrl + ApiConstant.API_TYPES.MASTER + ApiConstant.MASTER_APIS.CREATE_MASTER;
    return this.http.post(url, req);
  }

  updateMaster(req: IMaster) {
    let url = this.baseUrl + ApiConstant.API_TYPES.MASTER + ApiConstant.MASTER_APIS.UPDATE_MASTER;
    return this.http.put(url + '/' + req.masterId, req);
  }

  deleteMaster(id: number) {
    let url = this.baseUrl + ApiConstant.API_TYPES.MASTER + ApiConstant.MASTER_APIS.DELETE_MASTER;
    return this.http.delete(url + '/' + id);
  }

  getMasterByType(masterFor: string): Observable<IMaster[]> {
    let url = this.baseUrl + ApiConstant.API_TYPES.MASTER + ApiConstant.MASTER_APIS.GET_MASTER_BY_TYPE;
    return this.http.get<IMaster[]>(url + '/' + masterFor);
  }
}

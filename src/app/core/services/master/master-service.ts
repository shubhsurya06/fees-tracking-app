import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiConstant } from '../../constant/constant';
import { delay, Observable } from 'rxjs';
import { IMaster } from '../../model/master-model';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  private baseUrl: string = environment.API_URL;

  http = inject(HttpClient);

  /*
    * get all masters
    * @returns 
  */
  getAllMasters() {
    let url = this.baseUrl + ApiConstant.CONTROLLER_TYPES.MASTER + ApiConstant.MASTER_APIS.GET_ALL_MASTER;
    return this.http.get(url).pipe(
      delay(1000)
    );
  }
  
  /**
   * create master
   * @param req 
   * @returns 
   */
  createMaster(req: IMaster) {
    let url = this.baseUrl + ApiConstant.CONTROLLER_TYPES.MASTER + ApiConstant.MASTER_APIS.CREATE_MASTER;
    return this.http.post(url, req).pipe(
      delay(1000)
    );
  }

  /**
   *  update master
   * @param req 
   * @returns 
   */
  updateMaster(req: IMaster) {
    let url = this.baseUrl + ApiConstant.CONTROLLER_TYPES.MASTER + ApiConstant.MASTER_APIS.UPDATE_MASTER;
    return this.http.put(url + ApiConstant.SLASH_CONST + req.masterId, req).pipe(
      delay(1000)
    );
  }

  /**
   * delete master
   * @param id 
   * @returns 
   */
  deleteMaster(id: number) {
    let url = this.baseUrl + ApiConstant.CONTROLLER_TYPES.MASTER + ApiConstant.MASTER_APIS.DELETE_MASTER;
    return this.http.delete(url + ApiConstant.SLASH_CONST + id);
  }

  /*
    * get master by type
    * @param masterFor 
    * @returns 
  */
  getMasterByType(masterFor: string): Observable<IMaster[]> {
    let url = this.baseUrl + ApiConstant.CONTROLLER_TYPES.MASTER + ApiConstant.MASTER_APIS.GET_MASTER_BY_TYPE;
    return this.http.get<IMaster[]>(url + ApiConstant.SLASH_CONST + masterFor).pipe(
      delay(1000)
    );
  }
}

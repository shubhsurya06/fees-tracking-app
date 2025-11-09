import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_CONSTANT } from '../../constant/apiConstant';
import { APP_CONSTANT } from '../../constant/appConstant';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private http = inject(HttpClient);

  private baseUrl: string = environment.API_URL;

  getAllBranches() {
    return this.http.get(`${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.BRANCH}${API_CONSTANT.BRANCH_APIS.GET_ALL_BRANCHES}`).pipe(
      map((res: any) => {
        let obj = {
          message: 'Branch fetched successfully.',
          data: res
        }
        return obj;
      })
    );
  }

  updateBranch(branchData: any) {
    return this.http.put(`${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.BRANCH}${API_CONSTANT.BRANCH_APIS.UPDATE_BRANCH}${APP_CONSTANT.SLASH_CONST}`, branchData);
  }

  createBranch(branchData: any) {
    return this.http.post(`${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.BRANCH}${API_CONSTANT.BRANCH_APIS.CREATE_BRANCH}`, branchData);
  }

  deleteBranch(id: number | undefined) {
    return this.http.delete(`${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.BRANCH}${API_CONSTANT.BRANCH_APIS.DELETE_BRANCH}${APP_CONSTANT.SLASH_CONST}${id}`);
  }


}

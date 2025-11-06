import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiConstant } from '../../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private http = inject(HttpClient);

  private baseUrl: string = environment.API_URL;

  getAllBranches() {
    return this.http.get(`${this.baseUrl}${ApiConstant.CONTROLLER_TYPES.BRANCH}${ApiConstant.BRANCH_APIS.GET_ALL_BRANCHES}`);
  }

  updateBranch(branchData: any) {
    return this.http.put(`${this.baseUrl}${ApiConstant.CONTROLLER_TYPES.BRANCH}${ApiConstant.BRANCH_APIS.UPDATE_BRANCH}${ApiConstant.SLASH_CONST}${branchData.branchId}`, branchData);
  }

  createBranch(branchData: any) {
    return this.http.post(`${this.baseUrl}${ApiConstant.CONTROLLER_TYPES.BRANCH}${ApiConstant.BRANCH_APIS.CREATE_BRANCH}`, branchData);
  }

  deleteBranch(id: number | undefined) {
    return this.http.delete(`${this.baseUrl}${ApiConstant.CONTROLLER_TYPES.BRANCH}${ApiConstant.BRANCH_APIS.DELETE_BRANCH}${ApiConstant.SLASH_CONST}${id}`);
  }


}

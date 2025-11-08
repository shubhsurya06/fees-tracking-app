import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_CONSTANT } from '../../constant/apiConstant';
import { APP_CONSTANT } from '../../constant/appConstant';
import { PackageMasterModel } from '../../model/package-master-model';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackageMasterService {

  http = inject(HttpClient);
  baseUrl = environment.API_URL;

  /**
   * get all packages
   * @returns 
   */
  getAllPackages() {
    let url = `${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.PACKAGE_MASTER}${API_CONSTANT.PACKAGE_MASTER_APIS.GET_ALL_PACKAGES}`;
    return this.http.get(url).pipe(
      delay(1000)
    );
  }

  /**
   * create package master
   * @param packageData 
   * @returns 
   */
  createPackage(packageData: PackageMasterModel) {
    let url = `${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.PACKAGE_MASTER}${API_CONSTANT.PACKAGE_MASTER_APIS.CREATE_PACKAGE}`;
    return this.http.post(url, packageData).pipe(
      delay(1000)
    );
  }

  /*
    * update package master
    * @param packageData 
    * @returns 
  */
  updatePackage(packageData: PackageMasterModel) {
    let url = `${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.PACKAGE_MASTER}${API_CONSTANT.PACKAGE_MASTER_APIS.UPDATE_PACKAGE}${APP_CONSTANT.SLASH_CONST}${packageData.packageId}`;
    return this.http.put(url, packageData).pipe(
      delay(1000)
    );
  }

  /**
   * delete package master
   * @param packageId 
   * @returns 
   */
  deletePackage(packageId: number) {
    let url = `${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.PACKAGE_MASTER}${API_CONSTANT.PACKAGE_MASTER_APIS.DELETE_PACKAGE}${APP_CONSTANT.SLASH_CONST}${packageId}`;
    return this.http.delete(url);
  }
  
}

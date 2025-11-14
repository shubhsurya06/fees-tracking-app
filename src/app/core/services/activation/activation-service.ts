import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_CONSTANT } from '../../constant/apiConstant';
import { APP_CONSTANT } from '../../constant/appConstant';
import { delay, map } from 'rxjs';
import { IActivation } from '../../model/activation-model';

@Injectable({
  providedIn: 'root'
})
export class ActivationService {
  http = inject(HttpClient);
  baseUrl = environment.API_URL;

  /**
   * get all packages
   * @returns 
   */
  getAllActivation() {
    let url = `${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.ACTIVATION}${APP_CONSTANT.SLASH_CONST}${API_CONSTANT.ACTIVATION_APIS.GET_ALL_ACTIVATION}`;
    return this.http.get(url).pipe(
      map((res) => {
        let obj = {
          message: 'Activation data fetched successfully',
          data: res
        }
        return obj;
      }),
      delay(1000)
    );
  }
}

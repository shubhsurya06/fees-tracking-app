import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_CONSTANT } from '../../constant/apiConstant';
import { APP_CONSTANT } from '../../constant/appConstant';
import  { IPayment } from '../../model/payment-model';
import { delay, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  http = inject(HttpClient);
  baseUrl = environment.API_URL;

  /**
   * get all packages
   * @returns 
   */
  getAllPayments(id: any) {
    let url = `${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.PAYMENT}${API_CONSTANT.PAYMENT_APIS.GET_ALL_PAYMENTS}?instituteid=${id}`;
    return this.http.get(url).pipe(
      map((res: any) => {
        let obj = {
          message: 'Payments fetched successfully',
          data: res as IPayment[]
        }
        return obj;
      }),
      delay(1000)
    );
  }

  createPayment(paymentObj: IPayment) {
    let url = `${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.PAYMENT}${API_CONSTANT.PAYMENT_APIS.CREATE_PAYMENT}`;
    return this.http.post(url, paymentObj).pipe(
      delay(1000)
    );
  }

  updatePayment(paymentObj: IPayment) {
    let url = `${this.baseUrl}${API_CONSTANT.CONTROLLER_TYPES.PAYMENT}${API_CONSTANT.PAYMENT_APIS.UPDATE_PAYMENT}`;
    return this.http.put(url, paymentObj).pipe(
      delay(1000)
    );
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiConstant } from '../../constant/constant';
import { User } from '../../model/user-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);

  private baseUrl = environment.API_URL;

  token: string = 'userToken';

  // login user from here
  login(data: User) {
    const url = this.baseUrl + ApiConstant.API_TYPES.USER + ApiConstant.USER_APIS.LOGIN;
    return this.http.post(url, data);
  }

  // save token in local storage
  saveToken(token: string) {
    localStorage.setItem(this.token, token);
  }

  // get token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.token);
  }

  // check whether user is authenticated or not
  isAuthenticated(): boolean {
    let token = this.getToken();
    return token != null;
  }

  // logout user from here
  logout() {
    localStorage.removeItem(this.token);
  }

}

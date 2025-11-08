import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiConstant } from '../../constant/constant';
import { IUser } from '../../model/user-model';
import { UserService } from '../user/user-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  userService = inject(UserService);

  private baseUrl = environment.API_URL;


  // login user from here
  login(data: IUser) {
    const url = this.baseUrl + ApiConstant.CONTROLLER_TYPES.USER + ApiConstant.USER_APIS.LOGIN;
    return this.http.post(url, data);
  }

  // save token in local storage
  saveToken(token: string,userData: any) {
    localStorage.setItem(ApiConstant.USER_DATA.TOKEN, token);
    localStorage.setItem(ApiConstant.USER_DATA.USER_DETAILS, JSON.stringify(userData));

    // set user data in userService.loggedInUser(), so that it will be accessible throughout the application
    this.userService.getLoggedInUser();
  }

  // get token from local storage
  getToken(): string | null {
    return localStorage.getItem(ApiConstant.USER_DATA.TOKEN);
  }

  // check whether user is authenticated or not
  isAuthenticated(): boolean {
    let token = this.getToken();
    return token != null;
  }

  // logout user from here
  logout() {
    localStorage.removeItem(ApiConstant.USER_DATA.TOKEN);
    localStorage.removeItem(ApiConstant.USER_DATA.USER_DETAILS);
    this.userService.removeUser();
  }

}

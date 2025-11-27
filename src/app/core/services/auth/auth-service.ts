import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_CONSTANT } from '../../constant/apiConstant';
import { APP_CONSTANT } from '../../constant/appConstant';
import { IUser } from '../../model/user-model';
import { UserService } from '../user/user-service';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../store/auth/actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  userService = inject(UserService);

  store = inject(Store);

  // added logged in user in subject, so that  we can subscribe it on App.ts component, to show header/NAVBAR

  private baseUrl = environment.API_URL;


  // login user from here
  login(data: IUser) {
    const url = this.baseUrl + API_CONSTANT.CONTROLLER_TYPES.USER + API_CONSTANT.USER_APIS.LOGIN;
    return this.http.post(url, data);
  }

  // save token in local storage
  saveToken(token: string,userData: any) {
    localStorage.setItem(APP_CONSTANT.USER_DATA.TOKEN, token);
    localStorage.setItem(APP_CONSTANT.USER_DATA.USER_DETAILS, JSON.stringify(userData));

    // set user data in userService.loggedInUser(), so that it will be accessible throughout the application
    this.userService.getLoggedInUser();

  }

  // get token from local storage
  getToken(): string | null {
    return localStorage.getItem(APP_CONSTANT.USER_DATA.TOKEN);
  }

  // check whether user is authenticated or not
  isAuthenticated(): boolean {
    let token = this.getToken();
    return token != null;
  }

  // logout user from here
  logout() {
    localStorage.removeItem(APP_CONSTANT.USER_DATA.TOKEN);
    localStorage.removeItem(APP_CONSTANT.USER_DATA.USER_DETAILS);
    this.userService.removeUser();

    // dispatch logout action from here, to clear MASTER STATE DATA
    this.store.dispatch(AuthActions.logout());
  }

}

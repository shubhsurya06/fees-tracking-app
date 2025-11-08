import { Injectable, signal } from '@angular/core';
import { IUser } from '../../model/user-model';
import { APP_CONSTANT } from '../../constant/appConstant';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedInUser = signal<IUser>({});

  // get logged in user details from localStorage & set in loggedInUser
  getLoggedInUser() {
    let user = localStorage.getItem(APP_CONSTANT.USER_DATA.USER_DETAILS);
    if (user != null) {
      this.loggedInUser.set(JSON.parse(user));
    }
  }

  // remove user details on logout
  removeUser() {
    this.loggedInUser.set({});
  }


}

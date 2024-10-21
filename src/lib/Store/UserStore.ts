// imports from vendors
import { makeAutoObservable } from 'mobx';

//import from interfaces
import { DEFAULT_USER, User } from '../Types/user';

class UserStore {

  isLoggedIn: boolean;

  user: User;

  constructor() {
    this.isLoggedIn = false;
    this.user = DEFAULT_USER;
    makeAutoObservable(this);
  }

  clearStore = (): void => {
    this.isLoggedIn = false;
    this.user = DEFAULT_USER;
  };

  setUser = (user: User) => {
    this.user = user;
  };

  setIsLoggedIn = (isLoggedIn: boolean) => {
    this.isLoggedIn = isLoggedIn;
  };
}

export default new UserStore();

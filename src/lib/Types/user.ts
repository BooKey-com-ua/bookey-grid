export type User = {
  _id?: string,
  admin?: boolean,
  avatar?: string,
  email: string,
  emailVerify?: boolean,
  fullName?:string,
  language?: string,
  lastActiveDate?: string,
  lastLoginDate?: string,
  lastName?: string,
  name?: string,
  password?: string,
  phone?: string,
  registerDate?: string,
};

export type RegProps = {
  email: string,
  lastName?: string,
  name?: string,
  password: string,
  phone?: string;
};

export type UserStoreProps = {
  isLoggedIn: boolean;
  user: User;
  clearStore:() => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: User) => void;
};

export const DEFAULT_USER: User = {
  _id: '',
  email: '',
  lastName: '',
  name: '',
};

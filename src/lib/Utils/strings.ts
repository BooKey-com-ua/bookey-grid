/* eslint-disable max-len */
import { User } from '../Types/user';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const isUrl = (string: string) => string?.startsWith('http') || false;

export const isEmail = (email: string) => email.toLowerCase()
  .match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

export const parseCookie = (cookie: string): any => cookie?.split(';')
  .map((v) => v.split('='))
  .reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
  }, {});

export const formName = (user: User) => user?.fullName ? user?.fullName : `${user.name} ${user.lastName === '*' ? '' : user.lastName}`;

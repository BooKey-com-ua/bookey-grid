// imports from vendors
import { makeAutoObservable, runInAction } from 'mobx';
import { localStorageManager } from '@chakra-ui/react';
import { ReactNode } from 'react';

//import from types

class MainConfigStore {

  colorTheme: string;

  currencies: { [key: string]: number };

  currency: string;

  isMobile: boolean;

  isUploaded: boolean;

  language: string;

  windowHeight: number;

  constructor() {
    this.colorTheme = localStorageManager.get();
    this.currencies = { USD: 1 };
    this.currency = 'EUR';
    this.isMobile = true;
    this.isUploaded = false;
    this.language = 'en';
    this.windowHeight = 0;
    makeAutoObservable(this);
  }

  clearStore = (): void => {
    this.colorTheme = localStorageManager.get();
    this.currencies = { USD: 1 };
    this.currency = 'EUR';
    this.isMobile = true;
    this.isUploaded = false;
    this.language = 'en';
    this.windowHeight = 0;
  };

  setLanguage = (language: string): void => {
    runInAction(() => {
      this.language = language;
    });
  };

  setColorTheme = (color: string): void => {
    this.colorTheme = color;
  };

  setCurrencies = (currencies: { [key: string]: number }): void => {
    this.currencies = currencies;
  };

  
  setUpload = () => {
    this.isUploaded = true;
  };

  setIsMobile = (isMobile: boolean) => {
    runInAction(() => {
      this.isMobile = isMobile;
    });
  };

  setWindowHeight = (height: number) => {
    this.windowHeight = height;
  };

}

export default new MainConfigStore();

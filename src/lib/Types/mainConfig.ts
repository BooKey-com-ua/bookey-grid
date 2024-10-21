export type PaymentDetails = {
  amount: number;
  currency: string;
  customFields?: { [key: string]: string };
  description: string;
  donate?: boolean;
  officeId?: string;
  orderId?: string;
  pureAmount?: number;
  roomId?: string;
  trialMonths?: number;
  trialStartFrom?: string;
  type?: string;
};

export type MainConfigStoreProps = {
  // eslint-disable-next-line max-len
  colorTheme: 'dark' | 'light';
  currencies: { [key: string]: number };
  currency: string;
  isMobile: boolean;
  isUploaded: boolean;
  language: string;
  paymentDetails: PaymentDetails;
  windowHeight: number,
  clearStore:() => void;
  setColorTheme: (language: string) => void;
  setCurrencies: (currencies: { [key: string]: number }) => void;
  setCurrency: (currency: string) => void;
  setIsMobile: (isMobile: boolean) => void;
  setLanguage: (language: string) => void;
  setPaymentDetails: (details: PaymentDetails) => void;
  setUpload: () => void;
  setWindowHeight: (height: number) => void;
};

export type StyleType = {
  [value: string]: string | string[] | number | number[] | (string | number) [] | StyleType;
};

export type SelectValue = {
  label: string,
  value: string | number,
};

import { DateTime } from 'luxon';
// eslint-disable-next-line import/no-cycle

export declare type Plugin = {
  _id?: string;
  calendar?: string;
  createdAt?: Date;
  days?: string;
  domain: string;
  lastPayment?: string;
  loginPage?: string;
  minimalBookingPeriod: number;
  ownerId?: string;
  subscription?: string;
  tariff?: {
      amount: number;
      donate: boolean;
      trialMonths: number;
      trialStartFrom?: string;
  };
  tariffPlans?: [
      {
          amount: number;
          donate: boolean;
          name: string;
          trialMonths: number;
          trialStartFrom?: string;
      }
  ];
  workingDays?: [number];
  workingHours?: [number, number];
  workingMonths?: [number];
};

export const DEFAULT_PLUGIN: Plugin = {
  _id: null,
  domain: '',
  minimalBookingPeriod: 60,
  workingHours: [10, 16],
};

export type PluginStoreConfig = {
  startTime: number, // Start time in layout parts
  endTime: number, // End time in layout parts
  partsNumber: number, // Number of parts in one hour (1/2/4)
  partValue: number, // Minutes in one part (60/30/15)
};

export type PluginStoreProps = {
  endDate: string;
  pageConfig:PluginStoreConfig,
  pluginConfig: PluginStoreConfig[];
  startDate: string;
  clearStore: () => void,
  setDates: (startDate: DateTime, endDate?: DateTime) => void;
  setPageConfig: (config: PluginStoreConfig) => void;
};

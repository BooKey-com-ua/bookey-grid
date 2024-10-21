// imports from vendors
import { DateTime } from 'luxon';
import { makeAutoObservable, runInAction } from 'mobx';

//import from types
import { Plugin, PluginStoreConfig } from '../Types/plugin';

class PluginStore {

  endDate: string;

  pageConfig: PluginStoreConfig;

  roomsConfig: PluginStoreConfig[];

  startDate: string;

  constructor() {
    this.pageConfig = {
      startTime: 28,
      endTime: 80,
      partsNumber: 4,
      partValue: 15,
    };
    this.endDate = DateTime.now().plus({ days: 7 }).toISODate();
    this.roomsConfig = null;
    this.startDate = DateTime.now().toISODate();
    makeAutoObservable(this);
  }

  setPageConfig = (config: PluginStoreConfig) => {
    this.pageConfig = config;
  };

  setDates = (startDate: DateTime, endDate?: DateTime) => {
    runInAction(() => {
      this.startDate = startDate.toISODate();
      this.endDate = endDate?.toISODate() || this.endDate;
    });
  };

  addPluginsConfig = (rooms: Plugin[]) => {
    if (!rooms.length) return;
    let startTime = rooms[0].workingHours[0] * 4;
    let endTime = rooms[0].workingHours[1] * 4;
    this.roomsConfig = rooms.map((room) => {
      if (room.workingHours[0] * 4 < startTime) startTime = room.workingHours[0] * 4;
      if (room.workingHours[1] * 4 > endTime) endTime = room.workingHours[1] * 4;
      return ({
        partsNumber: 4,
        partValue: room.minimalBookingPeriod,
        startTime: room.workingHours[0] * 4,
        endTime: room.workingHours[1] * 4,
      });
    });
  };

  clearStore = () => {
    this.pageConfig = {
      startTime: 28,
      endTime: 80,
      partsNumber: 4,
      partValue: 15,
    };
    this.endDate = DateTime.now().plus({ days: 7 }).toISODate();
    this.roomsConfig = null;
    this.startDate = DateTime.now().toISODate();
  };

}

export default new PluginStore();

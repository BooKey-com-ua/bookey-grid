/* eslint-disable import/no-cycle */
// imports from vendors
import { makeAutoObservable } from 'mobx';

//import from constants
import { STATUS } from '../Constants/bookings';

//import from types
import { Plugin, DEFAULT_PLUGIN } from '../Types/plugin';
import { LayoutItem, TimeRange } from '../Types/booking';

//import from store
import { PluginStore, UserStore } from '.';

class BookedHoursStore {

  bookedHours: LayoutItem[];

  layouts: LayoutItem[];

  rawHours: LayoutItem[];

  plugin: Plugin;

  roomId: string;

  constructor() {
    this.bookedHours = [];
    this.layouts = [];
    this.rawHours = [];
    this.plugin = DEFAULT_PLUGIN;
    this.roomId = '';
    makeAutoObservable(this);
  }

  setBookedHours = (hours: TimeRange[]) => {
    this.rawHours = hours;
    this.toBookedHours();
  };

  addBookedHours = (hours: TimeRange[]) => {
    this.rawHours = this.rawHours.concat(hours);
    this.toBookedHours();
  };

  setPlugin = (plugin: Plugin) => {
    this.plugin = plugin;
  };

  clearStore = () => {
    this.bookedHours = [];
    this.layouts = [];
    this.rawHours = [];
    this.plugin = DEFAULT_PLUGIN;
    this.roomId = '';
  };

  removeBookedHourById = (requestId: string) => {
    this.rawHours = this.rawHours.filter(({ _id }) => _id != requestId);
    this.toBookedHours();
  };

  get sortedBookedHours() {
    return this.bookedHours.slice().sort((a, b) => a.from.toMillis() - b.from.toMillis());
  }

  get sortedBookedLayouts() {
    return this.layouts.slice().sort((a, b) => a.from.toMillis() - b.from.toMillis());
  }

  private toLayouts = () => {
    const { startTime, endTime, partsNumber, partValue } = PluginStore.pageConfig;
    return this.bookedHours.map((item) => {
      const y = item.from.hour * partsNumber + item.from.minute / partValue - startTime;
      const yh = item.to.hour
        ? item.to.hour * partsNumber + item.to.minute / partValue - startTime
        : endTime - startTime;

      return {
        status: '', ...item, y, h: yh - y, x: 0, w: 1, minH: 60 / partValue,
        static: item.status === STATUS.approved || item.status === STATUS.request,
        color: this.getColor(item), oldColor: this.getColor(item),
      };
    });
  };

  private getColor = (item) => {
    switch (item.status) {
    // eslint-disable-next-line @typescript-eslint/indent
    case STATUS.request: return 'requested';
      // eslint-disable-next-line @typescript-eslint/indent, no-fallthrough
    case STATUS.approved: return UserStore.user._id === item?.requestedBy?._id ? 'approved' : 'funcGray';
      // eslint-disable-next-line @typescript-eslint/indent, no-fallthrough
    default: return 'bgSecondary';
    }
  };

  private toBookedHours = () => {
    const bookings = this.rawHours.filter(({ status }) => !(status === STATUS.cancelled || status === STATUS.rejected));
    const sortedArray: LayoutItem[] = bookings.filter((book: LayoutItem) => book.status === STATUS.request)
      .sort((a, b) => a.from.toMillis() - b.from.toMillis());

    if (!sortedArray.length) this.bookedHours = bookings;
    else {
      const result = [];
      const approvedBookings = bookings.filter((book: LayoutItem) => book.status === STATUS.approved);
      let previous = { ...sortedArray[0], bookings: [sortedArray[0]] };
      for (let i = 1; i < sortedArray.length; i++) {
        if (previous.to.toMillis() > sortedArray[i].from.toMillis()) {
          previous = {
            ...previous,
            to: previous.to.toMillis() > sortedArray[i].to.toMillis() ? previous.to : sortedArray[i].to,
          };
          previous.bookings.push(sortedArray[i]);
        } else {
          result.push(previous);
          previous = { ...sortedArray[i], bookings: [sortedArray[i]] };
        }
      }
      result.push(previous);
      this.bookedHours = result.concat(approvedBookings);
    }
    this.layouts = this.toLayouts();
  };

}

export default new BookedHoursStore();

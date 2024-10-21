/* eslint-disable import/no-cycle */
// imports from vendors
import { makeAutoObservable } from 'mobx';
import { DateTime } from 'luxon';

// imports from constants
import { STATUS } from '../Constants/bookings';

//import from types
import { LayoutItem } from '../Types/booking';

//import from store
import BookedHoursStore from './BookedHoursStore';
import MainConfigStore from './MainConfigStore';
import PluginStore from './PluginStore';

class LayoutsStore {

  daysNumber: number;

  layouts: { [key: string]: LayoutItem[] };

  selected: LayoutItem[];

  startDate: Date;

  constructor() {
    this.daysNumber = 7;
    this.layouts = null;
    this.selected = [];
    this.startDate = new Date;
    makeAutoObservable(this);
  }

  clearStore = () => {
    this.daysNumber = 7;
    this.layouts = null;
    this.selected = [];
    this.startDate = new Date;
  };

  setDaysNumber = (daysNumber: number) => this.daysNumber = daysNumber;

  setStartDate = (startDate: Date) => this.startDate = startDate;

  setSelected = (selected: LayoutItem[]) => this.selected = selected;

  clearSelected = () => {
    const roomId = BookedHoursStore.plugin._id;

    this.selected.forEach(({ from, _id }) => {
      this.layouts[`${roomId}-${from.toFormat('yyLdd')}`] = this.layouts[`${roomId}-${from.toFormat('yyLdd')}`]?.map(
        (item) => _id === item._id
          ? { ...item, isSelected: false, isResizable: false, isDraggable: false, color: item.oldColor }
          : item
      );
    });

    this.selected = [];
  };

  setLayoutItem = (layoutItem: LayoutItem) => {
    const roomId = BookedHoursStore.plugin._id;
    const layoutsId = `${roomId}-${layoutItem.from.toFormat('yyLdd')}`;
    this.layouts[layoutsId] = this.layouts[layoutsId].map(
      (item) => item.i === layoutItem.i ? layoutItem : item
    );
    this.changeSelectedItem(layoutItem);
  };

  removeSelectedById = (requestId: string) => {
    this.selected = this.selected.filter(({ _id }) => _id != requestId);
  };

  removeSelectedParentById = (requestId: string) => {
    const hourToUpdate = this.selected.find(({ bookings }) => bookings?.some(({ _id }) => _id === requestId));
    if (!hourToUpdate || hourToUpdate.bookings.length === 1) {
      this.selected = this.selected.filter(({ bookings, _id: topId }) => bookings
        ? bookings?.some(({ _id }) => _id != requestId)
        : topId != requestId);
      return;
    }

    const blockedHours = this.selected.filter(({ bookings }) => !bookings?.some(({ _id }) => _id === requestId));
    const newBookings = hourToUpdate?.bookings.filter(({ _id }) => _id != requestId);

    this.selected = blockedHours.concat(this.formRanges(newBookings));
  };

  acceptSelectedById = (requestId: string) => {
    const hourToUpdate = this.selected.find(({ bookings }) => bookings?.some(({ _id }) => _id === requestId));

    if (!hourToUpdate || hourToUpdate.bookings.length === 1) {
      this.selected = this.selected.filter(({ bookings, _id: topId }) => bookings
        ? bookings?.some(({ _id }) => _id != requestId)
        : topId != requestId);
      return;
    }

    const { from, to } = hourToUpdate.bookings.find(({ _id }) => _id === requestId);

    const rejectIds = [];

    for (const book of hourToUpdate.bookings) {
      if (!(book.to <= from || book.from >= to)) rejectIds.push(book._id.toString());
    }

    const blockedHours = this.selected.filter(({ bookings }) => !bookings?.some(({ _id }) => _id === requestId));

    const newBookings = hourToUpdate.bookings.filter(({ _id }) => !rejectIds.includes(_id));

    this.selected = blockedHours.concat(this.formRanges(newBookings));
  };

  initLayouts = () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _id } = BookedHoursStore.plugin;
    const zeroArray: DateTime[] = [] ;
    for (let i = 0; i < this.daysNumber; i++)
      zeroArray.push(DateTime.now().setZone('Etc/GMT'));
    const DAYS = zeroArray.map((day, index) => day.set({
      year:  this.startDate.getFullYear(),
      month:  this.startDate.getMonth() + 1,
      day: this.startDate.getDate() + index,
      hour: 0, minute: 0, second: 0, millisecond: 0,
    }));
    let result = {};
    for (const day of DAYS) {
      result = Object.assign(
        result,
        { [`${_id}-${day.toFormat('yyLdd')}`]: this.generateLayouts(day) }
      );
    }

    this.layouts = result;
  };

  orderLayouts = (layoutsId: string, inLayouts: LayoutItem[], newPos: LayoutItem, oldPos: LayoutItem = newPos) => {
    const { partsNumber, partValue, startTime, endTime } = PluginStore.pageConfig;
    const maxRows = endTime - startTime;

    const short = MainConfigStore.isMobile || this.daysNumber > 7;

    let overlapForbidden = false;

    // Removing the overlapped item
    let result = inLayouts.filter((item) => {
      const isItem = item.i === newPos.i;
      const isNotOverlap = (item.y + item.h <= newPos.y) || (item.y >= newPos.y + newPos.h);
      if (!isNotOverlap && (item.status === STATUS.approved || item.past)) {
        overlapForbidden = true;
        return true;
      }
      if (!isNotOverlap) this.selected = this.selected.filter(({ i }) => i != item.i);
      return (isItem || isNotOverlap);
    });

    //Moving new item back if it was moved on approved hour
    if (overlapForbidden && (newPos.y != oldPos.y)) result = result.filter((item) => item.i !== newPos.i);

    //Removing item with old props from selected
    const newItem = this.layouts[layoutsId].find(({ i }) => i === newPos.i);
    this.changeSelectedItem({ ...newItem, isSelected: false });

    // Add new hour in case if there is plugin for it
    for (let index = 0; index <= maxRows - partsNumber; index += partsNumber) {
      if (!result.some(({ y, h }) => index < y + h && index + partsNumber > y)) {
        const from = result[0].from.set({ hour: (startTime + index) / partsNumber });
        const to = result[0].to.set({ hour: (startTime + index + partsNumber) / partsNumber });
        const fromLabel = `${from.hour}:${from.minute || '00'}`;
        const toLabel = `${to.hour}:${to.minute || '00'}`;
        result.push({
          i: from.toMillis().toString(), _id: from.toMillis().toString(),
          label: short ? fromLabel : `${fromLabel}-${toLabel}`, from, to, x: 0, y: index, w: 1,
          h: partsNumber, minH: partsNumber, color: 'bgSecondary',
        });
      }
    }

    // Add labels to array items
    result = result.map((item) => {
      if (item.i != newPos.i) return item;
      // eslint-disable-next-line max-len
      const from = result[0].from.set({ hour: (startTime + item.y) / partsNumber, minute: (startTime + item.y) % partsNumber * partValue });
      // eslint-disable-next-line max-len
      const to = result[0].to.set({ hour: (startTime + item.y + item.h) / partsNumber, minute: (startTime + item.y + item.h) % partsNumber * partValue });
      const fromLabel = `${from.hour}:${from.minute || '00'}`;
      const toLabel = `${to.hour}:${to.minute || '00'}`;
      const newItem = {
        ...item, label: short ? fromLabel : `${fromLabel}-${toLabel}`,
        from, to, i: from.toMillis().toString(), _id: item._id || from.toMillis().toString(),
      };
      this.changeSelectedItem(newItem);
      return newItem;
    });

    this.layouts[layoutsId] = result;
  };

  private formRanges = (newBookings: LayoutItem[]) => {
    const filteredHours = [];

    if (newBookings.length > 0) {
      let previous = { ...newBookings[0], bookings: [newBookings[0]] };

      for (let i = 1; i < newBookings.length; i++) {
        if (previous.to.toMillis() > newBookings[i].from.toMillis()) {
          previous = {
            ...previous,
            to: previous.to.toMillis() > newBookings[i].to.toMillis() ? previous.to : newBookings[i].to,
          };
          previous.bookings.push(newBookings[i]);
        } else {
          filteredHours.push(previous);
          previous = { ...newBookings[i], bookings: [newBookings[i]] };
        }
      }
      filteredHours.push(previous);
    }
    return filteredHours;
  };

  private changeSelectedItem = (layoutItem: LayoutItem) => {
    if (layoutItem.isSelected) {
      if (!this.selected.some(({ i }) => i === layoutItem.i)) {
        const tmp = [ ...this.selected, layoutItem];
        this.selected = tmp.slice().sort((a, b) => a.from.toMillis() - b.from.toMillis());
      }
    }
    if (!layoutItem.isSelected) {
      this.selected = this.selected.filter(({ i }) => i !== layoutItem.i);
    }
  };

  private generateLayouts = (date: DateTime) => {
    const { partsNumber, startTime, endTime } = PluginStore.pageConfig;
    const { workingDays, workingMonths } = BookedHoursStore.plugin;
    const maxRows = endTime - startTime;

    const short = MainConfigStore.isMobile || this.daysNumber > 7;

    const roomWorkingDaysAndMonths = workingDays?.length && !workingDays?.includes(date.weekday) ||
      workingMonths?.length && !workingMonths?.includes(date.month);

    if (roomWorkingDaysAndMonths) {
      const from = date.set({ hour: startTime / partsNumber });
      const to = date.set({ hour: endTime / partsNumber });
      return ([{
        x: 0, y: 0, w: 1, h: endTime - startTime, minH: endTime - startTime, _id: from.toMillis().toString(),
        i: from.toMillis().toString(), from, to, status: 'forbidden', color: 'bgPrimary',
      }]);
    }

    const layoutsId = date.toFormat('yyLdd');

    // Get array of booked hours for current date
    const bookedArray = BookedHoursStore.layouts
      .filter(({ from, to }) => from.toFormat('yyLdd') === layoutsId &&
        from.hour >= (startTime / partsNumber) && to.hour <= (endTime / partsNumber));

    // Add selected hours to booked
    const mergedArray = bookedArray.map((book) => this.selected.find(({ _id }) => _id === book._id)
      ? ({ ...book, isSelected: true, color: 'textSection' })
      : book)
      .concat(this.selected.filter(({ from, status }) => status !== STATUS.approved &&
        status !== STATUS.request && from.toFormat('yyLdd') === layoutsId));

    // Add new hour in case if there is plugin for it
    for (let index = 0; index <= maxRows - partsNumber; index += partsNumber) {
      if (!mergedArray.some(({ y, h }) => index < y + h && index + partsNumber > y)) {
        mergedArray.push({
          x: 0, y: index, w: 1, h: partsNumber, minH: partsNumber, color: 'bgSecondary',
        });
      }
    }

    // Add labels to array items
    const result = mergedArray.map((item) => {
      const now = DateTime.now();
      const from = item?.from || date.set({ hour: (startTime + item.y) / partsNumber });
      const to = item?.to || date.set({ hour: (startTime + item.y + partsNumber) / partsNumber });
      const fromLabel = `${from.hour}:${from.minute || '00'}`;
      const toLabel = `${to.hour}:${to.minute || '00'}`;

      return {
        ...item, from, to, i: from.toMillis().toString(), _id: item._id || from.toMillis().toString(),
        label: short ? fromLabel : `${fromLabel}-${toLabel}`, past: from.toMillis() < now.toMillis()
      };
    });

    return result;
  };

}

export default new LayoutsStore();

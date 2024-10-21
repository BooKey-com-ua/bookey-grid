import { LayoutItem as OriginLayoutItem } from 'react-grid-layout';
import { DateTime } from 'luxon';
import { Plugin } from './plugin';

export type TimeRange = {
  from: DateTime;
  to: DateTime;
};

export type StringTimeRange = {
  from: string;
  to: string;
};

export type LayoutItem = OriginLayoutItem & {
  _id?: string | number;
  bookings?: LayoutItem[];
  cancelledAt?: DateTime;
  color?: string;
  from?: DateTime;
  id?: string | number;
  isSelected?: boolean;
  label?: string | number;
  past?: boolean;
  paymentId?: {
    _id: string;
    orderId: string;
    paidAt: DateTime;
  },
  pluginId?: string;
  status?: string;
  to?: DateTime;
};

export type BookedHoursStoreProps = {
  bookedHours: TimeRange[],
  layouts: LayoutItem[],
  plugin: Plugin,
  pluginId: string;
  sortedBookedHours: TimeRange[],
  sortedBookedLayouts: LayoutItem[],
  addBookedHours:(hours: TimeRange[]) => void,
  clearStore: () => void,
  removeBookedHourById: (requestId: string) => void;
  setBookedHours:(hours: TimeRange[]) => void,
  setPlugin:(plugin: Plugin) => void,
};

export type LayoutsStoreProps = {
  daysNumber: number;
  layouts: { [key: string]: LayoutItem[] };
  selected: LayoutItem[];
  startDate: Date;
  acceptSelectedById: (requestId: string) => void;
  clearSelected: () => void;
  clearStore: () => void;
  initLayouts: () => void;
  orderLayouts: (layoutsId: string, inLayouts: LayoutItem[], newPos: LayoutItem, oldPos?: LayoutItem) => void;
  removeSelectedById: (requestId: string) => void;
  removeSelectedParentById: (requestId: string) => void;
  setDaysNumber: (daysNumber: number) => void;
  setLayoutItem: (layoutItem: LayoutItem) => void;
  setSelected: (selected: LayoutItem[]) => void;
  setStartDate: (startDate: Date) => void;
};

type Person = {
  _id: string;
  lastName: string;
  name: string;
};

export type BookingRequest = {
  _id: string;
  address: string;
  approvedAt?: DateTime;
  approvedBy?: Person;
  cancelWarning?: number;
  cancelledAt?: DateTime;
  cancelledBy?: Person;
  comment?: string;
  commentedAt?: string;
  commentedBy?: Person;
  from: DateTime;
  owner?: boolean;
  paymentId?: string;
  rejectedAt?: DateTime;
  rejectedBy?: Person;
  requestedAs?: Person;
  requestedAt: DateTime;
  requestedBy: Person;
  pluginId: string;
  pluginName: string;
  status: string;
  to: DateTime;
  userId: string;
};

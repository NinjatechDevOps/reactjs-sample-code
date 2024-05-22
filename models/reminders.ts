import { IBase } from "./base";
import { ICategory } from "./category";

export type IReminder = IBase & {
  firstName?: string;
  lastName?: string;
  type: string;
  name?: string;
  relation: IReminder;
  occassion: IReminder;
  tags?: Array<string>;
  category?: string;
  day?: number;
  month?: number;
  isEveryYear?: boolean;
  icon: string;
  date?: string;
  value?: string;
  label?: string;
};

export type IReminderForm = IBase & {
  firstName: string;
  lastName: string;
  relation: string;
  occassion: string;
  date: any;
};

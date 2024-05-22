import { IBase } from "./base";

export type IUser = IBase & {
  isSuperUser: boolean;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image: string;
  emailVerificationCode: string;
  emailVerificationDate: Date;
  isEmailVerified: boolean;
  isEmailAdminVerified: boolean;
  forgotPasswordCode: string;
  forgotPasswordDate: Date;
  isFirstLogin: boolean;
  lastLoginTime: Date;
};

export type IAddress = IBase & {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  postalCode: string;
  isDefaultAddress?: boolean;
};

export interface ILogin {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IForgotPassword {
  email: string;
}
export interface IRegister {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
}

export interface IEditProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
}

export interface IResetPassword {
  password: string;
  confirmPassword: string;
}
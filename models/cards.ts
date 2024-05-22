import { IBase } from "./base";

export type ICardPrice = IBase & {
  type: string;
  size: string;
  sellPrice: number;
  salePrice: number;
  onSale: boolean;
  isDefault: boolean;
};


export type IDelivery = IBase & {
  type: string;
  method: string;
  description: string;
  price: number;
  isActive: boolean;
  isDefault: boolean;
  minimumAmount: number;
  value?: string;
  label?: string;
};

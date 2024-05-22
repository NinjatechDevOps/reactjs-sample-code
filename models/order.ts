import { IBase } from "./base";
import { ICardPrice, IDelivery } from "./cards";
import { IPersonalisationSavedFields, IProduct } from "./product";
import { IAddress } from "./user";

export type IOrderProduct = {
  product: IProduct;
  purchasedPrice: number;
  quantity: number;
  swatchProduct?: IProduct;
  personalisationFields?: IPersonalisationSavedFields[];
  personalisationImageSwatch: string;
  card: {
    cardPrice: ICardPrice;
    paperSize: string;
  };
};

export type IPromoCode = IBase & {
  name?: string;
  promoCode: string;
}

export type IOrder = IBase & {
  products: Array<IOrderProduct>;
  totleAmount: number;
  orderNumber: string;
  stripeToken: string;
  stripe?: any;
  deliveryCharge: number;
  deliveryType: IDelivery;
  discount: {
    promoCode: IPromoCode;
    amount: Number;
  };
  address: IAddress;
};

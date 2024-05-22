import { IPersonalisationFields, IPersonalisationImage, IProduct } from './product';
import { IBase } from './base';
import { Image } from './common';

type IBasketPersonalisationFields = {
  id: string;
  value: string;
};

export type IBasketSwatchItems = {
  _id?: string;
  product: string;
  swatchText: string;
  altImage: string;
};

export type IBasketSwatch = {
  _id?: string;
  name: string;
  items: IBasketSwatchItems[];
};

export type IBasketProduct = IBase & {
  name: string;
  sku: string;
  images: Array<Image>;
  pricing: {
    netBuyPrice: number;
    grossSellPrice: number;
    grossSalePrice: number;
    onSale: boolean;
  };
  productType: string;
  swatch: IBasketSwatch;
  personalisationImage?: IPersonalisationImage;
  personalisationFields?: IPersonalisationFields[];
  linkedProducts?: IProduct[];
}

export type IBasket = {
  quantity: number;
  createdAt?: Date;
  _id?: string;
  product: IBasketProduct;
  swatchProduct?: string;
  personalisationFields?: IBasketPersonalisationFields[];
  personalisationImageSwatch?: string;
  card?: {
    cardPrice: string;
    paperSize: string;
  }
};

import { IBase } from "./base";
import { ICategory } from "./category";
import { IBrand, Image } from "./common";

export type IPersonalisationImageItem = {
  _id: string;
  swatchName: string;
  swatchCode: string;
  swatchImage: string;
  displayImage: string;
};

export type IPersonalisationImage = {
  _id?: string;
  name?: string;
  items: IPersonalisationImageItem[];
};

export type IPersonalisationSavedFields = {
  id: string;
  _id?: string;
  value: string;
};

export type IDropDownOptions = {
  _id: string;
  value: string;
  label: string;
  image: string;
  isDefault: boolean;
  additionalCost: number;
};

export type IPersonalisationFields = {
  _id: string;
  type: string;
  isRequired: boolean;
  maxChars: number;
  promptText: string;
  infoText: string;
  additionalCost: number;
  value?: string;
  dropdownOptions: IDropDownOptions[];
};

export type ISwatchItems = {
  id?: string;
  product: IProduct;
  swatchText: string;
  altImage: string;
};

export type IProduct = IBase & {
  name: string;
  sku: string;
  description?: string;
  productType?: string;
  templateSKU?: string;
  vatCode?: number;
  stockQty?: number;
  supplierRef?: string;
  barcode?: string;
  pricing: {
    netBuyPrice: number;
    grossSellPrice: number;
    grossSalePrice: number;
    onSale: boolean;
  };
  card?: {
    cardType: string;
  };
  supplier?: {
    supplier: any;
    productCode: string;
  }
  designer?: IDesginer;
  internalNotes?: string;
  tags?: Array<string>;
  images: Array<Image>;
  category?: Array<ICategory>;
  brand?: IBrand;
  sortOrder?: number;
  isNewProduct?: boolean;
  linkedProducts?: IProduct[];
  personalisationFields?: IPersonalisationFields[];
  personalisationImage?: IPersonalisationImage;
  swatch?: {
    name: string;
    items: ISwatchItems[];
  };
  bundleItems?: IProduct[];
  meta?: {
    title: string;
    keywords: string;
    description: string;
  };
  google?: {
    title: string;
    productType: string;
    gtin: string;
    condition: string;
    enableForFeed: boolean;
    taxanomy: string;
  };
};

export type IDesginer = IBase & {
  name: string;
  email: string;
  image: {
    desktopCoverPhoto: string;
    mobileCoverPhoto: string;
    profilePicture: string;
  };
  address: {
    addressLine1: string;
    addressLine2: string;
    postalCode: string;
  };
  phone: Number;
  description: string;
};

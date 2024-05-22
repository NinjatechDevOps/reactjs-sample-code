import { IBase } from "./base";
import { ICategory } from "./category";
import { IPersonalisationImageItem, IProduct } from "./product";
import { ADS_TYPE, BannerType, FEATURED_ITEMS_TYPE } from "./enum";

export type Image = {
  image: string;
  size?: number;
  dimension?: {
    height?: number;
    width?: number;
  };
  svgImage?: string;
  altText?: string;
  isDefault?: boolean;
  isHide?: boolean;
  isSwatchImage?: boolean;
  product?: IProduct;
  personalisationImage?: IPersonalisationImageItem;
};

export type IBrand = IBase & {
  name: string;
  image: string;
};

export type IBanner = IBase & {
  name: string;
  image: Image;
  mobileImage: Image;
  category: ICategory;
  product?: IProduct;
  type: BannerType;
  tags: string[];
};

export type IMessageRibbon = IBase & {
  message: string;
};

export type IFeaturedItem = IBase & {
  title: string;
  category?: ICategory[];
  product?: IProduct[];
  type: FEATURED_ITEMS_TYPE;
};

export type InformationBarModel = IBase & {
  title: string;
  text: string;
  image: string;
};

export type IPartner = {
  id?: string;
  title: string;
  image: Image;
  description: string;
  link: string;
  isDisplay: boolean;
};

export type IPartners = IBase & {
  title: string;
  name: string;
  partners: IPartner[];
};

export type IPromotionalAd = {
  id: string;
  _id: string;
  isDisplay: Boolean;
  image: Image;
  type: ADS_TYPE;
  category: ICategory;
  product: IProduct;
  tags: string[];
  sortOrder: number;
  richText?: string;
};

export type IPromotionalAds = IBase & {
  name: string;
  values: IPromotionalAd[];
};

export type IProfileCards = {
  _id: string;
  image: string;
  text: string;
};

export type IBlogCards = {
  _id: string;
  image: string;
  description: string;
  layout: string;
};

export type ISections = {
  _id: string;
  type: string;
  blockText: string;
  profileCards: IProfileCards[];
  banner: {
    image: string;
    altName: string;
    isShow: boolean;
  };
  blogCards: IBlogCards[];
  splitImageText: {
    image: string;
    description: string;
    altName: string;
    layout: string;
  };
};

export type ICMS = IBase & {
  key: string;
  description: string;
  isActive: boolean;
  metaTitle: string;
  metaKeyword: string;
  metaDescription: string;
  link: string;
  sections: ISections[];
};

export type IFooter = IBase & {
  name: string;
  cms: ICMS;
  sortOrder: number;
  parentId: string;
  isStaticPage: boolean;
  url?: string;
  children: IFooter[];
};

export type IContactUs = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
};

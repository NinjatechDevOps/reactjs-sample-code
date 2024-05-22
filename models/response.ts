import { ICategory } from "./category";
import {
  IBanner,
  IFeaturedItem,
  IMessageRibbon,
  InformationBarModel,
  IPartners,
  IPromotionalAds,
} from "./common";
import { IProduct } from "./product";

export interface IAxiosResponse<T> {
  message?: string;
  data: T;
}

export type IHomePageResponse = {
  banner: IBanner;
  messageRibbon?: IMessageRibbon;
  featuredCategory: IFeaturedItem;
  featuredProducts: IFeaturedItem;
  informationBar: InformationBarModel[];
  newProducts: IFeaturedItem;
  partners: IPartners;
  promotionalAds1: IPromotionalAds;
  promotionalAds2: IPromotionalAds;
  trendingProducts?: IFeaturedItem;
  metaTags: any;
};

export type ICategorySlugResponse = {
  category1: ICategory;
  category2: ICategory;
  category3: ICategory;
  products: IProduct[];
  tags: string[];
  totalProducts: number;
};

import { IBasket } from "./basket";
import { ICardPrice } from "./cards";
import { IUser } from "./user";

export interface IInitialState {
  currentUser: IUser | null;
  isAuthenticated: boolean;
  basketCount?: number;
  basketProducts?: IBasket[];
  showNavBarMenu?: boolean;
  showSearchBar?: boolean;
  cardPriceList?: ICardPrice[];
  showFooter?: boolean;
  showCanvasLoading?: boolean;
  canvasTemplateIndex?: number;
  canvasTemplateJSON?: Array<any>;
  canvasTemplateImage?: Array<any>;
  tempalteCardType?: string;
}

export interface IAction {
  type: string;
  value: any;
}

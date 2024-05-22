import Cookies from "js-cookie";
import { createStore } from "redux";
import { TOKEN_KEY } from "../config/constant";
import { IInitialState, IAction } from "../models";
import {
  HIDE_NAVBAR,
  HIDE_SEARCH_BAR,
  PURGE_AUTH,
  SET_AUTH,
  SET_BASKET_COUNT,
  SET_BASKET_PRODUCT,
  SET_CARD_PRICE,
  SET_CANVAS_JSON,
  SHOW_FOOTER,
  SHOW_NAVBAR,
  SHOW_SEARCH_BAR,
  SET_CANVAS_JSON_IMAGE,
  SET_CANVAS_CURRENT_INDEX,
  SET_CANVAS_LOADING,
  SET_TEMPLATE_CARD_TYPE,
} from "./actions";

const initialState: IInitialState = {
  currentUser: null,
  isAuthenticated: false,
  basketCount: 0,
  basketProducts: [],
  showNavBarMenu: false,
  showSearchBar: false,
  cardPriceList: [],
  showFooter: true,
  tempalteCardType: null,
  canvasTemplateJSON: [],
  canvasTemplateIndex: 0,
  canvasTemplateImage: [],
  showCanvasLoading: false
};

const reducer = (state = initialState, action: IAction) => {
  // console.log(action)
  switch (action.type) {
    case SET_AUTH:
      return {
        ...state,
        isAuthenticated: true,
        currentUser: action.value,
      };
    case PURGE_AUTH:
      // console.log('PURGE_AUTH');
      Cookies.remove(TOKEN_KEY);
      return {
        ...state,
        isAuthenticated: false,
        currentUser: null,
      };
    case SET_CARD_PRICE:
      // console.log('SET_CARD_PRICE',action.value);
      return {
        ...state,
        cardPriceList: action.value,
      };
    case SET_BASKET_COUNT:
      return {
        ...state,
        basketCount: action.value,
      };
    case SET_BASKET_PRODUCT:
      return {
        ...state,
        basketProducts: action.value,
      };
    case SHOW_NAVBAR:
      return {
        ...state,
        showNavBarMenu: true,
      };
    case HIDE_NAVBAR:
      return {
        ...state,
        showNavBarMenu: false,
      };
    case SHOW_SEARCH_BAR:
      return {
        ...state,
        showSearchBar: true,
      };
    case HIDE_SEARCH_BAR:
      return {
        ...state,
        showSearchBar: false,
      };
    case SHOW_FOOTER:
      return {
        ...state,
        showFooter: action.value,
      };
    case SET_CANVAS_JSON:
      return {
        ...state,
        canvasTemplateJSON: action.value,
      };
    case SET_CANVAS_JSON_IMAGE:
      // console.log("SET_CANVAS_JSON_IMAGE", action.value)
      return {
        ...state,
        canvasTemplateImage: [...action.value],
      };
    case SET_CANVAS_CURRENT_INDEX:
      return {
        ...state,
        canvasTemplateIndex: action.value,
      };
    case SET_CANVAS_LOADING:
      // console.log("SET_CANVAS_LOADING", action.value)
      return {
        ...state,
        showCanvasLoading: action.value,
      };
    case SET_TEMPLATE_CARD_TYPE:
      return {
        ...state,
        tempalteCardType: action.value,
      };
    default:
      return state;
  }
};

const store = createStore(reducer);
export default store;

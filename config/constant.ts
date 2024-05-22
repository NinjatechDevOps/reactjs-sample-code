export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || "_auth";
export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
export const STRIPE_SECRET_KEY = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
export const GET_ADDRESS_KEY = process.env.NEXT_PUBLIC_GET_ADDRESS_KEY;
export const GOOGLE_MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Upstrapp Shop";
export const LOGO_NAME = process.env.NEXT_PUBLIC_APP_LOGO_NAME || "Upstrapp";
export const LOGO_PRIMARY_TEXT = process.env.NEXT_PUBLIC_APP_LOGO_PRIMARY_TEXT || "Gifts & Cards";
export const LOGO_PRIMARY_MOBILE_TEXT = process.env.NEXT_PUBLIC_APP_LOGO_PRIMARY_MOBILE_TEXT || "Gifts";

export const BASKET_ITEMS = "_basket";
export const DELIVERY_KEY = "_dlvry";
export const DEFAULT_DELIVERY_CHARGE = 4.95;
export const DEFAULT_PRODUCTS_LIMIT = 20;
export const DEFAULT_OFFSET = 0;

export const AUTHORIZED_PAGES = [
  // "/basket",
  "/checkout/address",
  "/checkout/payment",
  "/reviews",
  "/account",
  "/account/profile",
  "/account/orders",
  "/account/cards",
  "/account/address",
];
export const LOGIN_REDIRECT_PAGES = [
  "/sign-in",
  "/register",
  "/forgot-password",
];

export const PAYMENT_CARD_IMAGE = {
  visa: "/images/card/visa.svg",
  mastercard: "/images/card/master-card.svg",
  amex: "/images/card/american-express.png",
  discover: "/images/card/discover.png",
  diners: "/images/card/diners-club.png",
  jcb: "/images/card/jcb.png",
};

export const DEFAULT_DELIVERY_LIST = [
  { label: "Free Delivery", value: 0 },
  { label: "Next Day Courier - £4.95", value: 4.95 },
];

export const DEFAULT_PAPER_SIZE = [
  { label: "Gloss", value: "1" },
  { label: "Matt", value: "2" },
];

export const PAPER_SIZE_LABEL = { "1": "Gloss", "2": "Matt" };

export const PAGE_TITLES = {
  "/product": "Search Products",
  "/sign-in": "Sign In",
  "/forgot-password": "Forgot Password",
  "/register": "Regsiter",
  "/basket": "Basket",
  "/basket/confirmation/[id]": "Order Confirmation",
  "/account": "Account",
  "/reviews": "Reviews",
  "/account/profile": "My Profile",
  "/account/orders": "My Orders",
  "/account/orders/[id]": "Order Detail",
  "/account/cards": "My Payment Cards",
  "/account/address": "My Address",
  "/account/reminders": "My Reminders",
};

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const DEFAULT_FONT_SIZES = [14, 16, 18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65];

export const DEFAULT_COLORS = ["#000", "#ed2124", "#44963d", "#ee3e8f", "#008c98", "#7056a4", "#f2822f", "#21318b", "#336735", "#bf375b", "#7a7a7a", "#dd4f12", "#572a77"];
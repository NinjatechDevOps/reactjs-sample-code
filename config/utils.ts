import Cookies from "js-cookie";
import { APP_NAME, PAGE_TITLES, TOKEN_KEY } from "./constant";
import _ from "lodash";

export const isArrayEqual = function (x, y) {
  return _(x).differenceWith(y, _.isEqual).isEmpty();
};

export const sortParentChild = (data: Array<any>, key: string, root = null) => {
  var t = {};
  data.forEach((element) => {
    Object.assign((t[element.id] = t[element.id] || {}), element);
    t[element[key]] = t[element[key]] || {};
    t[element[key]].children = t[element[key]].children || [];
    t[element[key]].children.push(t[element.id]);
  });
  return t[root].children;
};

export const dynamicSort = (property: string) => {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a: any, b: any) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
};

export const setAuthHeader = (
  cookies: any = null,
  authToken: string = null
) => {
  if (authToken) {
    return {
      headers: { Authorization: `Bearer ${authToken}` },
    };
  }
  try {
    const token = (cookies && cookies[TOKEN_KEY]) || Cookies.get(TOKEN_KEY);
    if (!token) {
      return { headers: {} };
    }
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  } catch (e) {
    // console.log("setAuthHeader e", e);
    return { headers: {} };
  }
};

export const validateMobileNumber = (event) => {
  const keyCode = event.keyCode || event.which;
  // console.log(keyCode);
  const keyValue = String.fromCharCode(keyCode);
  if (/\+|-/.test(keyValue)) {
    event.preventDefault();
  }
  if (
    [32, 46, 8, 9, 27, 13, 109, 110, 190, 187, 189, 173].indexOf(
      event.keyCode
    ) !== -1 ||
    // Allow: Ctrl+A
    (event.keyCode === 65 && (event.ctrlKey || event.metaKey)) ||
    (event.keyCode === 67 && (event.ctrlKey || event.metaKey)) ||
    (event.keyCode === 86 && (event.ctrlKey || event.metaKey)) ||
    (event.keyCode === 88 && (event.ctrlKey || event.metaKey)) ||
    (event.keyCode >= 35 && event.keyCode <= 39)
  ) {
    // let it happen, don't do anything
    return;
  }
  // Ensure that it is a number and stop the keypress
  if (
    (event.shiftKey || event.keyCode < 48 || event.keyCode > 57) &&
    (event.keyCode < 96 || event.keyCode > 105)
  ) {
    event.preventDefault();
  }
};

export const toCurrencyFormat = (value) => {
  return value ? "£" + Number(value).toFixed(2) : value;
};

export const getPageTitle = (pathname) => {
  return PAGE_TITLES[pathname]
    ? `${PAGE_TITLES[pathname]} | ${APP_NAME}`
    : APP_NAME;
};

export const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const getTimeDifference = (previous) => {
  const current = Date.now();
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;
  const elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago';
  }
}
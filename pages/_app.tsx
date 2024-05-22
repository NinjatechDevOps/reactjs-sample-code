import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import axios from "axios";

import Layout from "../components/layout/Layout";
import store from "../store";

// Including SCSS
import "../styles/index.scss";
import Loader from "../components/Loader";
import {
  IBasket,
  ICardPrice,
  ICategory,
  IFooter,
  IMessageRibbon,
  IUser,
} from "../models";
import {
  API_URL,
  AUTHORIZED_PAGES,
  LOGIN_REDIRECT_PAGES,
  TOKEN_KEY,
} from "../config/constant";
import { setAuthHeader } from "../config/utils";

export const App = ({ Component, pageProps }) => {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState<Boolean>(false);
  // console.log('pageProps', pageProps);
  // to manage loader on top
  useEffect(() => {
    const handleStart = () => {
      setPageLoading(true);
    };
    const handleComplete = () => {
      setPageLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
  }, [router]);

  useEffect(() => {
    // console.log('router.pathname', router.pathname);
    if (AUTHORIZED_PAGES.includes(router.pathname) && !pageProps?.user) {
      router.push(`/sign-in?next=${router?.pathname}`);
      return;
    } else if (
      LOGIN_REDIRECT_PAGES.includes(router.pathname) &&
      pageProps?.user
    ) {
      router.push("/");
      return;
    }
  }, [router.pathname]);

  return (
    <Provider store={store}>
      {pageLoading ? (
        <Loader />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </Provider>
  );
};

App.getInitialProps = async ({ ctx }) => {
  // console.info("App.getInitialProps", ctx);
  const { err } = ctx;
  let messageRibbon: IMessageRibbon;
  let category: ICategory;
  let user: IUser | null = null;
  let basketCount: number = 0;
  let basketProducts: IBasket[] = [];
  let footer: IFooter[] = [];
  let token: string;
  let cardPriceList: ICardPrice[] = [];
  let showReminderIcon: boolean = false;
  if (ctx?.req?.cookies) {
    token = ctx?.req?.cookies[TOKEN_KEY];
  } else {
    token = Cookies.get(TOKEN_KEY);
  }
  // const token = ctx?.req?.cookies[TOKEN_KEY] || Cookies.get(TOKEN_KEY);
  // console.log(`API_URL : ${API_URL}`);
  if (token) {
    try {
      const userResponse = await axios
        .get(`${API_URL}/auth/profile`, setAuthHeader(null, token))
        .then((res) => res.data);
      // console.log("userResponse", userResponse);
      user = userResponse.user;
    } catch (e: any) {
      console.log("error auth profile", e.response);
      user = null;
    }
  }

  // get message-ribbon
  try {
    const { data } = await axios
      .get(`${API_URL}/home/headers`, token ? setAuthHeader(null, token) : {})
      .then((res) => res.data);
    messageRibbon = data.messageRibbon;
    category = data.category;
    basketCount = data.basketCount;
    basketProducts = data.basketProducts || [];
    footer = data.footer || [];
    cardPriceList = data.cardPrice || [];
    showReminderIcon = data.showReminderIcon;
  } catch (e: any) {
    messageRibbon = null;
    category = null;
    basketCount = 0;
  }
  return {
    pageProps: {
      messageRibbon,
      category,
      basketCount,
      basketProducts,
      user,
      footer,
      cardPriceList,
      showReminderIcon,
      error: err,
    },
  };
};

export default App;

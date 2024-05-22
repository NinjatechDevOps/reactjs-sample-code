import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Head from "next/head";

// import Header from "./Header";
import Footer from "./Footer";
import { BASKET_ITEMS } from "../../config/constant";
import {
  SET_AUTH,
  PURGE_AUTH,
  SET_BASKET_PRODUCT,
  SET_CARD_PRICE,
} from "../../store/actions";
import { NavBar } from "./NavBar";
import { useWindowSize } from "../hooks/window";
import { useRouter } from "next/router";
import { getPageTitle } from "../../config/utils";
import { IInitialState } from "../../models";
import { PersonalizationHeader } from "./PersonalizationHeader";
import Header from "./Header";

type LayoutProps = {
  children?: JSX.Element;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const pageTitle = getPageTitle(router.pathname);
  const showFooter = useSelector((state: IInitialState) => state.showFooter);

  useEffect(() => {
    dispatch({
      type: children?.props?.user ? SET_AUTH : PURGE_AUTH,
      value: children?.props?.user,
    });
    dispatch({
      type: SET_CARD_PRICE,
      value: children.props?.cardPriceList || [],
    });
    if (process.browser) {
      const basketProductsLists =
        JSON.parse(localStorage.getItem(BASKET_ITEMS)) || [];
      dispatch({
        type: SET_BASKET_PRODUCT,
        value:
          children?.props?.basketProducts &&
          children?.props?.basketProducts.length > 0
            ? children?.props?.basketProducts
            : basketProductsLists,
      });
    }
  }, [children?.props?.user]);

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>
      </Head>
      {router.pathname.startsWith("/personalisation/") ? (
        <PersonalizationHeader {...children?.props} />
      ) : (
        <Header {...children?.props} />
      )}
      <div className="content-wrapper">{children}</div>
      {showFooter && <Footer footer={children?.props?.footer} />}
      {width && width < 768 && <NavBar />}
    </div>
  );
};

export default Layout;

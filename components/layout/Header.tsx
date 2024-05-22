import Link from "next/link";
import { useRouter } from "next/router";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faSearch,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  IInitialState,
  IBasket,
  IProduct,
  IPersonalisationImageItem,
  ICardPrice,
  IBasketSwatchItems,
  IBasketProduct,
} from "../../models";

import { ICategory, IMessageRibbon, IUser } from "../../models";
import {
  sortParentChild,
  dynamicSort,
  toCurrencyFormat,
} from "../../config/utils";
import {
  API_URL,
  LOGO_NAME,
  LOGO_PRIMARY_MOBILE_TEXT,
  LOGO_PRIMARY_TEXT,
  TOKEN_KEY,
} from "../../config/constant";
import axios, { AxiosResponse } from "axios";
import { HIDE_NAVBAR, HIDE_SEARCH_BAR } from "../../store/actions";
import { useWindowSize } from "../hooks/window";

type Props = {
  messageRibbon: IMessageRibbon;
  category: ICategory[];
  user: IUser;
  showReminderIcon: boolean;
};

const Header = ({ messageRibbon, category, user, showReminderIcon }: Props) => {
  // console.log(showReminderIcon);
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [parentCategoryLink, setParentCategoryLink] = useState<string>("");
  const [hoverCategory, setHoverCategory] = useState<string>(null);
  const [basketCount, setBasketCount] = useState<number>(0);
  const [showBasketDropDown, setShowBasketDropDown] = useState<boolean>(false);
  const [showUserDropDown, setShowUserDropDown] = useState<boolean>(false);
  const [showSearchDropDown, setShowSearchDropDown] = useState<boolean>(false);
  const [showProductLoader, setShowProductLoader] = useState<boolean>(false);
  const [parentCategory, setParentCategory] = useState<ICategory>(null);
  const [selectedChildCategory, setSelectedChildCategory] =
    useState<ICategory>(null);
  const [childCategoryList, setChildCategoryList] = useState<ICategory[]>([]);
  const [productList, setProductList] = useState<IProduct[]>([]);
  // const [scrolled, setScrolled] = React.useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");
  const basketProducts = useSelector(
    (state: IInitialState) => state.basketProducts
  );
  const showNavBarMenu: boolean = useSelector(
    (state: IInitialState) => state.showNavBarMenu
  );
  const showSearchBar: boolean = useSelector(
    (state: IInitialState) => state.showSearchBar
  );
  const isAuthenticated: boolean = useSelector(
    (state: IInitialState) => state.isAuthenticated
  );
  const cardPriceList: ICardPrice[] = useSelector(
    (state: IInitialState) => state.cardPriceList
  );

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  // });

  useEffect(() => {
    setTotalAmount(
      basketProducts.reduce(function (acc, element) {
        let price = element?.product?.pricing?.onSale
          ? element?.product?.pricing?.grossSalePrice
          : element?.product?.pricing?.grossSellPrice;
        if (element?.product?.productType === "5") {
          const instance = cardPriceList.find(
            (obj) => obj.id === element.card?.cardPrice
          );
          if (instance) {
            price = instance?.onSale ? instance.salePrice : instance.sellPrice;
          }
        }
        return acc + price * element.quantity;
      }, 0)
    );
    setBasketCount(basketProducts.length);
  }, [basketProducts]);

  useEffect(() => {
    if (hoverCategory) {
      const selectedCategory: ICategory = category.find(
        (obj) => obj.id === hoverCategory
      );
      let link: string = "";
      if (selectedCategory) {
        if (String(selectedCategory.type) === "1") {
          const childCategory = category.find(
            (obj) => obj.id === selectedCategory.category
          );
          if (childCategory) {
            link = `/category/${childCategory.categoryRef}`;
            if (selectedCategory.tags && selectedCategory.tags.length > 0) {
              link += `?tag=${selectedCategory.tags.toString()}`;
            }
          }
        } else {
          link = `/product/${selectedCategory?.product?.sku}`;
        }
        setParentCategoryLink(link);
      } else {
        setParentCategoryLink("");
      }
    } else {
      setParentCategoryLink("");
    }
  }, [hoverCategory]);

  useEffect(() => {
    setCategoryList(
      category && category.length > 0
        ? sortParentChild(
            category?.sort(dynamicSort("sortOrder")),
            "parentCategory"
          )
        : []
    );
  }, [category]);

  useEffect(() => {
    setChildCategoryList(
      parentCategory
        ? category.filter((obj) => obj.parentCategory === parentCategory?.id)
        : []
    );
  }, [parentCategory]);

  // const handleScroll = () => {
  //   const offset = window.scrollY;
  //   if (offset > 70) {
  //     setScrolled(true);
  //   } else {
  //     setScrolled(false);
  //   }
  // };

  // const navClass = ["nav-wrapper sticky"];
  // if (scrolled) {
  //   navClass.push("sticky");
  // }

  useEffect(() => {
    onSearch();
  }, [searchText]);

  const _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      dispatch({ type: HIDE_SEARCH_BAR });
      router.push(`/product?search=${searchText}`);
    }
  };

  const onSearch = async () => {
    if (!searchText || searchText.length < 3) {
      setShowSearchDropDown(false);
      return;
    }
    setShowProductLoader(true);
    let defaultURL: string = `${API_URL}/product?search=${searchText}&limit=${5}&offset=${0}&categoryDetail=${true}&headerList=${true}`;
    try {
      const { results } = await axios
        .get(encodeURI(defaultURL))
        .then((response: AxiosResponse) => {
          return response.data;
        });
      setShowSearchDropDown(true);
      setProductList(results);
    } catch (e) {
      setProductList([]);
    } finally {
      setShowProductLoader(false);
    }
  };

  const onSignOut = () => {
    Cookies.remove(TOKEN_KEY);
    router.push("/");
  };

  let productItems: any = (
    <p className="text-center text-muted"> No Products found </p>
  );
  if (productList.length > 0) {
    productItems = productList.map((product: IProduct, index) => {
      let totalPrice = product.pricing.onSale
        ? product?.pricing?.grossSalePrice
        : product?.pricing?.grossSellPrice;
      if (product?.productType === "5") {
        const instance = cardPriceList.find(
          (obj) => obj.isDefault && obj.type === product.card.cardType
        );
        if (instance) {
          totalPrice = instance?.onSale
            ? instance.salePrice
            : instance.sellPrice;
        } else {
          const firstInstance = cardPriceList.filter(
            (obj) => obj.type === product.card.cardType
          )[0];
          totalPrice = firstInstance?.onSale
            ? firstInstance.salePrice
            : firstInstance.sellPrice;
        }
      }
      let defaultImage: string = "images/product_image_1.jpg";
      let altText: string;
      if (product?.images && product?.images?.length > 0) {
        const image = product.images.find((image) => image.isDefault);
        defaultImage = image ? image.image : product.images[0].image;
        altText = image ? image.altText : product.images[0].altText;
      }
      return (
        <div className="search-item row" key={index}>
          <div className="col-9 d-flex">
            <div className="product-img">
              <img src={defaultImage} alt={altText} />
            </div>
            <div className="product-title-sec">
              <h4 className="m-0">
                <Link href={`/product/${product?.sku}`}>
                  <a onClick={() => dispatch({ type: HIDE_SEARCH_BAR })}>
                    {product?.name}
                  </a>
                </Link>
              </h4>
            </div>
          </div>
          <div className="col-3 prd-price m-0">
            {toCurrencyFormat(totalPrice)}
          </div>
        </div>
      );
    });
  }

  return (
    <React.Fragment>
      {!showNavBarMenu ? (
        <>
          <header className="header">
            <div
              className={`nav-wrapper ${
                width > 768 || showSearchBar ? "sticky" : ""
              }`}
            >
              <div className="container">
                {!showSearchBar ? (
                  <div className="m-header-logo d-none">
                    <Link href="/">
                      <a>
                        <img src="/images/logo.svg" alt="logo" />
                        <span className="logo-text">
                          <span className="text-secondary">{LOGO_NAME}</span>
                          <span className="text-primary">
                            &nbsp;{LOGO_PRIMARY_TEXT}
                          </span>
                          {/* & Cards */}
                        </span>
                      </a>
                    </Link>
                  </div>
                ) : (
                  <div className="search">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Search for a gift..."
                      autoFocus={true}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={_handleKeyDown}
                      onBlur={() => {
                        if (!searchText) dispatch({ type: HIDE_SEARCH_BAR });
                      }}
                    />
                    <button
                      type="submit"
                      className="searchButton"
                      onClick={() => {
                        dispatch({ type: HIDE_SEARCH_BAR });
                        router.push(`/product?search=${searchText}`);
                      }}
                    >
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                    {showSearchDropDown && (
                      <div
                        className="search-product-box"
                        // onMouseLeave={() => {
                        //   setShowSearchDropDown(false);
                        //   setProductList([]);
                        // }}
                      >
                        <div className="search-inner">
                          {showProductLoader ? (
                            <div className="text-center">
                              <FontAwesomeIcon
                                height={26}
                                icon={faSpinner}
                                pulse={true}
                                className="load-more"
                              />
                            </div>
                          ) : (
                            <>
                              <div className="search-items">{productItems}</div>
                              {productItems.length > 0 && (
                                <>
                                  {/* <hr /> */}
                                  <div className="text-center">
                                    <Link
                                      href={`/product?search=${searchText}`}
                                    >
                                      <a
                                        className="btn btn-primary btn-sm"
                                        onClick={() =>
                                          dispatch({ type: HIDE_SEARCH_BAR })
                                        }
                                      >
                                        See All
                                      </a>
                                    </Link>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="header-inner m-none">
                  <div className="header-left">
                    <div className="header-logo">
                      <Link href="/">
                        <a>
                          <img src="/images/logo.svg" alt="logo" />
                        </a>
                      </Link>
                    </div>
                    <Link href="/">
                      <a>
                        <div className="logo-text">
                          <span className="text-secondary">{LOGO_NAME}</span>
                          <span className="text-primary">
                            &nbsp;{LOGO_PRIMARY_TEXT}
                          </span>
                        </div>
                      </a>
                    </Link>
                  </div>
                  <div className="header-right">
                    <div
                      className="search"
                      onMouseLeave={() => {
                        setShowSearchDropDown(false);
                        setProductList([]);
                      }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search for a gift..."
                        onChange={(e) => setSearchText(e.target.value)}
                        // onBlur={() => {
                        //   setProductList([]);
                        //   setShowSearchDropDown(false);
                        // }}
                      />
                      <button
                        type="submit"
                        className="searchButton"
                        onClick={() =>
                          router.push(`/product?search=${searchText}`)
                        }
                      >
                        <FontAwesomeIcon icon={faSearch} />
                      </button>
                      {showSearchDropDown && (
                        <div
                          className="search-product-box"
                          // onMouseLeave={() => {
                          //   setShowSearchDropDown(false);
                          //   setProductList([]);
                          // }}
                        >
                          <div className="search-inner">
                            {showProductLoader ? (
                              <div className="text-center">
                                <FontAwesomeIcon
                                  height={26}
                                  icon={faSpinner}
                                  pulse={true}
                                  className="load-more"
                                />
                              </div>
                            ) : (
                              <>
                                <div className="search-items">
                                  {productItems}
                                </div>
                                {productItems.length > 0 && (
                                  <>
                                    {/* <hr /> */}
                                    <div className="text-center">
                                      <Link
                                        href={`/product?search=${searchText}`}
                                      >
                                        <a className="btn btn-primary btn-sm">
                                          See All
                                        </a>
                                      </Link>
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="header-signup">
                      {isAuthenticated ? (
                        <div
                          className="account-sec"
                          onMouseEnter={() => {
                            setShowUserDropDown(true);
                          }}
                          onMouseLeave={() => {
                            setShowUserDropDown(false);
                          }}
                        >
                          <Link href="/account">
                            <div className="icn-signup cursor-pointer">
                              <svg
                                id="Layer_1"
                                data-name="Layer 1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 25.05 26.32"
                              >
                                <defs>
                                  <clipPath
                                    id="clip-path"
                                    transform="translate(-109.05 -41.76)"
                                  >
                                    <rect
                                      className="cls-1"
                                      x="109.04"
                                      y="41.76"
                                      width="25.05"
                                      height="26.32"
                                    />
                                  </clipPath>
                                </defs>
                                <g className="cls-2">
                                  <path
                                    className="cls-3 active"
                                    d="M133.14,68.08c0-4.23-5.18-7.65-11.57-7.65S110,63.85,110,68.08m17.17-19.59a5.79,5.79,0,1,0-5.79,5.78A5.79,5.79,0,0,0,127.17,48.49Z"
                                    transform="translate(-109.05 -41.76)"
                                  />
                                </g>
                              </svg>
                              {showReminderIcon && !showUserDropDown && (
                                <span className="badge reminder-badge">!</span>
                              )}
                              {/* <span className="text-primary">
                            {user?.firstName}
                          </span> */}
                              {showUserDropDown && (
                                <div
                                  className="user-dropdown-box"
                                  onMouseLeave={() => {
                                    setShowUserDropDown(false);
                                  }}
                                >
                                  <div className="dropdown-inner">
                                    <ul className="items">
                                      <li className="title">
                                        Hi {user?.firstName}
                                      </li>
                                      <li className="item">
                                        <Link href="/account/profile">
                                          <a>
                                            <img
                                              src="/images/account/profile.svg"
                                              alt="Profile"
                                            />
                                            <span>My Details</span>
                                          </a>
                                        </Link>
                                      </li>
                                      <li className="item">
                                        <Link href="/account/orders">
                                          <a>
                                            <img
                                              src="/images/account/orders.svg"
                                              alt="Orders"
                                            />
                                            <span>My Orders</span>
                                          </a>
                                        </Link>
                                      </li>
                                      <li className="item">
                                        <Link href="/account/cards">
                                          <a>
                                            <img
                                              src="/images/account/cards.svg"
                                              alt="Payment Cards"
                                            />
                                            <span>My Payment Cards</span>
                                          </a>
                                        </Link>
                                      </li>
                                      <li className="item">
                                        <Link href="/account/address">
                                          <a>
                                            <img
                                              src="/images/account/address.svg"
                                              alt="Address Book"
                                            />
                                            <span>My Address Book</span>
                                          </a>
                                        </Link>
                                      </li>
                                      <li className="item">
                                        <Link href="/account/reminders">
                                          <a>
                                            {showReminderIcon && (
                                              <span className="badge reminder-link-badge">
                                                !
                                              </span>
                                            )}
                                            <img
                                              src="/images/account/reminder.svg"
                                              alt="My Reminders"
                                            />
                                            <span>My Reminders</span>
                                          </a>
                                        </Link>
                                      </li>
                                    </ul>
                                    <div className="text-center pt-3 pb-4">
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => onSignOut()}
                                      >
                                        Sign Out
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Link>
                        </div>
                      ) : (
                        <div className="account-sec">
                          <Link href="/sign-in">
                            <a className="icn-signup">
                              <svg
                                id="Layer_1"
                                data-name="Layer 1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 25.05 26.32"
                              >
                                <defs>
                                  <clipPath
                                    id="clip-path"
                                    transform="translate(-109.05 -41.76)"
                                  >
                                    <rect
                                      className="cls-1"
                                      x="109.04"
                                      y="41.76"
                                      width="25.05"
                                      height="26.32"
                                    />
                                  </clipPath>
                                </defs>
                                <g className="cls-2">
                                  <path
                                    className="cls-3"
                                    d="M133.14,68.08c0-4.23-5.18-7.65-11.57-7.65S110,63.85,110,68.08m17.17-19.59a5.79,5.79,0,1,0-5.79,5.78A5.79,5.79,0,0,0,127.17,48.49Z"
                                    transform="translate(-109.05 -41.76)"
                                  />
                                </g>
                              </svg>
                            </a>
                          </Link>
                        </div>
                      )}
                      <div
                        className="basket-sec"
                        onMouseEnter={() => {
                          setShowUserDropDown(false);
                          setShowBasketDropDown(
                            basketProducts.length > 0 ? true : false
                          );
                        }}
                        onMouseLeave={() => setShowBasketDropDown(false)}
                      >
                        <Link href="/basket">
                          <a className="icn-basket">
                            <img src="/images/basket.svg" alt="Basket" />
                            {basketCount > 0 && (
                              <span className="badge basket-count">
                                {basketCount}
                              </span>
                            )}
                          </a>
                        </Link>
                        {showBasketDropDown && (
                          <div
                            className="basket-box"
                            onMouseLeave={() => setShowBasketDropDown(false)}
                          >
                            <div className="basket-inner">
                              <ul className="basket-items">
                                {basketProducts.map(
                                  (element: IBasket, index) => {
                                    const product: IBasketProduct =
                                      element?.product;
                                    let price = product?.pricing?.onSale
                                      ? product?.pricing?.grossSalePrice
                                      : product?.pricing?.grossSellPrice;
                                    if (product.productType === "5") {
                                      const instance = cardPriceList.find(
                                        (obj) =>
                                          obj.id === element.card?.cardPrice
                                      );
                                      if (instance) {
                                        price = instance?.onSale
                                          ? instance.salePrice
                                          : instance.sellPrice;
                                      }
                                    }
                                    const totalPrice = price * element.quantity;
                                    let defaultImage: string;
                                    let altText: string;
                                    let productLink = `/product/${element?.product?.sku}`;
                                    if (element.swatchProduct) {
                                      const swatchItem: IBasketSwatchItems =
                                        element.product?.swatch?.items.find(
                                          (obj) =>
                                            String(obj.product) ===
                                            String(element.swatchProduct)
                                        );
                                      if (swatchItem) {
                                        defaultImage = swatchItem.altImage;
                                        altText = swatchItem.swatchText;
                                        productLink += `?swatch=${element.swatchProduct}`;
                                      }
                                    }
                                    if (element.personalisationImageSwatch) {
                                      const personalisationImageItem: IPersonalisationImageItem =
                                        element.product?.personalisationImage?.items.find(
                                          (obj) =>
                                            obj._id ===
                                            element.personalisationImageSwatch
                                        );
                                      if (personalisationImageItem) {
                                        defaultImage =
                                          personalisationImageItem.displayImage;
                                        altText =
                                          personalisationImageItem.swatchName;
                                        productLink += `?personalisationImage=${element.personalisationImageSwatch}`;
                                      }
                                    }
                                    if (
                                      !defaultImage &&
                                      product?.images &&
                                      product?.images?.length > 0
                                    ) {
                                      const image = product.images.find(
                                        (image) => image.isDefault
                                      );
                                      defaultImage = image
                                        ? image.image
                                        : product.images[0].image;
                                      altText = image
                                        ? image.altText
                                        : product.images[0].altText;
                                    }
                                    return (
                                      <li className="basket-item" key={index}>
                                        <div className="basket-img">
                                          <img
                                            src={defaultImage}
                                            alt={altText}
                                          />
                                        </div>
                                        <div className="basket-title-sec">
                                          <h4 className="m-0">
                                            <Link href={productLink}>
                                              <a> {product?.name}</a>
                                            </Link>
                                          </h4>
                                          <span className="prd-qty">
                                            Qty: {element.quantity}
                                          </span>
                                          <br />
                                          <span className="prd-price">
                                            {toCurrencyFormat(totalPrice)}
                                          </span>
                                        </div>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                              <hr />
                              <div className="total-sec">
                                Total :
                                <span className="total-amt">
                                  {toCurrencyFormat(totalAmount)}
                                </span>
                              </div>
                              <div className="basket-btn">
                                <Link href="/basket">
                                  <a className="btn btn-primary">View Basket</a>
                                </Link>
                                <Link
                                  href={
                                    isAuthenticated
                                      ? "/basket/checkout"
                                      : "/sign-in?next=/basket/checkout"
                                  }
                                >
                                  <a className="btn btn-outline-primary">
                                    Checkout
                                  </a>
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="navbar m-none">
                  {categoryList.map((element) => {
                    return (
                      <div
                        key={element?.id}
                        className={`dropdown${
                          hoverCategory === element?.id ? " show" : ""
                        }`}
                        onMouseEnter={() => setHoverCategory(element?.id)}
                        onMouseLeave={() => setHoverCategory(null)}
                      >
                        <button className="dropbtn">
                          {element?.name}
                          <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                        {hoverCategory === element?.id && (
                          <div className="dropdown-content">
                            <div className="menu-left-sec">
                              <div className="row">
                                {element?.children &&
                                  element?.children.length > 0 &&
                                  element?.children.map((children) => {
                                    const first = children?.children?.slice(
                                      0,
                                      12
                                    );
                                    const last = children?.children?.slice(
                                      12,
                                      children?.children?.length
                                    );
                                    if (!first || !last) return;
                                    return (
                                      <div
                                        className="column"
                                        key={children?.id}
                                      >
                                        <h5>{children?.name}</h5>
                                        <div className="row">
                                          <div className="col-6">
                                            {first.map((item) => {
                                              return (
                                                <Link
                                                  key={item?.id}
                                                  href={`/category/${element.categoryRef}/${children.categoryRef}/${item.categoryRef}`}
                                                >
                                                  <a>{item?.name}</a>
                                                </Link>
                                              );
                                            })}
                                          </div>
                                          {last?.length > 0 && (
                                            <div className="col-6">
                                              {last.map((item) => {
                                                return (
                                                  <Link
                                                    key={item?.id}
                                                    href={`/category/${element.categoryRef}/${children.categoryRef}/${item.categoryRef}`}
                                                  >
                                                    <a>{item?.name}</a>
                                                  </Link>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                            <div className="menu-right-sec">
                              <Link href={parentCategoryLink}>
                                <a>
                                  <img
                                    src={
                                      element?.image ||
                                      "/images/promo_image_1.jpg"
                                    }
                                    alt={element?.name}
                                  />
                                  <div
                                    className="mb-0"
                                    dangerouslySetInnerHTML={{
                                      __html: element?.headerText,
                                    }}
                                  ></div>
                                </a>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </header>
          <div id="message-ribbon" />
          {messageRibbon?.message && (
            <div className="header-bottom container">
              <div
                dangerouslySetInnerHTML={{ __html: messageRibbon?.message }}
              ></div>
            </div>
          )}
        </>
      ) : (
        <div className="sidebar-menu">
          <div className="sidebar-menu__cont">
            <div className="sidebar-menu__cont__header">
              <Link href="/">
                <a className="sidebar-menu__cont__header__logo">
                  <img src="/images/logo.svg" alt="Logo" />
                  <p>
                    {LOGO_NAME}
                    <span>&nbsp;{LOGO_PRIMARY_TEXT}</span>
                  </p>
                </a>
              </Link>
              <a
                onClick={() => {
                  setParentCategory(null);
                  setSelectedChildCategory(null);
                  dispatch({ type: HIDE_NAVBAR });
                }}
                className="sidebar-menu__cont__header__close"
              ></a>
            </div>
            <div className="sidebar-menu__cont__menu-list">
              {!parentCategory &&
                categoryList.map((category) => (
                  <div
                    className="sidebar-menu__cont__menu-list__item"
                    key={category.id}
                  >
                    <a
                      onClick={() => {
                        setParentCategory(category);
                        setSelectedChildCategory(null);
                      }}
                      className="sidebar-menu__cont__menu-list__item__link"
                    >
                      {category.name}
                      <FontAwesomeIcon icon={faChevronRight} height={16} />
                    </a>
                  </div>
                ))}
            </div>
            <div className="sidebar-menu__cont__menu-list-step-2">
              {parentCategory && (
                <div className="sidebar-menu__cont__menu-list-step-2__header">
                  <a
                    onClick={() => setParentCategory(null)}
                    className="sidebar-menu__cont__menu-list-step-2__header__back"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} height={16} />
                  </a>
                  <p>{parentCategory?.name}</p>
                </div>
              )}
              {childCategoryList.map((obj) => {
                const subCategory = category.filter(
                  (element) =>
                    selectedChildCategory?.id === element?.parentCategory
                );
                return (
                  <div
                    className="sidebar-menu__cont__menu-list-step-2__item"
                    key={obj.id}
                  >
                    <a
                      onClick={() =>
                        setSelectedChildCategory(
                          selectedChildCategory?.id === obj?.id ? null : obj
                        )
                      }
                      className="sidebar-menu__cont__menu-list-step-2__item__link"
                    >
                      {obj.name}
                      <FontAwesomeIcon
                        icon={
                          selectedChildCategory?.id === obj?.id
                            ? faChevronUp
                            : faChevronDown
                        }
                        height={16}
                      />
                    </a>
                    {selectedChildCategory?.id === obj.id &&
                      subCategory?.length > 0 && (
                        <div className="sidebar-menu__cont__menu-list-step-2__item__links">
                          {subCategory.map((child) => (
                            <Link
                              href={`/category/${parentCategory?.categoryRef}/${selectedChildCategory?.categoryRef}/${child.categoryRef}`}
                              key={child.id}
                            >
                              <a
                                onClick={() => dispatch({ type: HIDE_NAVBAR })}
                              >
                                {child.name}
                              </a>
                            </Link>
                          ))}
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Header;

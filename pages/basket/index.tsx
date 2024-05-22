import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import axios from "axios";
import Cookies from "js-cookie";
import _ from "lodash";
import Slider from "react-slick";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

import {
  API_URL,
  BASKET_ITEMS,
  TOKEN_KEY,
  PAPER_SIZE_LABEL,
} from "../../config/constant";
import { setAuthHeader, toCurrencyFormat } from "../../config/utils";
import {
  IBasket,
  ICardPrice,
  IInitialState,
  IDelivery,
  IPersonalisationImageItem,
  IProduct,
  IBasketSwatchItems,
} from "../../models";
import { PURGE_AUTH, SET_BASKET_PRODUCT } from "../../store/actions";
import { ProductThumbnailView } from "../../components/ProductThumbnailView";
import { EmptyBasket } from "../../components/EmptyBasket";
import { useWindowSize } from "../../components/hooks/window";

type Props = {
  product: IBasket[];
  linkedProduct: IProduct[];
  deliveryList?: IDelivery[];
};

const Basket = ({ product, linkedProduct }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = useWindowSize();

  const isAuthenticated: boolean = useSelector(
    (state: IInitialState) => state.isAuthenticated
  );
  const cardPriceList: ICardPrice[] = useSelector(
    (state: IInitialState) => state.cardPriceList
  );
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [productList, setProductList] = useState<IBasket[]>(product);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    if (process.browser && !isAuthenticated) {
      const basketProductsLists =
        JSON.parse(localStorage.getItem(BASKET_ITEMS)) || [];
      if (basketProductsLists.length > 0) {
        setProductList(basketProductsLists);
        const basketProductsIds = basketProductsLists.map(
          (obj) => obj.product.id
        );
        const products = [];
        products.push(
          ...basketProductsLists.map((obj) => obj.product?.linkedProducts || [])
        );
        const uniqueProducts = [].concat.apply([], _.union(products));
        const finalProducts: any = _.uniqBy(
          uniqueProducts.filter((ele) => !basketProductsIds.includes(ele.id)),
          "id"
        );
        setRelatedProducts(finalProducts.slice(0, 10));
      }
    }
    if (linkedProduct.length > 0) {
      setRelatedProducts([].concat.apply([], linkedProduct));
    }
  }, []);

  useEffect(() => {
    const totalPrice = productList.reduce(function (acc, element) {
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
    }, 0);
    setTotalAmount(totalPrice);
    dispatch({ type: SET_BASKET_PRODUCT, value: [...productList] });
    if (!isAuthenticated) {
      if (productList.length === 0) {
        localStorage.removeItem(BASKET_ITEMS);
      } else {
        localStorage.setItem(BASKET_ITEMS, JSON.stringify([...productList]));
      }
    }
  }, [productList]);

  const onRemove = async (id: string) => {
    if (!isAuthenticated) {
      setProductList([...productList.filter((element) => element._id !== id)]);
      return;
    }
    try {
      await axios.delete(`${API_URL}/basket/${id}`, setAuthHeader());
      setProductList([...productList.filter((element) => element._id !== id)]);
    } catch (e: any) {
      if (e.response?.status === 401) {
        dispatch({ type: PURGE_AUTH });
        router.push(`/sign-in?next=${window.location.pathname}`);
      }
    }
  };

  const updateBasket = async (data: any) => {
    // console.log("updateBasket", data);
    if (!isAuthenticated) return;
    try {
      await axios
        .patch(`${API_URL}/basket`, data, setAuthHeader())
        .then((res) => res.data);
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch({ type: PURGE_AUTH });
        router.push(`/sign-in?next=${window.location.pathname}`);
      }
    }
  };

  let listItems: any = <></>;
  if (productList.length > 0) {
    listItems = productList.map((element: IBasket, index: number) => {
      // console.log("element", element);
      let cardPrice: any;
      let cardSize: any;
      let price = element?.product?.pricing?.onSale
        ? element?.product?.pricing?.grossSalePrice
        : element?.product?.pricing?.grossSellPrice;
      if (element?.product?.productType === "5") {
        const instance = cardPriceList.find(
          (obj) => obj.id === element.card?.cardPrice
        );
        if (instance) {
          price = instance?.onSale ? instance.salePrice : instance.sellPrice;
          cardPrice = <p>Card: {instance.size} </p>;
        }
        cardSize = <p>Paper: {PAPER_SIZE_LABEL[element.card?.paperSize]}</p>;
      }
      const totalPrice = price * element.quantity;
      let defaultImage: string;
      let altText: string;
      let swatchItem: IBasketSwatchItems;
      let productLink = `/product/${element?.product?.sku}`;
      if (element.swatchProduct) {
        swatchItem = element.product?.swatch?.items.find(
          (obj) => obj.product === element.swatchProduct
        );
        if (swatchItem) {
          defaultImage = swatchItem.altImage;
          altText = swatchItem.swatchText;
          productLink += `?swatch=${element.swatchProduct}`;
        }
      }
      let personalisationImageItem: IPersonalisationImageItem;
      if (element.personalisationImageSwatch) {
        personalisationImageItem =
          element.product?.personalisationImage?.items.find(
            (obj) => obj._id === element.personalisationImageSwatch
          );
        if (personalisationImageItem) {
          defaultImage = personalisationImageItem.displayImage;
          altText = personalisationImageItem.swatchName;
          productLink += `?personalisationImage=${element.personalisationImageSwatch}`;
        }
      }
      if (
        !defaultImage &&
        element.product.images &&
        element.product.images.length > 0
      ) {
        const image = element.product.images.find((image) => image.isDefault);
        defaultImage = image ? image.image : element.product.images[0].image;
        altText = image ? image.altText : element.product.images[0].altText;
      }
      let personalzationFields: any = "";
      element.product.personalisationFields
      // console.log('element.personalisationFields',element.personalisationFields);
      // console.log(element.swatchProduct);
      if (element.personalisationFields.length > 0) {
        personalzationFields = element.personalisationFields.map((field) => {
          const selectedField = element.product.personalisationFields?.find(
            (obj) => obj._id === field.id
          );
          return (
            <p key={field.id}>
              {selectedField?.promptText} : {field?.value}
            </p>
          );
        });
      }

      if (width < 768) {
        return (
          <div className="m-basket-item">
            <div className="image">
              <img src={defaultImage} alt={altText} />
            </div>
            <div className="no-margin item-details">
              <Link href={productLink}>
                <a>{element?.product?.name}</a>
              </Link>
              <p className="pricing">{toCurrencyFormat(totalPrice)}</p>
              {/* <p className="text-uppercase">SKU: {element?.product?.sku}</p> */}
              {swatchItem && (
                <p>
                  {element.product?.swatch?.name} - {swatchItem?.swatchText}
                </p>
              )}
              {personalisationImageItem && (
                <p>
                  {element.product?.personalisationImage?.name} -{" "}
                  {personalisationImageItem.swatchName} [
                  {personalisationImageItem.swatchCode}]
                </p>
              )}
              {personalzationFields}
              {cardPrice}
              {cardSize}
              <div className="quantity">
                <div className="main">
                  <button
                    className="down_count basket-btn"
                    aria-label="Increase"
                    onClick={() => {
                      if (element.quantity === 1) {
                        onRemove(element._id);
                        return;
                      }
                      element.quantity =
                        element.quantity > 1 ? element.quantity - 1 : 1;
                      productList[index] = element;
                      setProductList([...productList]);
                      updateBasket({
                        basketId: element._id,
                        quantity: element.quantity,
                      });
                    }}
                  >
                    <FontAwesomeIcon
                      icon={element.quantity === 1 ? faTrash : faMinus}
                    />
                  </button>
                  <input
                    className="counter"
                    type="text"
                    value={element.quantity}
                    readOnly={true}
                  />
                  <button
                    className="up_count basket-btn"
                    aria-label="Decrease"
                    onClick={() => {
                      element.quantity = element.quantity + 1;
                      productList[index] = element;
                      setProductList([...productList]);
                      updateBasket({
                        basketId: element._id,
                        quantity: element.quantity,
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                {/* <div
                  className="cart-remove"
                  onClick={() => onRemove(element._id)}
                >
                  <p>Remove</p>
                </div> */}
              </div>
            </div>
          </div>
        );
      }
      return (
        <tr key={element._id}>
          <th>
            <div className="product-cart">
              <div className="product-cart-img">
                <img src={defaultImage} alt={altText} />
              </div>
              <div className="product-cart-name">
                <Link href={productLink}>
                  <a>
                    <h3>{element?.product?.name}</h3>
                  </a>
                </Link>
                {/* <span className="text-uppercase">
                  SKU: {element?.product?.sku}
                </span> */}
                {swatchItem && (
                  <p>
                    {element.product?.swatch?.name} - {swatchItem?.swatchText}
                  </p>
                )}
                {personalisationImageItem && (
                  <p>
                    {element.product?.personalisationImage?.name} -{" "}
                    {personalisationImageItem.swatchName} [
                    {personalisationImageItem.swatchCode}]
                  </p>
                )}
                {personalzationFields}
                {cardPrice}
                {cardSize}
              </div>
            </div>
          </th>
          <td style={{ width: "125px" }}>
            <div className="quantity">
              <div className="main">
                <button
                  className="down_count basket-btn"
                  aria-label="Increase"
                  onClick={() => {
                    if (element.quantity === 1) {
                      onRemove(element._id);
                      return;
                    }
                    element.quantity =
                      element.quantity > 1 ? element.quantity - 1 : 1;
                    productList[index] = element;
                    setProductList([...productList]);
                    updateBasket({
                      basketId: element._id,
                      quantity: element.quantity,
                    });
                  }}
                >
                  <FontAwesomeIcon
                    icon={element.quantity === 1 ? faTrash : faMinus}
                  />
                </button>
                <input
                  className="counter"
                  type="text"
                  value={element.quantity}
                  readOnly={true}
                />
                <button
                  className="up_count basket-btn"
                  aria-label="Decrease"
                  onClick={() => {
                    element.quantity = element.quantity + 1;
                    productList[index] = element;
                    setProductList([...productList]);
                    updateBasket({
                      basketId: element._id,
                      quantity: element.quantity,
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
            {/* <div className="cart-remove" onClick={() => onRemove(element._id)}>
              <p>Remove</p>
            </div> */}
          </td>
          <td className="f-w-600 text-right">{toCurrencyFormat(price)}</td>
          <td className="f-w-600 text-right">{toCurrencyFormat(totalPrice)}</td>
        </tr>
      );
    });
  }

  return (
    <>
      <div className="breadcrumbs">
        <div className="container">
          <ul>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li>Basket</li>
          </ul>
        </div>
      </div>
      <div className="container">
        {productList.length === 0 ? (
          <div className="row">
            <div className="col-lg-12">
              <EmptyBasket />
            </div>
          </div>
        ) : (
          <div className="cart">
            <div className="row">
              <div className="col-lg-8">
                <div className="cart-title">
                  <h2>Basket</h2>
                </div>
                {width < 768 ? (
                  <div className="m-basket">{listItems}</div>
                ) : (
                  <div className="table-responsive cart-main">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Product Details</th>
                          <th className="text-center">Quantity</th>
                          <th className="text-right">Price</th>
                          <th className="text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>{listItems}</tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="col-lg-4">
                <div className="cart-order">
                  <h4>Order Summary</h4>
                  {productList.map((element, index) => {
                    let price = element?.product?.pricing?.onSale
                      ? element?.product?.pricing?.grossSalePrice
                      : element?.product?.pricing?.grossSellPrice;
                    if (element?.product?.productType === "5") {
                      const instance = cardPriceList.find(
                        (obj) => obj.id === element.card?.cardPrice
                      );
                      if (instance) {
                        price = instance?.onSale
                          ? instance.salePrice
                          : instance.sellPrice;
                      }
                    }
                    const totalPrice = price * element.quantity;
                    let swatchText: string;
                    if (element.swatchProduct) {
                      swatchText = element?.product?.swatch?.name;
                    }
                    return (
                      <div
                        className="d-flex justify-content-between"
                        key={index}
                      >
                        <span>
                          {element?.product?.name}
                          {swatchText && ` - ${swatchText}`}
                        </span>
                        <span>{toCurrencyFormat(totalPrice)}</span>
                      </div>
                    );
                  })}
                  {/* <div className="form-group mt-4">
                    <label>Shipping</label>
                    <Select
                      className="select-control"
                      isSearchable={false}
                      // isDisabled={true}
                      options={deliveryTypeList}
                      styles={{
                        menu: (base) => ({
                          ...base,
                          fontSize: 14,
                        }),
                      }}
                      value={deliveryTypeList.find(
                        (o) => o.value === selectedDeliveryType?.value
                      )}
                      // isClearable={true}
                      onChange={(e) => setSelectedDeliveryType(e)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Promo Code</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value || "")}
                    />
                  </div> */}
                  <div className="cart-bottom d-flex justify-content-between">
                    <span>Total Cost</span>
                    <span>{toCurrencyFormat(totalAmount)}</span>
                  </div>
                  <Link
                    href={
                      isAuthenticated
                        ? "/basket/checkout"
                        : `/sign-in?next=/basket/checkout`
                    }
                  >
                    <button className="btn btn-primary btn-block checkout-btn">
                      Checkout
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        {productList.length > 0 && relatedProducts.length > 0 && (
          <div className="product-related">
            <div className="container">
              <div className="title-main mt-4">
                <h2 className="text-center mb-4">Related Products</h2>
              </div>
              <div className="season-main">
                <div className="row">
                  {width < 768 ? (
                    <Slider
                      infinite={true}
                      swipeToSlide={true}
                      arrows={false}
                      focusOnSelect={true}
                      lazyLoad={true}
                      slidesToShow={2}
                      slidesToScroll={1}
                    >
                      {relatedProducts.map((element: IProduct) => {
                        return (
                          <ProductThumbnailView
                            product={element}
                            key={element?.id}
                          />
                        );
                      })}
                    </Slider>
                  ) : (
                    relatedProducts.map((product) => {
                      return (
                        <ProductThumbnailView
                          product={product}
                          key={product?.id}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let product = [];
  let linkedProducts = [];
  let deliveryList = [];
  const token = req?.cookies[TOKEN_KEY] || Cookies.get(TOKEN_KEY);
  if (token) {
    try {
      const { data, linkedProduct } = await axios
        .get(
          `${API_URL}/basket?linkedProducts=${true}`,
          setAuthHeader(null, token)
        )
        .then((response) => response.data || []);
      product = data;
      linkedProducts = linkedProduct;
    } catch (e: any) {
      if (e.response.status === 401) {
        return {
          redirect: { permanent: false, destination: `/sign-in?next=/basket` },
        };
      }
      return { redirect: { permanent: false, destination: `/` } };
    }
  }
  try {
    const { data } = await axios
      .get(`${API_URL}/home/delivery`)
      .then((res) => res.data || []);
    deliveryList = data.map((obj) => {
      obj.value = obj.id;
      obj.label = `${obj.method} ${
        obj.price ? `(+ ${toCurrencyFormat(obj.price)})` : ""
      }`;
      return obj;
    });
  } catch (e) {
    console.log(e);
  }
  return { props: { product, linkedProduct: linkedProducts, deliveryList } };
};

export default Basket;

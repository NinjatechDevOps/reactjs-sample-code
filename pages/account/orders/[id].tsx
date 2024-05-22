import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";

import axios from "axios";
import Cookies from "js-cookie";

import AccountSidenav from "../../../components/account/AccountSidenav";
import { API_URL, PAPER_SIZE_LABEL, TOKEN_KEY } from "../../../config/constant";
import { setAuthHeader, toCurrencyFormat } from "../../../config/utils";
import {
  IOrder,
  IPersonalisationImageItem,
  ISwatchItems,
} from "../../../models";

type Props = {
  order: IOrder;
  stripeDetails: any;
};

const OrderDetails = ({ order, stripeDetails }: Props) => {
  return (
    <>
      <div className="container">
        <div className="breadcrumbs">
          <ul>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li className="text-capitalize">Account</li>
          </ul>
        </div>
      </div>
      <div className="container account">
        <h4 className="f-w-600 mt-4 mb-4 m-none">My Account</h4>
        <div className="row m-0">
          <div className="col-lg-3 sidenav m-none">
            <AccountSidenav />
          </div>
          <div className="col-lg-9 order-detail">
            <div className="title-text mb-5">Orders Details</div>
            <div className="order-detail-box">
              <div className="order-address justify-content-lg-between">
                <div className="no-margin">
                  <h5 className="mb-4">Delivery Address</h5>
                  <p>
                    {order?.address?.firstName + " " + order?.address?.lastName}
                  </p>
                  <p>{order?.address?.addressLine1}</p>
                  {order?.address?.addressLine2 && (
                    <p>{order?.address?.addressLine2}</p>
                  )}
                  {order?.address?.addressLine3 && (
                    <p>{order?.address?.addressLine3}</p>
                  )}
                  <p>{order?.address?.city}</p>
                  <p>{order?.address?.postalCode}</p>
                </div>
                <div className="no-margin">
                  <h5 className="mb-4">Delivery Details</h5>
                  <p className="mb-0">{order?.deliveryType?.method}</p>
                  <p className="mb-0">{order?.deliveryType?.description}</p>
                </div>
                <div className="no-margin">
                  <h5 className="mb-4">Payment Details</h5>
                  <p className="mb-0">Mastercard </p>
                  <p className="mb-0">(************{stripeDetails?.last4}) </p>
                </div>
              </div>
              <hr className="mt-3 mb-3" />
              {order.products.map((obj) => {
                let defaultImage: string;
                let altText: string;
                let swatchText: string = "";
                let productLink = `/product/${obj?.product?.sku}`;
                let swatchItem: ISwatchItems;
                if (obj.swatchProduct) {
                  swatchItem = obj.product?.swatch?.items.find(
                    (element) => element.product === obj.swatchProduct
                  );
                  if (swatchItem) {
                    defaultImage = swatchItem.altImage;
                    altText = swatchItem.swatchText;
                    swatchText = swatchItem.swatchText;
                    productLink += `?swatch=${obj.swatchProduct}`;
                  }
                }
                let personalisationImageItem: IPersonalisationImageItem;
                if (obj.personalisationImageSwatch) {
                  personalisationImageItem =
                    obj.product?.personalisationImage?.items.find(
                      (element) =>
                        element._id === obj.personalisationImageSwatch
                    );
                  if (personalisationImageItem) {
                    defaultImage = personalisationImageItem.displayImage;
                    altText = personalisationImageItem.swatchName;
                    productLink += `?personalisationImage=${obj.personalisationImageSwatch}`;
                  }
                }
                let personalzationFields: any = "";
                if (obj.personalisationFields.length > 0) {
                  personalzationFields = obj.personalisationFields.map(
                    (field) => {
                      const selectedField =
                        obj.product.personalisationFields.find(
                          (element) => element._id === field.id
                        );
                      return (
                        <p>
                          {selectedField?.promptText} : {field.value}
                        </p>
                      );
                    }
                  );
                }
                if (
                  !defaultImage &&
                  obj.product.images &&
                  obj.product.images.length > 0
                ) {
                  const image = obj.product.images.find(
                    (image) => image.isDefault
                  );
                  defaultImage = image
                    ? image.image
                    : obj.product.images[0].image;
                  altText = image
                    ? image.altText
                    : obj.product.images[0].altText;
                }
                let paperSize: any;
                let cardPrice: any;
                if (obj.product.productType === "5") {
                  cardPrice = <p>Card: {obj.card?.cardPrice?.size} </p>;
                  paperSize = (
                    <p>Paper: {PAPER_SIZE_LABEL[obj.card?.paperSize]}</p>
                  );
                }
                return (
                  <React.Fragment key={obj.product.id}>
                    <div className="ordered-items">
                      <div className="prdouct-img">
                        <img src={defaultImage} alt={altText} />
                      </div>
                      <div className="colm-right">
                        <Link href={productLink}>
                          <a>
                            <h6 className="text-primary name">
                              {obj.product.name}
                            </h6>
                          </a>
                        </Link>
                        {/* <p className="text-uppercase">
                            SKU: {obj.product.sku}
                          </p> */}
                        <div className="price">
                          {toCurrencyFormat(obj.purchasedPrice)}
                        </div>
                        <p className="qty">Quantity: {obj.quantity}</p>
                        {swatchItem && (
                          <p>
                            {obj.product?.swatch?.name} -{" "}
                            {swatchItem?.swatchText}
                          </p>
                        )}
                        {personalisationImageItem && (
                          <p>
                            {obj.product?.personalisationImage?.name} -{" "}
                            {personalisationImageItem.swatchName} [
                            {personalisationImageItem.swatchCode}]
                          </p>
                        )}
                        {personalzationFields}
                        {cardPrice}
                        {paperSize}
                      </div>
                    </div>
                    <hr />
                  </React.Fragment>
                );
              })}
              {order.discount?.promoCode && (
                <div className="ordered-items">
                  <h6>
                    PromoCode
                    <span className="text-muted">
                      ({order.discount?.promoCode?.promoCode})
                    </span>
                  </h6>
                  {order.discount?.amount > 0 ? (
                    <h6>-{toCurrencyFormat(order.discount?.amount)}</h6>
                  ) : (
                    "-"
                  )}
                </div>
              )}
              <div className="ordered-items">
                <h6>Delivery</h6>
                <h6>
                  {order.deliveryType
                    ? toCurrencyFormat(order.deliveryType?.price || 0)
                    : "-"}
                </h6>
              </div>
              <div className="ordered-items">
                <h6>Total</h6>
                <h6>{toCurrencyFormat(order.totleAmount)}</h6>
              </div>
            </div>
            <div className="text-center mt-2">
              <Link href="/account/orders">
                <a className="btn btn-primary">Go Back</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const token = req?.cookies[TOKEN_KEY] || Cookies.get(TOKEN_KEY);
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: `/sign-in?next=/account/orders`,
      },
    };
  }
  try {
    const { data, stripeDetails } = await axios
      .get(`${API_URL}/orders/${params.id}`, setAuthHeader(null, token))
      .then((response) => response.data || []);
    return { props: { order: data, stripeDetails } };
  } catch (e: any) {
    if (e.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: `/sign-in?next=/basket/checkout`,
        },
      };
    }
    return { redirect: { permanent: false, destination: `/account/orders` } };
  }
};
export default OrderDetails;

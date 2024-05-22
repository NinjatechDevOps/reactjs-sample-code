import { GetServerSideProps } from "next";
import Link from "next/link";
import { API_URL, PAPER_SIZE_LABEL, TOKEN_KEY } from "../../../config/constant";

import axios from "axios";
import Cookies from "js-cookie";
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

const Confirmation = ({ order, stripeDetails }: Props) => {
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
            <li>
              <Link href="/basket">
                <a>Basket</a>
              </Link>
            </li>
            <li className="text-capitalize">Confirmation</li>
          </ul>
        </div>
      </div>
      <div className="confirmation">
        <div className="container">
          <div className="confirmation-info">
            <div className="row">
              <div className="col-lg-4">
                <div className="confirmation-box">
                  <span>Order # {order?.orderNumber}</span>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="f-w-600 f-22">
                  We've Received Your Order. Thank You!
                </div>
              </div>
              <div className="col-lg-3">
                <div className="confirmation-placed text-center">
                  <span>
                    Placed on {new Date(order?.createdAt).toDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="confirmation-details">
            <div className="row">
              <div className="col-lg-4">
                <div className="confirmation-text">
                  <h3>Shipping Address</h3>
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
              </div>
              <div className="col-lg-4">
                <div className="confirmation-text">
                  <h3>Delivery Method</h3>
                  <p>{order?.deliveryType?.method}</p>
                  <p>{order?.deliveryType?.description}</p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="confirmation-text">
                  <h3>Payment Method</h3>
                  <p>Mastercard</p>
                  <p>(************{stripeDetails?.last4})</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="confirmation-order-summary">
        <h2>Order Summary</h2>
        <div className="table-resposive cart-main">
          <table className="table">
            <tbody>
              {order.products.map((obj) => {
                let defaultImage: string;
                let altText: string;
                if (obj.product.images && obj.product.images.length > 0) {
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
                if (!defaultImage) defaultImage = "images/product_image_1.jpg";
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
                let paperSize: any;
                let cardPrice: any;
                if (obj.product.productType === "5") {
                  cardPrice = <p>Card: {obj.card?.cardPrice?.size} </p>;
                  paperSize = (
                    <p>Paper: {PAPER_SIZE_LABEL[obj.card?.paperSize]}</p>
                  );
                }
                return (
                  <tr key={obj.product.id}>
                    <th>
                      <div className="product-cart">
                        <div className="product-cart-img">
                          <img src={defaultImage} alt={altText} />
                        </div>
                        <div className="product-cart-name">
                          <Link href={productLink}>
                            <a>
                              <h3 className="text-primary">
                                {obj.product.name}
                              </h3>
                            </a>
                          </Link>
                          {/* <p className="text-uppercase">
                            SKU: {obj.product.sku}
                          </p> */}
                          <p>Quantity: {obj.quantity}</p>
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
                    </th>
                    <td className="text-right">
                      <span>{toCurrencyFormat(obj.purchasedPrice)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              {order.discount?.promoCode && (
                <tr>
                  <th>
                    PromoCode
                    <span className="text-muted">
                      ({order.discount?.promoCode?.promoCode})
                    </span>
                  </th>
                  {order.discount?.amount > 0 && (
                    <td>-{toCurrencyFormat(order.discount?.amount)}</td>
                  )}
                </tr>
              )}
              <tr>
                <th>Delivery</th>
                <td>
                  {order.deliveryType
                    ? toCurrencyFormat(order.deliveryType?.price)
                    : "-"}
                </td>
              </tr>
              <tr>
                <th>Total</th>
                <td>{toCurrencyFormat(order.totleAmount)}</td>
              </tr>
            </tfoot>
          </table>
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
export default Confirmation;

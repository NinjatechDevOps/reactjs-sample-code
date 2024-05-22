import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import Cookies from "js-cookie";
import Select from "react-select";

import AddressList from "../../components/address/AddressList";
import { CheckoutHeader } from "../../components/checkout/CheckoutHeader";
import PaymentList from "../../components/payment/PaymentList";
import { API_URL, DELIVERY_KEY, TOKEN_KEY } from "../../config/constant";
import { setAuthHeader, toCurrencyFormat } from "../../config/utils";
import { IBasket, ICardPrice, IDelivery, IInitialState } from "../../models";
import { PURGE_AUTH, SET_BASKET_PRODUCT } from "../../store/actions";

type Props = {
  product: IBasket[];
  deliveryList: IDelivery[];
};

const Checkout = ({ product, deliveryList }: Props) => {
  const router = useRouter();
  const addressRef = useRef(null);
  const paymentRef = useRef(null);
  const dispatch = useDispatch();
  const cardPriceList: ICardPrice[] = useSelector(
    (state: IInitialState) => state.cardPriceList
  );
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [totalProductPrice, setTotalProductPrice] = useState<number>(0);
  const [selectedAddress, setSelectedAddress] = useState<string>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>(null);
  const [totalSavedAddress, setTotalSavedAddress] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [promoCode, setPromoCode] = useState<string>("");
  const [selectedDeliveryType, setSelectedDeliveryType] =
    useState<IDelivery>(null);
  const [deliveryTypeList, setDeliveryTypeList] = useState<IDelivery[]>([]);
  const [showSubmitLoader, setShowSubmitLoader] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>(null);
  const [showPromocodeLoader, setShowPromocodeLoader] =
    useState<boolean>(false);
  const [promoCodeAmount, setPromoCodeAmount] = useState<number>(0);
  const [promoCodeError, setPromoCodeError] = useState<string>(null);
  const [isPromoCodeValid, setIsPromoCodeValid] = useState<boolean>(false);
  const [cardData, setCardData] = useState<any>({});
  const [isFreeDelivery, setIsFreeDelivery] = useState<boolean>(false);
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);

  useEffect(() => {
    let totalPrice = 0;
    const allProductTypes: any = [];
    product.forEach((element) => {
      allProductTypes.push(element.product.productType === "5" ? "3" : "2");
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
      totalPrice += price * element.quantity;
    });
    setTotalProductPrice(totalPrice);
    let availabelDelivery = [];
    // console.log("isFreeDelivery", isFreeDelivery);
    if (!isFreeDelivery) {
      const selectedProductType = allProductTypes.filter(
        (v, i, a) => a.indexOf(v) === i
      );
      if (selectedProductType.length === 1) {
        availabelDelivery = deliveryList.filter(
          (obj) =>
            obj.type === selectedProductType[0] ||
            (totalPrice > obj.minimumAmount && obj.type === "1")
        );
      } else {
        availabelDelivery = deliveryList.filter(
          (obj) =>
            obj.type === "2" ||
            (totalPrice >= obj.minimumAmount && obj.type === "1")
        );
      }
      setDeliveryTypeList(availabelDelivery);
    }
    setTotalAmount(totalPrice || 0);
    if (availabelDelivery.length > 0) {
      const defaultDelivery = availabelDelivery.find((obj) => obj.isDefault);
      setSelectedDeliveryType(defaultDelivery);
      setTotalAmount(totalPrice + defaultDelivery?.price || 0);
    }
  }, [product, isFreeDelivery]);

  useEffect(() => {
    if (selectedDeliveryType) {
      setTotalAmount(totalProductPrice + selectedDeliveryType?.price || 0);
      return;
    }
    setTotalAmount(totalProductPrice);
  }, [selectedDeliveryType]);

  useEffect(() => {
    const price = totalProductPrice + selectedDeliveryType?.price || 0;
    setTotalAmount(price - promoCodeAmount);
  }, [promoCodeAmount]);

  useEffect(() => {
    if (selectedAddress) {
      setErrorText(null);
    }
  }, [selectedAddress]);

  const onMakePayment = async () => {
    if (showSubmitLoader) return;
    if (!selectedPaymentMethod && !paymentRef.current.getShowPaymentForm()) {
      setErrorText("Please select a saved card");
      return;
    }
    if (
      paymentRef.current.getShowPaymentForm() &&
      Object.keys(cardData).length === 0
    ) {
      setErrorText("Please enter a new card details");
      return;
    }
    const payload = {
      address: selectedAddress,
      deliveryType: selectedDeliveryType?.id,
      paymentMethod: selectedPaymentMethod,
      promoCode: promoCode,
      ...cardData,
    };
    setShowSubmitLoader(true);
    setErrorText(null);
    try {
      const { data, orderStatus } = await axios
        .post(`${API_URL}/orders`, payload, setAuthHeader())
        .then((res) => res.data);
      localStorage.removeItem(DELIVERY_KEY);
      if (orderStatus === "succeeded") {
        dispatch({
          type: SET_BASKET_PRODUCT,
          value: [],
        });
        router.push(`/basket/confirmation/${data?.orderNumber}`);
      } else if (
        orderStatus === "requires_action" ||
        orderStatus === "requires_source_action"
      ) {
        if (data?.next_action?.type === "redirect_to_url") {
          window.location = data?.next_action?.redirect_to_url?.url;
        }
      }
    } catch (e) {
      if (e.response.status === 401) {
        dispatch({ type: PURGE_AUTH });
        router.push(`/sign-in?next=${window.location.pathname}`);
      }
      const { data } = e.response;
      setErrorText(data?.message);
    } finally {
      setShowSubmitLoader(false);
    }
  };

  const onCheckPromoCode = async (promoCode) => {
    setPromoCodeAmount(0);
    setIsPromoCodeValid(false);
    setPromoCodeError(null);
    setIsFreeDelivery(false);
    if (!promoCode) {
      return;
    }
    setShowPromocodeLoader(true);
    try {
      const { promoCodeAmount, freeShipping } = await axios
        .post(`${API_URL}/promocode`, { promoCode }, setAuthHeader())
        .then((res) => res.data);
      if (freeShipping) {
        setSelectedDeliveryType(null);
        setIsFreeDelivery(true);
      } else {
        setPromoCodeAmount(Number(promoCodeAmount));
      }
      setIsPromoCodeValid(true);
    } catch ({ response }) {
      console.log(response);
      setPromoCodeAmount(0);
      setPromoCodeError(response?.data?.error);
    } finally {
      setShowPromocodeLoader(false);
    }
  };

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
            <li className="text-capitalize">Checkout</li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="checkout">
          <div className="row">
            <div className="col-lg-7">
              <div className="cart-title">
                <h2>Checkout</h2>
              </div>
              <div className="stepwizard">
                <CheckoutHeader
                  currentStep={currentStep}
                  onChangeStep={(value: number) => setCurrentStep(value)}
                />
              </div>
              {errorText && (
                <p className="alert alert-danger mt-3">{errorText} </p>
              )}
              {currentStep === 1 ? (
                <AddressList
                  ref={addressRef}
                  onChangeStep={(e) => {
                    setSelectedAddress(e);
                  }}
                  savedAddress={selectedAddress}
                  setAddressCount={(e) => setTotalSavedAddress(e)}
                  onShowAddressForm={(e) => {
                    setShowAddressForm(e);
                    setErrorText(null);
                  }}
                />
              ) : (
                <PaymentList
                  ref={paymentRef}
                  onSelectPayment={(e) => setSelectedPaymentMethod(e)}
                  onSaveCard={(e) => setCardData(e)}
                />
              )}
            </div>
            <div className="col-lg-5">
              <div className="cart-order">
                <h4>Order Summary</h4>
                <div className="order-summary">
                  <table className="table">
                    <tbody>
                      {product.map((element, index) => {
                        let price = element?.product?.pricing?.onSale
                          ? element?.product?.pricing?.grossSalePrice
                          : element?.product?.pricing?.grossSellPrice;
                        if (element?.product.productType === "5") {
                          const instance = cardPriceList.find(
                            (obj) => obj.id === element?.card?.cardPrice
                          );
                          if (instance) {
                            price = instance?.onSale
                              ? instance.salePrice
                              : instance.sellPrice;
                          }
                        }
                        const totalPrice = price * element.quantity;
                        return (
                          <tr key={index}>
                            <th>{element?.product?.name}</th>
                            <td className="text-right">
                              {toCurrencyFormat(totalPrice)}
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <th>Shipping</th>
                      </tr>
                      <tr>
                        <th colSpan={2}>
                          <Select
                            className="select-control"
                            isSearchable={false}
                            isDisabled={currentStep === 2}
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
                        </th>
                      </tr>
                      {currentStep === 2 && (
                        <>
                          <tr>
                            <th>Promo Code</th>
                          </tr>
                          <tr>
                            <th colSpan={2} className="pb-3">
                              <input
                                type="text"
                                className={`form-control ${
                                  promoCodeError ? "is-invalid" : ""
                                }${isPromoCodeValid ? "is-valid" : ""}`}
                                placeholder="Enter Code"
                                value={promoCode}
                                onChange={(e) => {
                                  setPromoCode(e.target?.value || "");
                                  onCheckPromoCode(e.target?.value || "");
                                }}
                              />
                              {isPromoCodeValid && (
                                <div className="valid-feedback">
                                  Promo Code Applied successfull
                                </div>
                              )}
                              {promoCodeError && (
                                <div className="invalid-feedback">
                                  {promoCodeError}
                                </div>
                              )}
                            </th>
                          </tr>
                        </>
                      )}
                      <tr>
                        <th className="f-w-600">Total Cost</th>
                        <td className="text-right f-w-600">
                          {toCurrencyFormat(totalAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="row">
                  <div className="col-6">
                    {currentStep === 1 ? (
                      showAddressForm ? (
                        <button
                          className="btn btn-outline-primary btn-block"
                          onClick={() => {
                            addressRef.current?.onChangeAddressForm();
                            setErrorText(null);
                            return;
                          }}
                        >
                          Back
                        </button>
                      ) : (
                        <Link href="/basket">
                          <a className=" btn btn-outline-primary btn-block">
                            Back
                          </a>
                        </Link>
                      )
                    ) : (
                      <button
                        className="btn btn-outline-primary btn-block"
                        onClick={() => {
                          setErrorText(null);
                          if (paymentRef.current.getShowPaymentForm()) {
                            paymentRef.current.onChangePaymentForm();
                            return;
                          }
                          setCurrentStep(1);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  <div className="col-6">
                    {currentStep === 1 ? (
                      <button
                        className="no-margin btn btn-primary btn-block"
                        onClick={() => {
                          if (!selectedAddress) {
                            setErrorText(
                              totalSavedAddress === 0
                                ? "Please add a delivery address"
                                : "Please select a delivery address"
                            );
                            return;
                          }
                          setErrorText(null);
                          setCurrentStep(2);
                          document
                            .getElementById("message-ribbon")
                            .scrollIntoView();
                        }}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        className="no-margin btn btn-primary btn-block"
                        onClick={() => onMakePayment()}
                      >
                        {showSubmitLoader ? "Processing..." : "Make Payment"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req?.cookies[TOKEN_KEY] || Cookies.get(TOKEN_KEY);
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: `/sign-in?next=/basket/checkout`,
      },
    };
  }
  let product = [];
  let deliveryList = [];
  try {
    const { data } = await axios
      .get(`${API_URL}/basket`, setAuthHeader(null, token))
      .then((response) => response.data || []);
    if (data && data.length === 0) {
      return { redirect: { permanent: false, destination: `/basket` } };
    }
    const response = await axios
      .get(`${API_URL}/home/delivery`)
      .then((res) => res.data || []);
    deliveryList = response.data.map((obj) => {
      obj.value = obj.id;
      obj.label = `${obj.method} ${
        obj.price ? `(+ ${toCurrencyFormat(obj.price)})` : ""
      }`;
      return obj;
    });
    return { props: { product: data || [], deliveryList } };
  } catch (e: any) {
    if (e.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: `/sign-in?next=/basket/checkout`,
        },
      };
    }
    return { redirect: { permanent: false, destination: `/` } };
  }
};

export default Checkout;

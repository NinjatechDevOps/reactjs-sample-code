import { GetServerSideProps } from "next";
import Link from "next/link";

import axios from "axios";
import Cookies from "js-cookie";

import AccountSidenav from "../../../components/account/AccountSidenav";
import { API_URL, TOKEN_KEY } from "../../../config/constant";
import { setAuthHeader, toCurrencyFormat } from "../../../config/utils";
import { IOrder } from "../../../models";

type Props = {
  orders: IOrder[];
};

const MyOrders = ({ orders }: Props) => {
  let listItems: any;
  if (!orders || orders.length === 0) {
    listItems = <div className="text-center text-primary">No Orders Found</div>;
  } else {
    listItems = orders.map((order) => {
      const totalQunatity = order.products.reduce(function (acc, element) {
        return acc + element.quantity;
      }, 0);
      return (
        <div className="order-box" key={order.id}>
          <div className="no-margin">
            <h6 className="mb-0 order-id">Order #{order.orderNumber}</h6>
            <p className="mb-0 f-16 order-price-item">
              {toCurrencyFormat(order.totleAmount)} for{" "}
              {totalQunatity} {totalQunatity === 1 ? "item" : "items"}
            </p>
            <p className="f-12 delivery-date">
              Delivered on {new Date(order?.createdAt).toDateString()}
            </p>
          </div>
          <div>
            <Link href={`/account/orders/${order.orderNumber}`}>
              <a className="btn btn-primary">View Order Details</a>
            </Link>
          </div>
        </div>
      );
    });
  }
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
          <div className="col-lg-9 order mt-3 mt-lg-0">
            <div className="title-text mb-4 mb-md-5">My Orders</div>
            {listItems}
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
        destination: `/sign-in?next=/account/orders`,
      },
    };
  }
  try {
    const { data } = await axios
      .get(`${API_URL}/orders`, setAuthHeader(null, token))
      .then((response) => response.data || []);
    return { props: { orders: data } };
  } catch (e: any) {
    if (e.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: `/sign-in?next=/account/orders`,
        },
      };
    }
    return { redirect: { permanent: false, destination: `/account/orders` } };
  }
};

export default MyOrders;

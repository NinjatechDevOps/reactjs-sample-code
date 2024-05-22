import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import Cookies from "js-cookie";
import { TOKEN_KEY } from "../../config/constant";

const AccountSidenav: React.FC = () => {
  const router = useRouter();

  const onSignOut = () => {
    Cookies.remove(TOKEN_KEY);
    router.push("/");
  };

  return (
    <>
      <div
        className={`item${
          router.pathname === "/account/profile" ? " active" : ""
        }`}
      >
        <Link href="/account/profile">
          <a>
            <img src="/images/account/profile.svg" alt="Profile" />
            <span>My Details</span>
          </a>
        </Link>
      </div>
      <div
        className={`item${
          router.pathname.startsWith("/account/orders") ? " active" : ""
        }`}
      >
        <Link href="/account/orders">
          <a>
            <img src="/images/account/orders.svg" alt="Orders" />
            <span>My Orders</span>
          </a>
        </Link>
      </div>
      <div
        className={`item${
          router.pathname === "/account/cards" ? " active" : ""
        }`}
      >
        <Link href="/account/cards">
          <a>
            <img src="/images/account/cards.svg" alt="Payment Cards" />
            <span>Payment Cards</span>
          </a>
        </Link>
      </div>
      <div
        className={`item${
          router.pathname === "/account/address" ? " active" : ""
        }`}
      >
        <Link href="/account/address">
          <a>
            <img src="/images/account/address.svg" alt="Address Book" />
            <span>Address Book</span>
          </a>
        </Link>
      </div>
      <div
        className={`item${
          router.pathname === "/account/reminders" ? " active" : ""
        }`}
      >
        <Link href="/account/reminders">
          <a>
            <img src="/images/account/reminder.svg" alt="Reminders" />
            <span>My Reminders</span>
          </a>
        </Link>
      </div>
      <div className="item">
        <a onClick={() => onSignOut()}>
          <img src="/images/account/sign-out.svg" alt="Sign Out" />
          <span>Sign Out</span>
        </a>
      </div>
    </>
  );
};

export default AccountSidenav;

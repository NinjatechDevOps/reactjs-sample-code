import Link from "next/link";

import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import AccountSidenav from "../../components/account/AccountSidenav";
import { EditProfileForm } from "../../components/account/EditProfileForm";

import { IInitialState, IUser } from "../../models";
import { API_URL } from "../../config/constant";

export default function Account() {
  const currentUser: IUser = useSelector(
    (state: IInitialState) => state.currentUser
  );
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const onResetPassword = async () => {
    setShowLoader(true);
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, {
        email: currentUser.email,
      });
    } finally {
      setShowLoader(false);
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
          <div className="col-lg-9 detail mt-3 mt-lg-0">
            <div className="title-text">My Details</div>
            <EditProfileForm />
            <h4 className="text-center mt-4 f-w-600 sub-title">
              Reset Password
            </h4>
            <p className="mt-4 text-center pw-reset-text">
              If you need to reset your password, we'll send you an email
              containing a link to reset it.
            </p>
            <div className="text-center mt-4">
              <button
                type="button"
                className="btn btn-primary"
                disabled={showLoader}
                onClick={onResetPassword}
              >
                {showLoader ? "Sending an Email..." : "Request Reset Email"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

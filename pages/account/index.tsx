import Link from "next/link";

import { useSelector } from "react-redux";

import AccountSidenav from "../../components/account/AccountSidenav";
import { IInitialState, IUser } from "../../models";

export default function Account() {
  const currentUser: IUser = useSelector(
    (state: IInitialState) => state.currentUser
  );

  return (
    <>
      <div className="container">
        <div className="breadcrumbs m-none">
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
        <div className="mobile-title-block pt-4 pb-4">
          <h3 className="m-title f-w-600">Hi {currentUser?.firstName}!</h3>
          <p className="subtext">Welcome to your account</p>
        </div>
        <div className="row m-0">
          <div className="col-lg-3 sidenav">
            <AccountSidenav />
          </div>
        </div>
      </div>
    </>
  );
}

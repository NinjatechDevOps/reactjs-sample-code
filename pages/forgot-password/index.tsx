import Link from "next/link";
import React, { useState } from "react";
import { ForgotPasswordForm } from "../../components/auth/ForgotPasswordForm";
import { ForgotPasswordMessage } from "../../components/auth/ForgotPasswordMessage";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>(null);

  return (
    <React.Fragment>
      <div className="breadcrumbs">
        <div className="container">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>Forgot Password</li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="sign-in forgot-pass">
          <div className="sign-in-box" style={{ height: "auto" }}>
            <div className="forgot-img mb-4 mt-3 mt-md-4 pb-2">
              <img src="/images/forgot-pass-img.svg" alt="Forgot Password" />
            </div>
            {email ? (
              <ForgotPasswordMessage email={email} />
            ) : (
              <ForgotPasswordForm onShowMessage={(e) => setEmail(e)} />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ForgotPassword;

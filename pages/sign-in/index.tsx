import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { LoginForm } from "../../components/auth/LoginForm";

const SignIn = () => {
  const router = useRouter();
  const titleText: string =
    router.query && router.query["next"] ? "Sign In to Continue" : "Sign In";

  return (
    <React.Fragment>
      <div className="breadcrumbs">
        <div className="container">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>Sign In</li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="sign-in">
          <div className="sign-in-box">
            <h4 className="text-center">{titleText}</h4>
            <LoginForm />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignIn;

import Link from "next/link";
import React from "react";
import { RegsitrationForm } from "../../components/auth/RegsitrationForm";

const Index = () => {
  return (
    <React.Fragment>
      <div className="breadcrumbs">
        <div className="container">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <a href="#">Basket</a>
            </li>
            <li>Create Account</li>
          </ul>
        </div>
      </div>
      <div className="container">
        <RegsitrationForm />
      </div>
    </React.Fragment>
  );
};
export default Index;

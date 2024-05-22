import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import axios from "axios";

import { ResetPasswordForm } from "../../components/auth/ResetPasswordForm";
import { API_URL } from "../../config/constant";
import { GetServerSideProps } from "next";

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;
  console.log(token);
  return (
    <React.Fragment>
      <div className="breadcrumbs">
        <div className="container">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>Reset Password</li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="sign-in">
          <div className="sign-in-box" style={{ height: "auto" }}>
            <h4 className="text-center">Reset Password</h4>
            <ResetPasswordForm token={token} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { token } = params;
  try {
    const response = await axios.get(`${API_URL}/auth/reset-password/${token}`);
  } catch (e: any) {
    return {
      redirect: {
        permanent: false,
        destination: `/link-expired`,
      },
    };
  }
  return {
    props: {},
  };
};
export default ResetPassword;

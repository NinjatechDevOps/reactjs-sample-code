import Link from "next/link";
import React, { useState } from "react";

import { Formik } from "formik";
import * as Yup from "yup";

import { IForgotPassword } from "../../models";
import axios from "axios";
import { API_URL } from "../../config/constant";

export const ForgotPasswordForm = ({ onShowMessage }) => {
  const initialValues: IForgotPassword = { email: "" };
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);
  const [showSubmitLoader, setSubmitLoader] = useState<boolean>(false);

  const onSubmit = async (data: IForgotPassword) => {
    setSubmitLoader(true);
    try {
      const response: any = await axios.post(
        `${API_URL}/auth/forgot-password`,
        data
      );
      setErrorText(response.data.message);
      setIsErrorMessage(false);
      // setTimeout(() => {
      //   router.push(router.query.next ? String(router.query.next) : "/");
      // }, 2000);
      onShowMessage(data.email);
    } catch (e: any) {
      const message = e.response?.data?.message;
      setErrorText(message);
      setIsErrorMessage(true);
    } finally {
      setSubmitLoader(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        onSubmit(values);
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .required("Please Enter Email")
          .email("Please Enter valid email"),
      })}
    >
      {(props) => {
        const { values, errors, touched, handleChange, handleSubmit } = props;
        return (
          <>
            <form onSubmit={handleSubmit}>
              <h4 className="text-center mb-4 pb-2 block-title">
                Forgot your Password?
              </h4>
              <div className="text-center mb-5">
                Not to worry, it happens! Enter your email address below and
                we'll send you a link to reset it.
              </div>
              {errorText && (
                <div
                  className={`alert ${
                    isErrorMessage ? "alert-danger" : "alert-success"
                  } fade show`}
                  role="alert"
                >
                  {errorText}
                </div>
              )}
              <div className="form-group">
                <label className="mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  className={`form-control ${
                    touched.email && errors.email ? "is-invalid" : ""
                  }`}
                  onChange={handleChange}
                />
                {touched.email && errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              <button
                className="btn btn-primary forgot-pass-btn btn-block mt-4 mb-4"
                type="submit"
                disabled={showSubmitLoader}
              >
                {showSubmitLoader ? "Loading..." : "Send Email"}
              </button>
              <div className="text-center mb-3">
                <Link href="/sign-in">
                  <a className="text-primary f-w-500">Sign In</a>
                </Link>
              </div>
            </form>
          </>
        );
      }}
    </Formik>
  );
};

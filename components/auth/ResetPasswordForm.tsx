import React, { useState } from "react";

import { Formik } from "formik";
import * as Yup from "yup";

import { IResetPassword } from "../../models";
import axios from "axios";
import { API_URL } from "../../config/constant";
import { useRouter } from "next/router";
import Link from "next/link";

export const ResetPasswordForm = ({ token }) => {
  const router = useRouter();
  const initialValues: IResetPassword = { password: "", confirmPassword: "" };
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);
  const [showSubmitLoader, setSubmitLoader] = useState<boolean>(false);

  const onSubmit = async (data: IResetPassword) => {
    setSubmitLoader(true);
    try {
      const response: any = await axios.post(
        `${API_URL}/auth/reset-password/${token}`,
        data
      );
      setErrorText(response.data.message);
      setIsErrorMessage(false);
      setTimeout(() => {
        router.push("/sign-in");
      }, 5000);
    } catch (e: any) {
      if (e.response.status === 400) {
        router.push("/link-expired");
      }
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
        password: Yup.string()
          .required("Please Enter Pssword")
          .min(6, "Password must contains at least 6 characters"),
        confirmPassword: Yup.string()
          .required("Please Enter Confirm Password")
          .oneOf([Yup.ref("password"), null], "Passwords do not match"),
      })}
    >
      {(props) => {
        const { values, errors, touched, handleChange, handleSubmit } = props;
        return (
          <>
            <form onSubmit={handleSubmit}>
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
                <label className="mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  className={`form-control ${
                    touched.password && errors.password ? "is-invalid" : ""
                  }`}
                  onChange={handleChange}
                />
                {touched.password && errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
              <div className="form-group">
                <label className="mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  className={`form-control ${
                    touched.confirmPassword && errors.confirmPassword
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={handleChange}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
              <button
                className="btn btn-primary sign-in-button btn-block mt-5 mb-4"
                type="submit"
                disabled={showSubmitLoader}
              >
                {showSubmitLoader ? "Loading..." : "Reset Password"}
              </button>
              <div className="text-center">
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

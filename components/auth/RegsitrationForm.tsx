import { useRouter } from "next/router";
import Link from "next/link";

import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";

import { IRegister } from "../../models/auth";
import { API_URL, BASKET_ITEMS, TOKEN_KEY } from "../../config/constant";
import { SET_AUTH } from "../../store/actions";
import { setAuthHeader } from "../../config/utils";
import { IBasket } from "../../models";

export const RegsitrationForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const initialValues: IRegister = {
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  };
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);
  const [showSubmitLoader, setSubmitLoader] = useState<boolean>(false);

  const onSubmit = async (values: IRegister) => {
    setSubmitLoader(true);
    try {
      const { token, user, message }: any = await axios
        .post(`${API_URL}/auth/signup`, values)
        .then((res) => res.data);
      setErrorText(message);
      setIsErrorMessage(false);
      dispatch({ type: SET_AUTH, value: user });
      Cookies.set(TOKEN_KEY, token.token, { expires: 2 });
      let basketData: any = localStorage.getItem(BASKET_ITEMS);
      basketData = JSON.parse(basketData || "{}");
      if (basketData.length > 0) {
        const data = basketData.map((element: IBasket) => {
          const data: any = {
            product: element.product.id,
            quantity: element.quantity,
            personalisationFields: element.personalisationFields.map(
              ({ id, value }) => {
                return { id, value };
              }
            ),
            swatchProduct: element.swatchProduct,
            personalisationImageSwatch: element.personalisationImageSwatch,
          };
          if (element.card) {
            data.card = element.card;
          }
          return data;
        });
        try {
          await axios.put(
            `${API_URL}/basket`,
            data,
            setAuthHeader(null, token.token)
          );
          localStorage.removeItem(BASKET_ITEMS);
          router.push(`${router.query.next || "/"}`);
        } catch (e) {
          router.push(`${router.query.next || "/"}`);
        }
      } else {
        router.push(`${router.query.next || "/"}`);
      }
    } catch (e: any) {
      // console.log(e);
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
        firstName: Yup.string().required("Please Enter First Name"),
        lastName: Yup.string().required("Please Enter Last Name"),
        email: Yup.string()
          .required("Please Enter Email")
          .email("Please Enter valid email"),
        confirmEmail: Yup.string()
          .required("Please Enter Confirm Email")
          .email("Please Enter valid email")
          .oneOf(
            [Yup.ref("email"), null],
            "Confirm Email must be same as Email"
          ),
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
            <div className="register">
              <div className="register-box">
                <h4 className="text-center">Create Account</h4>
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
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={values.firstName}
                          className={`form-control ${
                            touched.firstName && errors.firstName
                              ? "is-invalid"
                              : ""
                          }`}
                          onChange={handleChange}
                        />
                        {touched.firstName && errors.firstName && (
                          <div className="invalid-feedback">
                            {errors.firstName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={values.lastName}
                          className={`form-control ${
                            touched.lastName && errors.lastName
                              ? "is-invalid"
                              : ""
                          }`}
                          onChange={handleChange}
                        />
                        {touched.lastName && errors.lastName && (
                          <div className="invalid-feedback">
                            {errors.lastName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Email Address</label>
                        <input
                          type="text"
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
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Confirm Email Address</label>
                        <input
                          type="text"
                          name="confirmEmail"
                          value={values.confirmEmail}
                          className={`form-control ${
                            touched.confirmEmail && errors.confirmEmail
                              ? "is-invalid"
                              : ""
                          }`}
                          onChange={handleChange}
                        />
                        {touched.confirmEmail && errors.confirmEmail && (
                          <div className="invalid-feedback">
                            {errors.confirmEmail}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Password</label>
                        <div className="col-xs-10">
                          <input
                            type="password"
                            name="password"
                            value={values.password}
                            className={`form-control ${
                              touched.password && errors.password
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={handleChange}
                          />
                          {touched.password && errors.password && (
                            <div className="invalid-feedback">
                              {errors.password}
                            </div>
                          )}
                          <small className="text-muted">
                            Must be a minimum of 6 characters long.
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Confirm Password</label>
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
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={showSubmitLoader}
                    >
                      {showSubmitLoader ? "Loading..." : "CREATE ACCOUNT"}
                    </button>
                    <p className="help-text">
                      By proceeding, you are confirming that you agree to our
                      Terms and Conditions and Privacy Policy.
                    </p>
                  </div>
                  <div className="text-center">
                    <Link href="/sign-in">
                      <a className="text-primary f-w-500">Sign In</a>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </>
        );
      }}
    </Formik>
  );
};

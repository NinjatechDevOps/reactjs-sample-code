import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { useRouter } from "next/router";
import Link from "next/link";

import { Formik } from "formik";
import * as Yup from "yup";

import axios from "axios";
import Cookies from "js-cookie";
import { IBasket, ILogin } from "../../models";
import { API_URL, BASKET_ITEMS, TOKEN_KEY } from "../../config/constant";
import { SET_AUTH } from "../../store/actions";
import { setAuthHeader } from "../../config/utils";

export const LoginForm = () => {
  const router = useRouter();
  const initialValues: ILogin = {
    email: "",
    password: "",
    rememberMe: false,
  };
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);
  const [showSubmitLoader, setSubmitLoader] = useState<boolean>(false);
  const dispatch = useDispatch();

  const onSubmit = async (formData: ILogin) => {
    setSubmitLoader(true);
    try {
      const { message, token, user }: any = await axios
        .post(`${API_URL}/auth/login`, formData)
        .then((res) => res.data);
      setIsErrorMessage(false);
      setErrorText(message);
      dispatch({ type: SET_AUTH, value: user });
      Cookies.set(TOKEN_KEY, token.token, { expires: 2 });
      let basketData: any = localStorage.getItem(BASKET_ITEMS);
      // console.log(basket);
      if (basketData) {
        basketData = JSON.parse(basketData || "{}");
        if (basketData.length === 0) {
          router.push(`${router.query.next || "/"}`);
        }
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
          router.push(`${router.query.next || "/"}`);
        } catch {
          router.push(`${router.query.next || "/"}`);
        } finally {
          localStorage.removeItem(BASKET_ITEMS);
        }
      } else {
        router.push(`${router.query.next || "/"}`);
      }
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
        password: Yup.string()
          .required("Please Enter Pssword")
          .min(6, "Password must contains at least 6 characters"),
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
              <div className="form-group">
                <label className="mb-1">Password</label>
                <small className="pull-right">
                  <Link href="/forgot-password">
                    <a className="text-primary f-w-500">Forgot Password?</a>
                  </Link>
                </small>
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
              <div className="form-group mb-4">
                <label className="form-checkbox-label text-muted">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    onClick={handleChange}
                  />
                  <span className="checkmark"></span>
                  Remember my login details
                </label>
              </div>
              {showSubmitLoader ? (
                <button
                  className="btn btn-primary btn-block"
                  type="submit"
                  disabled={true}
                >
                  Loading...
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-primary sign-in-button"
                    type="submit"
                    disabled={showSubmitLoader}
                  >
                    {showSubmitLoader ? "Loading..." : "Sign in"}
                  </button>
                  <span className="or-text">or</span>
                  <Link
                    href={
                      router.query.next &&
                      router.query.next.includes("checkout")
                        ? `/register?next=${router.query.next}`
                        : `/register`
                    }
                  >
                    <a className="btn btn-primary register-button">
                      Create Account
                    </a>
                  </Link>
                </>
              )}
              <p className="help-text">
                By proceeding, you are confirming that you agree to our Terms
                and Conditions and Privacy Policy.
              </p>
            </form>
          </>
        );
      }}
    </Formik>
  );
};

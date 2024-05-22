import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Formik } from "formik";
import * as Yup from "yup";

import axios from "axios";

import { API_URL } from "../../config/constant";

import { IEditProfileForm, IInitialState, IUser } from "../../models";
import { PURGE_AUTH, SET_AUTH } from "../../store/actions";
import { setAuthHeader } from "../../config/utils";

export const EditProfileForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser: IUser = useSelector(
    (state: IInitialState) => state.currentUser
  );
  const initialValues: IEditProfileForm = {
    firstName: currentUser?.firstName,
    lastName: currentUser?.lastName,
    email: currentUser?.email,
    confirmEmail: currentUser?.email,
  };
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);
  const [showSubmitLoader, setSubmitLoader] = useState<boolean>(false);

  const onSubmit = async (data: IEditProfileForm) => {
    setSubmitLoader(true);
    try {
      const response: any = await axios
        .put(`${API_URL}/auth/profile`, data, setAuthHeader())
        .then((response) => response.data);
      setErrorText(response.message);
      dispatch({ type: SET_AUTH, value: response.user });
      setIsErrorMessage(false);
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch({ type: PURGE_AUTH });
        router.push(`/sign-in?next=${window.location.pathname}`);
      }
      const message = e.response?.data?.message;
      setErrorText(message);
      setIsErrorMessage(true);
    } finally {
      setSubmitLoader(false);
      setTimeout(() => {
        setErrorText(null);
      }, 3000);
    }
  };

  if (!currentUser) return <></>;
  return (
    <>
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
        })}
      >
        {(props) => {
          const { values, errors, touched, handleChange, handleSubmit } = props;
          return (
            <>
              {errorText && (
                <div
                  className={`alert mt-3 mb-3 ${
                    isErrorMessage ? "alert-danger" : "alert-success"
                  } fade show`}
                  role="alert"
                >
                  {errorText}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="row mt-4">
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
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>Email Address</label>
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
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>Confirm Email Address</label>
                      <input
                        type="email"
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
                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={showSubmitLoader}
                  >
                    {showSubmitLoader ? "Loading..." : "Update"}
                  </button>
                </div>
              </form>
            </>
          );
        }}
      </Formik>
    </>
  );
};

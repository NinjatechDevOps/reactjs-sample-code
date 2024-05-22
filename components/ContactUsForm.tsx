import { useState } from "react";

import { Formik } from "formik";
import * as Yup from "yup";
import { validateMobileNumber } from "../config/utils";
import { IContactUs } from "../models";
import { API_URL } from "../config/constant";
import axios from "axios";

export const ContactUsForm = () => {
  const initialValues: IContactUs = {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    description: "",
  };
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);
  const [showSubmitLoader, setSubmitLoader] = useState<boolean>(false);

  const onSubmit = async (formData: IContactUs) => {
    setSubmitLoader(true);
    try {
      await axios.post(`${API_URL}/contact-us`, formData);
      setIsErrorMessage(false);
      setErrorText("Your Message has been saved, will reach you soon...");
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
      onSubmit={async (values, { resetForm }) => {
        onSubmit(values);
        resetForm();
      }}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().required("Please Enter First Name"),
        lastName: Yup.string().required("Please Enter Last Name"),
        description: Yup.string().required("Please Enter Your Message"),
        email: Yup.string()
          .required("Please Enter Email")
          .email("Please Enter valid email"),
        phone: Yup.string().required("Please Enter Phone Number"),
      })}
    >
      {(props) => {
        const { values, errors, touched, handleChange, handleSubmit } = props;
        return (
          <>
            {errorText && (
              <div
                className={`alert text-center ${
                  isErrorMessage ? "alert-danger" : "alert-success"
                } fade show`}
                role="alert"
              >
                {errorText}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-sm-6">
                  <input
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={values.firstName}
                    className={`form-control ${
                      touched.firstName && errors.firstName ? "is-invalid" : ""
                    }`}
                    onChange={handleChange}
                  />
                  {touched.firstName && errors.firstName && (
                    <div className="invalid-feedback">{errors.firstName}</div>
                  )}
                </div>
                <div className="col-sm-6 mt-3 mt-sm-0">
                  <input
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={values.lastName}
                    className={`form-control ${
                      touched.lastName && errors.lastName ? "is-invalid" : ""
                    }`}
                    onChange={handleChange}
                  />
                  {touched.lastName && errors.lastName && (
                    <div className="invalid-feedback">{errors.lastName}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <input
                    type="text"
                    placeholder="Email"
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
                <div className="col-sm-6 mt-3 mt-sm-0">
                  <input
                    type="text"
                    placeholder="Phone"
                    name="phone"
                    value={values.phone}
                    className={`form-control ${
                      touched.phone && errors.phone ? "is-invalid" : ""
                    }`}
                    onChange={handleChange}
                    onKeyDown={validateMobileNumber}
                  />
                  {touched.phone && errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <textarea
                    rows={9}
                    placeholder="Type your message here"
                    name="description"
                    value={values.description}
                    className={`form-control ${
                      touched.description && errors.description
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={handleChange}
                  />
                  {touched.description && errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <button type="submit" className="btn btn-primary btn-block">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </>
        );
      }}
    </Formik>
  );
};

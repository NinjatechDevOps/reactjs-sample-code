import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

import Select from "react-select";
import { Formik } from "formik";
import * as Yup from "yup";

import axios from "axios";

import { IAddress } from "../../models";
import { setAuthHeader } from "../../config/utils";
import { API_URL, GET_ADDRESS_KEY } from "../../config/constant";
import { PURGE_AUTH } from "../../store/actions";

export const AddressForm = ({ editAddress, onCancel, onCreateSuccess }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [enterManually, setEnterManually] = useState<Boolean>(
    editAddress ? true : false
  );
  const initialValues: IAddress = {
    firstName: editAddress?.firstName || "",
    lastName: editAddress?.lastName || "",
    addressLine1: editAddress?.addressLine1 || "",
    addressLine2: editAddress?.addressLine2 || "",
    addressLine3: editAddress?.addressLine3 || "",
    city: editAddress?.city || "",
    postalCode: editAddress?.postalCode || "",
  };
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);
  const [showSubmitLoader, setSubmitLoader] = useState<boolean>(false);
  const [showLookUpLoader, setLookUpLoader] = useState<boolean>(false);
  const [addressList, setAddressList] = useState<[]>([]);

  const onSubmit = async (data: IAddress) => {
    setSubmitLoader(true);
    const editId = editAddress?.id || null;
    data.addressLine2 = data.addressLine2 || null;
    data.addressLine3 = data.addressLine3 || null;
    try {
      let response: any = {};
      if (editId) {
        response = await axios
          .put(`${API_URL}/address/${editId}`, data, setAuthHeader())
          .then((r) => r.data);
      } else {
        response = await axios
          .post(`${API_URL}/address`, data, setAuthHeader())
          .then((r) => r.data);
      }
      setErrorText(response.message);
      setIsErrorMessage(false);
      onCreateSuccess(response.data?.id);
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch({ type: PURGE_AUTH });
        router.push(`/sign-in?next=${window.location.pathname}`);
      }
      const message = e.response.message;
      setErrorText(message);
      setIsErrorMessage(true);
    } finally {
      setSubmitLoader(false);
    }
  };

  const onLookup = async (postalCode: string, house: string = null) => {
    setLookUpLoader(true);
    let url = `https://api.getAddress.io/find/${postalCode}?api-key=${GET_ADDRESS_KEY}&sort=${true}`;
    if (house) {
      const value = house.split(" ")[0];
      url = `https://api.getAddress.io/find/${postalCode}/${value}?api-key=${GET_ADDRESS_KEY}&expand=${true}`;
    }
    try {
      const response: any = await axios.get(url).then((r) => r.data);
      if (house) {
        return response.addresses[0];
      }
      const address = response.addresses.map((obj: string) => {
        return { value: obj, label: obj };
      });
      setAddressList(address);
    } catch (e: any) {
      setAddressList([]);
    } finally {
      setLookUpLoader(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          onSubmit(values);
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().required("Please Enter First Name"),
          lastName: Yup.string().required("Please Enter last Name"),
          addressLine1: Yup.string().required("Please Enter Address Line1"),
          postalCode: Yup.string().required("Please Enter Postal Code"),
          city: Yup.string().required("Please Enter City"),
        })}
      >
        {(props) => {
          const {
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            setFieldValue,
          } = props;
          return (
            <>
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
              <form className="checkout-form" onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between">
                  {/* <h5 className="text-left">Delivery Address</h5> */}
                  {!enterManually && (
                    <h6
                      className="text-primary cursor-pointer"
                      onClick={onCancel}
                    >
                      Cancel
                    </h6>
                  )}
                </div>
                <div className=" mt-4">
                  <div className="row">
                    <div className="form-group col-lg-6">
                      <label className="control-label">First Name</label>
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
                    <div className="form-group col-lg-6">
                      <label className="control-label">Last Name</label>
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
                  {enterManually ? (
                    <>
                      <div className="row">
                        <div className="form-group col-lg-6">
                          <label className="control-label">
                            Address Line 1
                          </label>
                          <input
                            type="text"
                            name="addressLine1"
                            value={values.addressLine1}
                            className={`form-control ${
                              touched.addressLine1 && errors.addressLine1
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={handleChange}
                          />
                          {touched.addressLine1 && errors.addressLine1 && (
                            <div className="invalid-feedback">
                              {errors.addressLine1}
                            </div>
                          )}
                        </div>
                        <div className="form-group col-lg-6">
                          <label className="control-label">
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            name="addressLine2"
                            value={values.addressLine2}
                            className={`form-control ${
                              touched.addressLine2 && errors.addressLine2
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={handleChange}
                          />
                          {touched.addressLine2 && errors.addressLine2 && (
                            <div className="invalid-feedback">
                              {errors.addressLine2}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-lg-6">
                          <label className="control-label">
                            Address Line 3
                          </label>
                          <input
                            type="text"
                            name="addressLine3"
                            value={values.addressLine3}
                            className={`form-control ${
                              touched.addressLine3 && errors.addressLine3
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={handleChange}
                          />
                          {touched.addressLine3 && errors.addressLine3 && (
                            <div className="invalid-feedback">
                              {errors.addressLine3}
                            </div>
                          )}
                        </div>
                        <div className="form-group col-lg-6">
                          <label className="control-label">City / Town</label>
                          <input
                            type="text"
                            name="city"
                            value={values.city}
                            className={`form-control ${
                              touched.city && errors.city ? "is-invalid" : ""
                            }`}
                            onChange={handleChange}
                          />
                          {touched.city && errors.city && (
                            <div className="invalid-feedback">
                              {errors.city}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-lg-6">
                          <label className="control-label">Postcode</label>
                          <input
                            type="text"
                            name="postalCode"
                            value={values.postalCode}
                            className={`form-control ${
                              touched.postalCode && errors.postalCode
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={handleChange}
                          />
                          {touched.postalCode && errors.postalCode && (
                            <div className="invalid-feedback">
                              {errors.postalCode}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="add-btns">
                            <button
                              className="btn btn-outline-primary me-3"
                              onClick={onCancel}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn btn-primary submit-button"
                              type="submit"
                              disabled={showSubmitLoader}
                            >
                              {showSubmitLoader ? "Loading..." : "Save"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="row">
                            <div className="form-group col-lg-6">
                              <label className="control-label">Postcode</label>
                              <input
                                type="text"
                                name="postalCode"
                                value={values.postalCode}
                                className={`form-control ${
                                  touched.postalCode && errors.postalCode
                                    ? "is-invalid"
                                    : ""
                                }`}
                                onChange={handleChange}
                              />
                              {touched.postalCode && errors.postalCode && (
                                <div className="invalid-feedback">
                                  {errors.postalCode}
                                </div>
                              )}
                            </div>
                            <div className="form-group col-lg-6">
                              <label className="control-label">&nbsp;</label>
                              <button
                                className="btn btn-primary btn-block"
                                type="button"
                                disabled={
                                  !values.postalCode || showLookUpLoader
                                }
                                onClick={() => onLookup(values.postalCode)}
                              >
                                {showLookUpLoader ? "Loading.." : "Lookup"}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-lg-6">
                          <label className="control-label">&nbsp;</label>
                          <button
                            className="btn btn-outline-primary btn-block"
                            type="button"
                            onClick={() => setEnterManually(true)}
                          >
                            Enter Address Manually
                          </button>
                        </div>
                        {addressList.length > 0 && (
                          <div className="form-group col-lg-12">
                            <label className="control-label">&nbsp;</label>
                            <Select
                              className="select-control"
                              options={addressList}
                              onChange={async (e: any) => {
                                const response = await onLookup(
                                  values.postalCode,
                                  e.value
                                );
                                if (!response) return;
                                setFieldValue("addressLine1", response.line_1);
                                setFieldValue("addressLine2", response.line_2);
                                setFieldValue("addressLine3", response.line_3);
                                setFieldValue("city", response.town_or_city);
                                setEnterManually(true);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </form>
            </>
          );
        }}
      </Formik>
    </>
  );
};

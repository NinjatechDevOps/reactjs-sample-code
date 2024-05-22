import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import DatePicker from "react-datepicker";
import Select from "react-select";

import { API_URL } from "../../config/constant";

import { IReminderForm, IInitialState, IUser, IReminder } from "../../models";
import { PURGE_AUTH, SET_AUTH } from "../../store/actions";
import { setAuthHeader } from "../../config/utils";
import { ReminderList } from "./ReminderList";
type Props = {
  editInstance?: IReminder;
  onCancel: () => void;
  onSuccess: () => void;
};
export const ReminderForm = ({ editInstance, onCancel, onSuccess }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser: IUser = useSelector(
    (state: IInitialState) => state.currentUser
  );
  const [initialValues, setInitialValues] = useState<IReminderForm>({
    firstName: "",
    lastName: "",
    occassion: "",
    relation: "",
    date: "",
  });
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);
  const [isDateEditable, setIsDateEditable] = useState<boolean>(false);
  const [showReminderListLoader, setReminderListLoader] =
    useState<boolean>(false);
  const [showSubmitLoader, setSubmitLoader] = useState<boolean>(false);
  const [showFormAfterSave, setFormAfterSave] = useState<boolean>(false);
  const [relationsList, setRelationsList] = useState<Array<IReminder>>([]);
  const [occassionList, setOccassionList] = useState<Array<IReminder>>([]);
  const [reminderList, setReminderList] = useState<any>([]);
  const [editIndex, setEditIndex] = useState<number>(null);

  useEffect(() => {
    if (editInstance) {
      setInitialValues({
        firstName: editInstance.firstName,
        lastName: editInstance.lastName,
        occassion: editInstance.occassion?.id,
        relation: editInstance.relation?.id,
        date: new Date(
          `${new Date().getFullYear()}-${editInstance.month}-${
            editInstance.day
          }`
        ),
      });
    }
    getReminderList();
  }, []);

  const getReminderList = async () => {
    setReminderListLoader(true);
    try {
      const { data } = await axios
        .get(`${API_URL}/reminder-list`, setAuthHeader())
        .then((r) => r.data);
      // console.log("reminder-list data:", data);
      const relationData: IReminder[] = data.map((obj) => {
        obj.label = obj.name;
        obj.value = obj.id;
        return obj;
      });
      // console.log("relationData:", relationData);
      setOccassionList(relationData.filter((obj) => obj.type === "1"));
      setRelationsList(relationData.filter((obj) => obj.type === "2"));
    } catch (e: any) {
      console.log(e);
    } finally {
      setReminderListLoader(false);
    }
  };

  const onSubmit = async (data: any) => {
    data.relation = data.relation || null;
    data.occassion = data.occassion || null;
    data.day = new Date(data.date).getDate();
    data.month = new Date(data.date).getMonth() + 1;
    if (editInstance) {
      try {
        setSubmitLoader(true);
        const response: any = await axios
          .put(`${API_URL}/reminder/${editInstance.id}`, data, setAuthHeader())
          .then((r) => r.data);
        setErrorText(response.message);
        setIsErrorMessage(false);
        onSuccess();
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
    } else {
      setIsDateEditable(false);
      setSubmitLoader(true);
      try {
        const response: any = await axios
          .post(`${API_URL}/reminder`, data, setAuthHeader())
          .then((r) => r.data);
        if (!showFormAfterSave) {
          onSuccess();
        } else {
          if (Number.isInteger(editIndex)) {
            reminderList[editIndex] = data;
            setReminderList([...reminderList]);
            setEditIndex(null);
            return;
          }
          reminderList.push(data);
          setReminderList(reminderList);
        }
      } catch (e: any) {
        // console.log(e);
        if (e.response.status === 401) {
          dispatch({ type: PURGE_AUTH });
          router.push(`/sign-in?next=${window.location.pathname}`);
        }
        const message = e.response.message;
        setErrorText(message);
        setIsErrorMessage(true);
      } finally {
        setInitialValues({
          firstName: "",
          lastName: "",
          occassion: "",
          relation: "",
          date: "",
        });
        setSubmitLoader(false);
        setFormAfterSave(false);
      }
    }
  };

  const addMultiple = async () => {
    if (reminderList.length === 0) {
      return;
    }
    setSubmitLoader(true);
    try {
      const response: any = await axios
        .post(`${API_URL}/reminder`, reminderList, setAuthHeader())
        .then((r) => r.data);
      setErrorText(response.message);
      setIsErrorMessage(false);
      onSuccess();
    } catch (e: any) {
      // console.log(e);
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

  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={async (values, { resetForm }) => {
          onSubmit(values);
          resetForm();
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().required("Please Enter First Name"),
          lastName: Yup.string().required("Please Enter Last Name"),
          occassion: Yup.string().required("Please Select Occassion"),
          relation: Yup.string().required("Please Select Relation"),
          date: Yup.string().required("Please Select Date"),
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
                  className={`alert mt-3 mb-3 ${
                    isErrorMessage ? "alert-danger" : "alert-success"
                  } fade show`}
                  role="alert"
                >
                  {errorText}
                </div>
              )}
              {reminderList.length > 0 && (
                <div className="row m-0">
                  <div className="col-lg-12 reminders p-0 mb-3">
                    {reminderList.map((element: any, index: number) => {
                      return (
                        <ReminderList
                          occassionList={occassionList}
                          relationsList={relationsList}
                          element={{ ...element }}
                          key={index}
                          isAdd={true}
                          onDelete={() => {
                            reminderList.splice(index, 1);
                            setReminderList([...reminderList]);
                          }}
                          onEdit={() => {
                            setEditIndex(index);
                            setInitialValues({
                              firstName: element.firstName,
                              lastName: element.lastName,
                              occassion: element.occassion,
                              relation: element.relation,
                              date: new Date(element.date),
                            });
                          }}
                        />
                      );
                    })}
                  </div>
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
                      <label>They are my</label>
                      <Select
                        isLoading={showReminderListLoader}
                        className={`select-control ${
                          touched.relation && errors.relation
                            ? "is-invalid"
                            : ""
                        } `}
                        placeholder="Select Relationship"
                        options={relationsList}
                        onChange={(e: any) =>
                          setFieldValue("relation", e?.value)
                        }
                        value={
                          relationsList.find(
                            (o) => o?.value === values.relation
                          ) || null
                        }
                      />
                      {touched.relation && errors.relation && (
                        <div className="invalid-feedback">
                          {errors.relation}
                        </div>
                      )}
                    </div>
                    {touched.relation && errors.relation && (
                      <div className="invalid-feedback">{errors.relation}</div>
                    )}
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>Occassion</label>
                      <Select
                        isLoading={showReminderListLoader}
                        className={`select-control ${
                          touched.occassion && errors.occassion
                            ? "is-invalid"
                            : ""
                        } `}
                        placeholder="Select Occassion"
                        options={occassionList}
                        onChange={(e: any) => {
                          if (e?.month && e?.day) {
                            const date = new Date(
                              `${new Date().getFullYear()}-${e.month}-${e.day}`
                            );
                            setFieldValue("date", date);
                            setIsDateEditable(true);
                          }
                          setFieldValue("occassion", e?.value);
                        }}
                        value={
                          occassionList.find(
                            (o) => o.value === values.occassion
                          ) || null
                        }
                      />
                      {touched.occassion && errors.occassion && (
                        <div className="invalid-feedback">
                          {errors.occassion}
                        </div>
                      )}
                    </div>
                    {touched.occassion && errors.occassion && (
                      <div className="invalid-feedback">{errors.occassion}</div>
                    )}
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>Date</label>
                      {/* onChange={(date) => setStartDate(date)} */}
                      <DatePicker
                        disabled={isDateEditable}
                        selected={values.date}
                        className={`form-control ${
                          touched.date && errors.date ? "is-invalid" : ""
                        }`}
                        onChange={(date) => setFieldValue("date", date)}
                        dateFormat="dd MMMM"
                      />
                      {touched.date && errors.date && (
                        <p
                          className="text-danger"
                          style={{ fontSize: "0.875em" }}
                        >
                          {errors.date}
                        </p>
                      )}
                    </div>
                  </div>
                  {!editInstance && (
                    <div className="col-lg-6">
                      <div className="form-group">
                        <div className="d-flex justify-content-between mt-4 reminder-button">
                          <button
                            type="submit"
                            className="btn btn-block btn-outline-primary"
                            onClick={() => setFormAfterSave(true)}
                          >
                            Add Another Reminder
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="d-flex justify-content-between mt-4 reminder-button">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => onCancel()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={showSubmitLoader}
                    onClick={() => setFormAfterSave(false)}
                  >
                    {showSubmitLoader ? "Loading..." : "Save"}
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

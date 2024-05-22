import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { API_URL, DAY_NAMES, MONTH_NAMES } from "../../config/constant";
import { setAuthHeader } from "../../config/utils";
import { PURGE_AUTH } from "../../store/actions";
import { ConfirmationModal } from "../ConfirmationModal";

export const ReminderList = ({
  element,
  occassionList,
  relationsList,
  isAdd,
  onDelete,
  onEdit,
  onDeleteSuccess,
}: any) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);

  const onDeleteRecord = async () => {
    try {
      await axios.delete(`${API_URL}/reminder/${element.id}`, setAuthHeader());
      onDeleteSuccess();
    } catch (e) {
      if (e.response.status === 401) {
        dispatch({ type: PURGE_AUTH });
        router.push(`/sign-in?next=${window.location.pathname}`);
      }
    } finally {
      setShowConfirmationModal(false);
    }
  };

  if (occassionList?.length > 0) {
    element.occassion = occassionList.find((e) => e.id === element.occassion);
  }
  if (relationsList?.length > 0) {
    element.relation = relationsList.find((e) => e.id === element.relation);
  }
  const date = new Date(
    `${new Date().getFullYear()}-${element.month}-${element.day}`
  );
  let link = "/product?";
  // console.log(element?.occassion?.category);
  if (element?.occassion?.category) {
    link += `&category=${element?.occassion?.category?.toString()}`;
  }
  let tags = "";
  if (element.occassion?.tags && element.occassion?.tags.length > 0) {
    tags += element.occassion?.tags.toString();
  }
  if (element.relation?.tags && element.relation?.tags.length > 0) {
    tags += element.relation?.tags.toString();
  }
  if (tags) {
    link += `&tag=${tags}`;
  }

  return (
    <>
      <div className="col-lg-12" key={element.id}>
        <div className="reminder-box row">
          <div className="col-md-7 reminder-title">
            <div className="calendar-icon">
            <img
                src="/images/calendar.svg"
                alt="calendar"
                className="calendar"
              />
              <span className="month">{MONTH_NAMES[element.month - 1]}</span>
              <span className="date">{element.day}</span>
              <span className="day"> {DAY_NAMES[date.getDay()]}</span>
            </div>
            <div className="calendar-right">
              <p className="f-w-500 pb-1 f-18 reminder-block-title">
                {element?.firstName + " " + element?.lastName}{" "}
                <span className="m-none">- </span>
                {/* {element?.occassion?.name} */}
                {element?.relation?.name}
              </p>
              <div className="d-flex reminder-block-icon align-items-center">
              <img
                src={element?.occassion?.icon}
                className="icon"
                alt="Reminder Icon"
              />
              <span>{element.occassion?.name}</span>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-12 mt-3 d-flex">
            {!isAdd && (
              <Link href={link}>
                <a className="btn btn-primary find-gift-btn">Find Gift</a>
              </Link>
            )}
          </div>
          <div className="col-md-2 col-sm-6 col-5 d-flex justify-content-end mt-3 mt-md-2 edit-del-btns">
            <FontAwesomeIcon
              icon={faPencilAlt}
              className="me-3 edit-btn"
              onClick={(e) => {
                e.preventDefault();
                onEdit();
              }}
            />
            <FontAwesomeIcon
              icon={faTrashAlt}
              onClick={(e) => {
                e.preventDefault();
                setShowConfirmationModal(true);
              }}
            />
          </div>
        </div>
      </div>

      {showConfirmationModal && (
        <ConfirmationModal
          show={showConfirmationModal}
          onCancel={() => setShowConfirmationModal(false)}
          onSuccess={() => {
            if (isAdd) {
              onDelete();
              setShowConfirmationModal(false);
              return;
            }
            onDeleteRecord();
          }}
        />
      )}
    </>
  );
};

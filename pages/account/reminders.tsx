import Link from "next/link";
import { useRouter } from "next/router";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import axios from "axios";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AccountSidenav from "../../components/account/AccountSidenav";
import { API_URL, DAY_NAMES, MONTH_NAMES } from "../../config/constant";
import { setAuthHeader } from "../../config/utils";
import { IReminder } from "../../models";
import { PURGE_AUTH } from "../../store/actions";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { ReminderForm } from "../../components/reminders/ReminderForm";
import { ReminderList } from "../../components/reminders/ReminderList";

const MyReminders = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showReminderForm, setShowReminderForm] = useState<boolean>(
    router.query?.add ? true : false
  );

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [reminderList, setReminderList] = useState<IReminder[]>([]);
  const [editReminderInstance, setEditReminderInstance] =
    useState<IReminder>(null);
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>(null);

  useEffect(() => {
    getList();
    // eslint-disable-next-line
  }, []);

  const getList = async () => {
    setShowLoader(true);
    try {
      const response: any = await axios
        .get(`${API_URL}/reminder`, setAuthHeader())
        .then((res) => res.data);
      setReminderList(response.data || []);
    } catch (e) {
      if (e.response.status === 401) {
        dispatch({ type: PURGE_AUTH });
        router.push(`/sign-in?next=${window.location.pathname}`);
      }
      setReminderList([]);
    } finally {
      setShowLoader(false);
    }
  };

  const onDeleteRecord = async () => {
    try {
      await axios.delete(`${API_URL}/reminder/${deleteId}`, setAuthHeader());
      getList();
    } catch (e) {
      if (e.response.status === 401) {
        dispatch({ type: PURGE_AUTH });
        router.push(`/sign-in?next=${window.location.pathname}`);
      }
    } finally {
      setShowLoader(false);
      setDeleteId(null);
      setShowConfirmationModal(false);
    }
  };

  let listItems: any;
  if (reminderList.length > 0) {
    listItems = reminderList.map((element: IReminder, index: number) => {
      return (
        <ReminderList
          element={element}
          key={index}
          onEdit={() => {
            setEditReminderInstance(element);
            setShowReminderForm(true);
          }}
          onDeleteSuccess={() => {
            setReminderList([
              ...reminderList.filter((e) => e.id !== element.id),
            ]);
          }}
        />
      );
    });
  } else {
    listItems = (
      <div className="col-lg-12">
        <div className="text-center text-primary mt-5">No Reminders Founds</div>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <div className="breadcrumbs">
          <ul>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li className="text-capitalize">Account</li>
          </ul>
        </div>
      </div>
      <div className="container account">
        <h4 className="f-w-600 mt-4 mb-4 m-none">My Account</h4>
        <div className="row  m-0">
          <div className="col-lg-3 sidenav m-none">
            <AccountSidenav />
          </div>
          <div className="col-lg-9 reminders mt-3 mt-lg-0">
            <div className="title-text">
              {!showReminderForm
                ? "My Reminders"
                : editReminderInstance
                ? "Edit Reminder"
                : "Add New Reminder"}
            </div>
            {!showReminderForm && (
              <div
                className="d-flex text-primary f-w-500 justify-content-end cursor-pointer m-none"
                onClick={() => setShowReminderForm(true)}
              >
                Add New Reminder
              </div>
            )}
            {showLoader ? (
              <div className="text-center text-primary mt-5">Loading...</div>
            ) : showReminderForm ? (
              <ReminderForm
                editInstance={editReminderInstance}
                onCancel={() => {
                  setEditReminderInstance(null);
                  setShowReminderForm(false);
                }}
                onSuccess={() => {
                  setShowReminderForm(false);
                  setEditReminderInstance(null);
                  getList();
                }}
              />
            ) : (
              <div className="row mt-3">{listItems}</div>
            )}
            {!showReminderForm && (
              <div className="col-lg-12 d-none mt-4">
                <button
                  onClick={() => setShowReminderForm(true)}
                  type="button"
                  className="btn btn-primary btn-block"
                >
                  Add New Reminder
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showConfirmationModal && (
        <ConfirmationModal
          show={showConfirmationModal}
          onCancel={() => setShowConfirmationModal(false)}
          onSuccess={() => onDeleteRecord()}
        />
      )}
    </>
  );
};

export default MyReminders;

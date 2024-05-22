import Link from "next/link";
import { useRouter } from "next/router";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import AccountSidenav from "../../components/account/AccountSidenav";

import axios from "axios";

import { API_URL, PAYMENT_CARD_IMAGE } from "../../config/constant";
import { setAuthHeader } from "../../config/utils";
import { PURGE_AUTH } from "../../store/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { PaymentForm } from "../../components/payment/PaymentForm";
import { ConfirmationModal } from "../../components/ConfirmationModal";

export default function MyCards() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [cardsList, setCardsList] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(
    false
  );
  const [deleteId, setDeleteId] = useState<string>(null);

  useEffect(() => {
    getList();
    // eslint-disable-next-line
  }, []);

  const getList = async () => {
    setShowLoader(true);
    try {
      const { data } = await axios
        .get(`${API_URL}/stripe/cards`, setAuthHeader())
        .then((res) => res.data);
      setCardsList(data);
    } catch (e) {
      if (e.response.status === 401) {
        dispatch({ type: PURGE_AUTH });
        router.push(`/sign-in?next=${window.location.pathname}`);
      }
      setCardsList([]);
    } finally {
      setShowLoader(false);
    }
  };

  const onDeleteRecord = async () => {
    try {
      await axios.delete(
        `${API_URL}/stripe/cards/${deleteId}`,
        setAuthHeader()
      );
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

  if (cardsList.length > 0) {
    listItems = cardsList.map((element) => {
      return (
        <div className="col-lg-6" key={element.id}>
          <div className="card-box active d-flex">
            <div className="p-2">
              <p className="m-0">**** **** **** {element.card.last4}</p>
              <p className="m-0">
                Expiry date {element.card.exp_month}/{element.card.exp_year}
              </p>
              <p>{element.card.name}</p>
            </div>
            <div className="ml-auto">
              <img
                width={45}
                height={35}
                src={
                  PAYMENT_CARD_IMAGE[String(element.card.brand).toLowerCase()]
                }
                alt={element.card.brand}
              />
              <div className="d-flex justify-content-end mt-2">
                {/* <FontAwesomeIcon
                  icon={faPencilAlt}
                  className="me-3"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPaymentForm(true);
                  }}
                /> */}
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteId(element.id);
                    setShowConfirmationModal(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    });
  } else {
    listItems = (
      <div className="col-lg-12">
        <div className="text-center text-primary mt-5">No Cards Founds</div>
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
        <div className="row m-0">
          <div className="col-lg-3 sidenav m-none">
            <AccountSidenav />
          </div>
          <div className="col-lg-9 cards mt-3 mt-lg-0">
            <div className="title-text">Payment Cards</div>
            {!showPaymentForm && (
              <div
                className="d-flex text-primary f-w-500 justify-content-end cursor-pointer m-none"
                onClick={() => setShowPaymentForm(true)}
              >
                Add New Card
              </div>
            )}
            {showLoader ? (
              <div className="text-center text-primary mt-5">Loading...</div>
            ) : showPaymentForm ? (
              <PaymentForm
                saveOnly={true}
                onCreate={() => {
                  setShowPaymentForm(false);
                  getList();
                }}
                onCancel={() => setShowPaymentForm(false)}
              />
            ) : (
              <div className="row">{listItems}</div>
            )}
            {!showPaymentForm && (
              <button
                className="btn btn-primary btn-block d-none"
                onClick={() => setShowPaymentForm(true)}
              >
                Add New Card
              </button>
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
}

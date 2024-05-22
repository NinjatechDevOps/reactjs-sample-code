import { useRouter } from "next/router";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useDispatch } from "react-redux";

import { PaymentForm } from "./PaymentForm";

import { API_URL } from "../../config/constant";
import axios from "axios";
import { setAuthHeader } from "../../config/utils";
import { PURGE_AUTH } from "../../store/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { ConfirmationModal } from "../ConfirmationModal";

type Props = {
  onSelectPayment: (e) => void;
  onSaveCard: (e) => void;
};

const PaymentList = forwardRef((props: Props, ref: any) => {
  const { onSelectPayment, onSaveCard } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [cardsList, setCardsList] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>(null);
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>(null);

  useEffect(() => {
    getList();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedPaymentMethod) {
      onSelectPayment(selectedPaymentMethod);
    }
  }, [selectedPaymentMethod]);

  useImperativeHandle(ref, () => ({
    onChangePaymentForm: () => {
      setShowPaymentForm(false);
    },
    getShowPaymentForm: () => {
      return showPaymentForm
    }
  }));

  const getList = async () => {
    setShowLoader(true);
    try {
      const response: any = await axios
        .get(`${API_URL}/stripe/cards`, setAuthHeader())
        .then((res) => res.data);
      setCardsList(response.data);
      if (response.data.length === 0) {
        setShowPaymentForm(true);
      }
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

  let listItems: any = (
    <div className="col-12">
      <p className="text-primary text-center mt-5">
        {showLoader ? "Loading..." : "No Cards Saved"}
      </p>
    </div>
  );

  if (cardsList.length > 0) {
    listItems = cardsList.map((element) => {
      return (
        <div
          className="col-lg-6"
          key={element.id}
          onClick={() => setSelectedPaymentMethod(element.id)}
        >
          <div
            className={`payment-box d-flex ${
              selectedPaymentMethod === element.id ? "active" : ""
            }`}
          >
            <div className="pe-2">
              <div className="radio">
                <input
                  name="radio"
                  id="radio1"
                  type="radio"
                  readOnly={true}
                  checked={selectedPaymentMethod === element.id}
                />
                <label htmlFor="radio1">&nbsp;</label>
              </div>
            </div>
            <div className="p-2 flex-grow-1">
              <p className="m-0">**** **** **** {element.card.last4}</p>
              <p className="m-0">
                Expiry date {element.card.exp_month}/{element.card.exp_year}
              </p>
              {/* <p>{element.card.name}</p> */}
            </div>
            <div className="ml-auto">
              <img
                width={45}
                height={45}
                src="/images/card/visa.svg"
                alt="Visa"
              />
              <div className="mt-auto">
                {/* <i className="mr-3 fa fa-pencil" /> */}
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  height={20}
                  className="text-primary pull-right"
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
  }

  return (
    <>
      <div className="payment">
        {showPaymentForm ? (
          // <Elements stripe={stripePromise}>
          <PaymentForm
            onCancel={() => setShowPaymentForm(false)}
            onSaveCard={(e) => onSaveCard(e)}
          />
        ) : (
          <>
            <div className="d-flex justify-content-between">
              <h6>Saved Cards</h6>
              <h6
                className="pull-right text-primary cursor-pointer"
                onClick={() => {
                  setSelectedPaymentMethod(null);
                  setShowPaymentForm(true);
                  onSelectPayment(null);
                }}
              >
                Add New Card
              </h6>
            </div>
            <div className="row">{listItems}</div>
            {/* <div className="payment-button">
              <button
                className="btn btn-outline-primary back-button"
                onClick={onChangeStep}
              >
                Back to Delivery
              </button>
              <button
                type="button"
                className="btn btn-primary next-button"
                onClick={() => makePayment()}
                disabled={showSubmitLoader}
              >
                {showSubmitLoader ? "Processing..." : "Make Payment"}
              </button>
            </div> */}
          </>
        )}
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
});

export default PaymentList;

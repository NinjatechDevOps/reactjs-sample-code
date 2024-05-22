import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  number as checkCardNumber,
  cvv as checkCVV,
  expirationDate,
} from "card-validator";

import CardLayout from "../CardLayout";
import { PURGE_AUTH } from "../../store/actions";
import { API_URL } from "../../config/constant";
import { setAuthHeader } from "../../config/utils";

type CardState = {
  cardNumber: string;
  cardHolder: string;
  cardMonth: string;
  cardYear: string;
  cardCvv: string;
};

type Props = {
  onCancel: any;
  onCreate?: any;
  saveOnly?: boolean;
  onSaveCard?: (e) => void;
};

export const PaymentForm = ({
  onCancel,
  onCreate,
  saveOnly,
  onSaveCard,
}: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [cardState, setCardState] = useState<CardState>();
  const [saveCard, setSaveCard] = useState<boolean>(false);
  const [showSubmitLoader, setShowSubmitLoader] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>(null);

  useEffect(() => {
    if (
      !checkCardNumber(cardState?.cardNumber).isValid ||
      !expirationDate(`${cardState?.cardMonth}/${cardState?.cardYear}`)
        .isValid ||
      !checkCVV(cardState?.cardCvv).isValid
    ) {
      return;
    }
    if (!saveOnly) {
      const payload = {
        saveCard: saveCard,
        name: cardState.cardHolder,
        card: {
          number: cardState.cardNumber.replace(/\s/g, ""),
          exp_year: cardState.cardYear,
          exp_month: cardState.cardMonth,
          cvc: cardState.cardCvv,
        },
      };
      onSaveCard(payload);
    }
  }, [cardState, saveCard]);

  const handleSubmit = async (event: any) => {
    setIsSubmitted(true);
    // if (error) {
    //   setErrorText(error.message);
    //   setShowSubmitLoader(false);
    //   return;
    // }
    if (
      !checkCardNumber(cardState?.cardNumber).isValid ||
      !expirationDate(`${cardState?.cardMonth}/${cardState?.cardYear}`)
        .isValid ||
      !checkCVV(cardState?.cardCvv).isValid
    ) {
      return;
    }
    setShowSubmitLoader(true);
    const payload = {
      name: cardState.cardHolder,
      card: {
        number: cardState.cardNumber.replace(/\s/g, ""),
        exp_year: cardState.cardYear,
        exp_month: cardState.cardMonth,
        cvc: cardState.cardCvv,
      },
    };
    try {
      await axios.post(`${API_URL}/stripe/cards`, payload, setAuthHeader());
      onCreate();
    } catch (e) {
      if (e.response.status === 401) {
        dispatch({ type: PURGE_AUTH });
        router.push(`/sign-in?next=${window.location.pathname}`);
      }
      setErrorText(e.response.message);
    } finally {
      setShowSubmitLoader(false);
    }
    return;
  };

  return (
    <div className="checkout-form payment">
      <div className="d-flex justify-content-between">
        <h5 className="text-left">Add Credit/Debit Card</h5>
      </div>
      <div className="row">
        <div className="col-lg-12 card-screen">
          <CardLayout
            onUpdateCard={(e) => setCardState(e)}
            isSubmitted={isSubmitted}
            errorText={errorText}
          />
        </div>
      </div>
      <div className="d-flex justify-content-center mt-4 mt-md-4 mb-4 mb-md-3">
        {!saveOnly ? (
          <div className="checkbox">
            <label className="form-checkbox-label text-muted m-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
              />
              <span className="checkmark"></span>
              Save card details
            </label>
          </div>
        ) : (
          <>
            <button
              className="btn btn-outline-primary back-button"
              onClick={() => onCancel()}
            >
              Back
            </button>
            <button
              className="btn btn-primary submit-button"
              type="button"
              onClick={handleSubmit}
            >
              {showSubmitLoader ? "Loading...." : "Save"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

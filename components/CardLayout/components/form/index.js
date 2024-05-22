import React, { useState } from "react";
import {
  number,
  cvv as checkCVV,
  expirationMonth,
  expirationYear,
  expirationDate,
} from "card-validator";

const currentYear = new Date().getFullYear();
const monthsArr = Array.from({ length: 12 }, (x, i) => {
  const month = i + 1;
  return month <= 9 ? "0" + month : month;
});
const yearsArr = Array.from({ length: 9 }, (_x, i) => currentYear + i);

export default function CForm({
  cardMonth,
  cardYear,
  onUpdateState,
  cardNumberRef,
  cardHolderRef,
  cardDateRef,
  onCardInputFocus,
  onCardInputBlur,
  cardCvv,
  children,
  isSubmitted,
  errorText,
}) {
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [currentField, setCurrentField] = useState("");
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    onUpdateState(name, value);
    if (name === "cardCvv") {
      setCvv(value);
    }
  };

  // TODO: We can improve the regex check with a better approach like in the card component.
  const onCardNumberChange = (event) => {
    let { value, name } = event.target;
    let cardNumber = value;
    value = value.replace(/\D/g, "");
    if (/^3[47]\d{0,13}$/.test(value)) {
      cardNumber = value
        .replace(/(\d{4})/, "$1 ")
        .replace(/(\d{4}) (\d{6})/, "$1 $2 ");
    } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(value)) {
      // diner's club, 14 digits
      cardNumber = value
        .replace(/(\d{4})/, "$1 ")
        .replace(/(\d{4}) (\d{6})/, "$1 $2 ");
    } else if (/^\d{0,16}$/.test(value)) {
      // regular cc number, 16 digits
      cardNumber = value
        .replace(/(\d{4})/, "$1 ")
        .replace(/(\d{4}) (\d{4})/, "$1 $2 ")
        .replace(/(\d{4}) (\d{4}) (\d{4})/, "$1 $2 $3 ");
    }

    setCardNumber(cardNumber.trimRight());
    onUpdateState(name, cardNumber);
  };

  const onCvvFocus = (event) => {
    onUpdateState("isCardFlipped", true);
  };

  const onCvvBlur = (event) => {
    onUpdateState("isCardFlipped", false);
  };

  const getErrorMessgae = (field) => {
    if (field === "cardNumber") {
      if (currentField === "cardNumber" && cardNumber?.length === 19) {
        return number(cardNumber)?.isValid ? "is-valid" : "is-invalid";
      } else if (
        isSubmitted ||
        (currentField !== "cardNumber" && cardNumber?.length > 1)
      ) {
        return number(cardNumber)?.isValid ? "is-valid" : "is-invalid";
      }
      return "";
    } else if (field === "cardCvv") {
      if (currentField === "cardCvv" && cvv?.length >= 3) {
        return checkCVV(cvv)?.isValid ? "is-valid" : "is-invalid";
      } else if (
        isSubmitted ||
        (currentField !== "cardCvv" && cvv?.length > 1)
      ) {
        return checkCVV(cvv)?.isValid ? "is-valid" : "is-invalid";
      }
      return "";
    } else if (field === "cardMonth") {
      if (currentField === "cardMonth") {
        return expirationMonth(cardMonth)?.isValid ? "is-valid" : "is-invalid";
      } else if (isSubmitted || (currentField !== "cardMonth" && cardMonth)) {
        if (cardYear && expirationMonth(cardMonth)?.isValid) {
          return expirationDate(`${cardMonth}/${cardYear}`)?.isValid
            ? "is-valid"
            : "is-invalid";
        }
        return expirationMonth(cardMonth)?.isValid ? "is-valid" : "is-invalid";
      }
      return "";
    } else if (field === "cardYear") {
      if (currentField === "cardYear") {
        return expirationYear(cardYear)?.isValid ? "is-valid" : "is-invalid";
      } else if (isSubmitted || (currentField !== "cardYear" && cardYear)) {
        return expirationYear(cardYear)?.isValid ? "is-valid" : "is-invalid";
      }
      return "";
    }
  };

  return (
    <div className="card-form">
      <div className="card-list">{children}</div>
      <div className="card-form__inner">
        {errorText && (
          <div className="text-danger text-center mb-3">{errorText}</div>
        )}

        <div className="card-input">
          <label htmlFor="cardName" className="card-input__label">
            Card Holder
          </label>
          <input
            type="text"
            className="form-control"
            autoComplete="off"
            name="cardHolder"
            onChange={handleFormChange}
            ref={cardHolderRef}
            onFocus={(e) => onCardInputFocus(e, "cardHolder")}
            onBlur={onCardInputBlur}
          />
        </div>

        <div className="card-input">
          <label htmlFor="cardNumber" className="card-input__label">
            Card Number
          </label>
          <input
            type="tel"
            name="cardNumber"
            className={`form-control ${getErrorMessgae("cardNumber")}`}
            autoComplete="off"
            onChange={onCardNumberChange}
            maxLength="19"
            ref={cardNumberRef}
            onFocus={(e) => {
              setCurrentField("cardNumber");
              onCardInputFocus(e, "cardNumber");
            }}
            onBlur={(e) => {
              onCardInputBlur(e);
              setCurrentField(null);
            }}
            value={cardNumber}
          />
        </div>

        <div className="card-form__row">
          <div className="card-form__col">
            <div className="card-form__group">
              <label htmlFor="cardMonth" className="card-input__label">
                Expiration Date
              </label>
              <select
                className={`form-control ${getErrorMessgae("cardMonth")}`}
                value={cardMonth}
                name="cardMonth"
                onChange={handleFormChange}
                ref={cardDateRef}
                onFocus={(e) => {
                  //   setCurrentField("cardDate");
                  onCardInputFocus(e, "cardDate");
                }}
                onBlur={(e) => {
                  onCardInputBlur(e);
                  //   setCurrentField(null);
                }}
              >
                <option value="" disabled>
                  Month
                </option>
                {monthsArr.map((val, index) => (
                  <option key={index} value={val}>
                    {val}
                  </option>
                ))}
              </select>
              <select
                name="cardYear"
                className={`form-control ${getErrorMessgae("cardYear")}`}
                value={cardYear}
                onChange={handleFormChange}
                onFocus={(e) => {
                  //   setCurrentField("cardYear");
                  onCardInputFocus(e, "cardYear");
                }}
                onBlur={(e) => {
                  onCardInputBlur(e);
                  //   setCurrentField(null);
                }}
              >
                <option value="" disabled>
                  Year
                </option>
                {yearsArr.map((val, index) => (
                  <option key={index} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="card-form__col -cvv">
            <div className="card-input">
              <label htmlFor="cardCvv" className="card-input__label">
                CVV
              </label>
              <input
                type="tel"
                className={`form-control ${getErrorMessgae("cardCvv")}`}
                maxLength="4"
                autoComplete="off"
                name="cardCvv"
                onChange={handleFormChange}
                onFocus={(e) => {
                  setCurrentField("cardCvv");
                  onCvvFocus(e);
                }}
                onBlur={(e) => {
                  onCvvBlur(e);
                  setCurrentField(null);
                }}
                ref={cardCvv}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

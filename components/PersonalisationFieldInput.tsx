import React, { useRef } from "react";

export const PersonalisationFieldInput = ({ element, isSubmitted, onSet }) => {
  const field: any = useRef(null);
  return (
    <div className="personalise-tab-content d-flex justify-content-between flex-wrap">
      <div className="personalise-box d-flex justify-content-between">
        <div className="form-group m-0">
          <input
            type="text"
            placeholder={element?.promptText}
            ref={field}
            id={element._id}
            maxLength={element?.maxChars || null}
            onChange={(e) => {
              element.value = e.target.value || "";
              onSet(element);
            }}
            className={
              isSubmitted &&
              ((element?.isRequired && !element?.value) ||
                (element?.maxChars &&
                  element?.value?.length > element?.maxChars))
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          {element?.maxChars > 0 ? (
            <small>
              {element?.value?.length || 0} / {element?.maxChars}
            </small>
          ) : (
            <small>{element?.value?.length || 0} </small>
          )}
        </div>
      </div>
    </div>
  );
};

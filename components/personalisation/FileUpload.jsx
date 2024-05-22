import React, { useRef } from "react";

export const FileUpload = (props) => {
  const { onSetFile, isMultiple, color, labelName, acceptType } = props;
  const fileUploader = useRef(null);

  const onFileChange = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (isMultiple) {
      const files =
        event.target.files && event.target.files.length > 0
          ? event.target.files
          : null;
      for (const file of files) {
      }
      // onSetFile(file);
    } else {
      const file =
        event.target.files && event.target.files.length > 0
          ? event.target.files[0]
          : null;
      const regEx = /(.*?)\.(jpg|jpeg|png|svg)$/;
      if (!file) return;
      if (!String(file["name"]).toLowerCase().match(regEx)) return;
      return new Promise(function (resolve) {
        const reader = new FileReader();
        reader.onload = function (e) {
          // console.log(reader.result);
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <>
      <button
        type="button"
        className={"file-upload-btn " + color}
        onClick={() => fileUploader.current.click()}
      >
        {labelName}
      </button>
      <input
        type="file"
        onChange={async (e) => {
          const file = await onFileChange(e);
          if (!file) return;
          onSetFile(file);
        }}
        accept={acceptType || "image/*"}
        ref={fileUploader}
        hidden
        multiple={isMultiple}
      />
    </>
  );
};

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import Select, { components } from "react-select";
const { ValueContainer, Placeholder } = components;

import { IPersonalisationFields } from "../../models";
import { useRouter } from "next/router";

type Props = {
  fields: IPersonalisationFields[];
  isSubmitted: boolean;
  saveData: boolean;
  onSave: any;
  onSetAdditionalCost: any;
  onSetImage?: any;
};

const CustomValueContainer = ({ children, ...props }) => {
  return (
    <ValueContainer {...props}>
      <Placeholder {...props} isFocused={props.isFocused}>
        {props.selectProps.placeholder}
      </Placeholder>
      {React.Children.map(children, (child) =>
        child && child.type !== Placeholder ? child : null
      )}
    </ValueContainer>
  );
};

export const InitForm = forwardRef((props: Props, ref) => {
  const router = useRouter();
  const { fields, onSave, saveData, onSetAdditionalCost, onSetImage }: Props =
    props;
  const formRef: any = useRef();
  const [loader, setLoader] = useState<boolean>(true);
  const [formData, setFormData] = useState({});
  const [validationSchema, setValidationSchema] = useState({});

  useEffect(() => {
    initForm(fields);
  }, []);

  useImperativeHandle(ref, () => ({
    handleSubmit() {
      formRef.current.handleSubmit();
    },
  }));

  const initForm = (formSchema) => {
    const _formData = {};
    const _validationSchema = {};
    const savedData = JSON.parse(
      localStorage.getItem(`${router.query.productSku}`)
    );
    for (const element of formSchema) {
      _formData[element._id] = savedData ? savedData[element._id] : "";
      if (element.type === "2") {
        const selectedValue = element.dropdownOptions.find(
          (obj) => obj.isDefault
        );
        if (selectedValue) {
          _formData[element._id] = selectedValue?.value;
          onSetAdditionalCost(selectedValue?.additionalCost || 0);
        }
      }
      _validationSchema[element._id] = Yup.string();
      if (element.isRequired) {
        _validationSchema[element._id] =
          _validationSchema[element._id].required("Required");
      }
      if (element.maxChars) {
        _validationSchema[element._id] = _validationSchema[element._id].max(
          element.maxChars
        );
      }
    }
    setFormData(_formData);
    setValidationSchema(Yup.object().shape({ ..._validationSchema }));
    setLoader(false);
  };

  const onSubmit = (values) => {
    const data = [];
    for (let key in values) {
      data.push({ id: key, value: values[key] });
    }
    onSave(data);
  };

  if (loader) return <></>;
  return (
    <div className="App">
      <Formik
        enableReinitialize
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        innerRef={formRef}
      >
        {(props) => {
          const { touched, errors, values, setFieldValue } = props;
          if (saveData) {
            localStorage.setItem(
              `${router.query.productSku}`,
              JSON.stringify(values)
            );
          }
          return (
            <>
              {fields.map((element: IPersonalisationFields) => {
                if (element.type === "1") {
                  return (
                    <div
                      className="personalise-tab-content d-flex justify-content-between flex-wrap"
                      key={element._id}
                    >
                      <div className="personalise-box d-flex justify-content-between">
                        <div className="form-group form-floating m-0">
                          <Field
                            type="text"
                            placeholder={element?.promptText}
                            name={element._id}
                            maxLength={element?.maxChars || null}
                            className={
                              touched[element._id] && errors[element._id]
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                          />
                          <label htmlFor={element._id}>
                            {element?.isRequired && <span>*</span>}
                            {element?.promptText}
                          </label>
                          {element?.infoText && (
                            <small>{element?.infoText}</small>
                          )}
                          {element?.maxChars > 0 ? (
                            <small className="pull-right">
                              {values[element._id]?.length || 0} /{" "}
                              {element?.maxChars}
                            </small>
                          ) : (
                            <small className="pull-right">
                              {values[element._id]?.length || 0}{" "}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                } else if (element.type === "2") {
                  return (
                    <div
                      className="personalise-tab-content flex-wrap"
                      key={element._id}
                    >
                      <div className="form-group mt-3 mb-2">
                        <Select
                          isClearable={true}
                          id={element._id}
                          placeholder={element?.promptText}
                          isSearchable={false}
                          value={element.dropdownOptions.find(
                            (obj) => values[element._id] === obj.value
                          )}
                          components={{
                            ValueContainer: CustomValueContainer,
                          }}
                          styles={{
                            valueContainer: (provided, state) => ({
                              ...provided,
                              overflow: "visible",
                            }),
                            placeholder: (provided, state) => ({
                              ...provided,
                              position: "absolute",
                              top:
                                state.hasValue || state.selectProps.inputValue
                                  ? -5
                                  : "50%",
                              transition: "top 0.1s, font-size 0.1s",
                              fontSize:
                                (state.hasValue ||
                                  state.selectProps.inputValue) &&
                                13,
                            }),
                          }}
                          options={element.dropdownOptions}
                          className={
                            touched[element._id] && errors[element._id]
                              ? "select-control is-invalid"
                              : "select-control"
                          }
                          onChange={(e) => {
                            setFieldValue(element._id, e?.value);
                            onSetAdditionalCost(e?.additionalCost);
                            if (e?.image) {
                              onSetImage(e.image);
                            }
                          }}
                        />
                      </div>
                    </div>
                  );
                }
                return <></>;
              })}
            </>
          );
        }}
      </Formik>
    </div>
  );
});

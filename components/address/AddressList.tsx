import { useRouter } from "next/router";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useDispatch } from "react-redux";

import axios from "axios";

import { API_URL } from "../../config/constant";
import { setAuthHeader } from "../../config/utils";
import { IAddress } from "../../models";
import { AddressForm } from "./AddressForm";
import { PURGE_AUTH } from "../../store/actions";
import { ConfirmationModal } from "../ConfirmationModal";

type Props = {
  savedAddress: string;
  onChangeStep: (e) => void;
  setAddressCount: (e) => void;
  onShowAddressForm: (e) => void;
};

const AddressList = forwardRef((props: Props, ref: any) => {
  const { savedAddress, onChangeStep, setAddressCount, onShowAddressForm } =
    props;
  const router = useRouter();
  const dispatch = useDispatch();
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [addressList, setAddressList] = useState<IAddress[]>([]);
  const [editAddressInstance, setEditAddressInstance] =
    useState<IAddress>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>(
    savedAddress || null
  );
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>(null);

  useEffect(() => {
    getList();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    onShowAddressForm(showAddressForm);
  }, [showAddressForm]);

  useEffect(() => {
    onChangeStep(selectedAddress);
  }, [selectedAddress]);

  useImperativeHandle(ref, () => ({
    onChangeAddressForm: () => {
      setShowAddressForm(false);
    },
  }));

  const getList = async () => {
    setShowLoader(true);
    try {
      const response: any = await axios
        .get(`${API_URL}/address`, setAuthHeader())
        .then((res) => res.data);
      setAddressList(response.data);
      setAddressCount(response.data.length);
      if (response.data.length === 0) {
        setShowAddressForm(true);
      }
    } catch (e) {
      if (e.response.status === 401) {
        dispatch({ type: PURGE_AUTH });
        router.push(`/sign-in?next=${window.location.pathname}`);
      }
      setAddressList([]);
    } finally {
      setShowLoader(false);
    }
  };

  const onDeleteRecord = async () => {
    try {
      await axios.delete(`${API_URL}/address/${deleteId}`, setAuthHeader());
      if (selectedAddress === deleteId) {
        setSelectedAddress(null);
      }
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

  if (showLoader) {
    return (
      <div className="shipping-address">
        <div className="d-flex justify-content-between">
          <h5>Your Addresses</h5>
          <h5
            className="text-primary cursor-pointer"
            onClick={() => setShowAddressForm(true)}
          >
            Add Address
          </h5>
        </div>
        <div className="col-12">
          <p className="text-primary text-center mt-5">
            {showLoader ? "Loading..." : "No Addresses Saved"}
          </p>
        </div>
      </div>
    );
  }

  let listItems: any;
  if (addressList.length > 0) {
    listItems = addressList.map((element: IAddress, index: number) => {
      return (
        <div
          className="col-lg-6"
          onClick={() => {
            setSelectedAddress(element.id);
          }}
          key={element.id}
        >
          <div
            className={`address-box ${
              selectedAddress === element.id ? "active" : ""
            } d-flex`}
          >
            <div className="pe-2">
              <div className="radio">
                <input
                  name="radio"
                  id={`radio${index}`}
                  type="radio"
                  checked={selectedAddress === element.id}
                  readOnly={true}
                />
                <label htmlFor={`radio${index}`}>&nbsp;</label>
              </div>
            </div>
            <div className="p-2 flex-grow-1">
              <p className="f-w-500 pb-1 f-18">
                {element?.firstName + " " + element?.lastName}
              </p>
              <p>{element?.addressLine1}</p>
              <p>{element?.city}</p>
              <p>{element?.postalCode}</p>
            </div>
            <div className="ml-auto mt-auto">
              <i
                className="fa fa-pencil me-2"
                onClick={(e) => {
                  e.preventDefault();
                  setEditAddressInstance({
                    ...element,
                    addressLine2: element.addressLine2 || "",
                    addressLine3: element.addressLine3 || "",
                  });
                  setShowAddressForm(true);
                }}
              />
              <i
                className="fa fa-trash"
                onClick={(e) => {
                  e.preventDefault();
                  setDeleteId(element.id);
                  setShowConfirmationModal(true);
                }}
              />
            </div>
          </div>
        </div>
      );
    });
  } else {
    listItems = (
      <div className="col-12">
        <p className="text-primary text-center mt-5">No Address saved</p>
      </div>
    );
  }

  return (
    <>
      <div className="shipping-address">
        {showAddressForm ? (
          <>
            <AddressForm
              onCancel={() => {
                setEditAddressInstance(null);
                setShowAddressForm(false);
              }}
              editAddress={editAddressInstance}
              onCreateSuccess={(e: any) => {
                setShowAddressForm(false);
                setEditAddressInstance(null);
                setSelectedAddress(e || null);
                getList();
              }}
            />
          </>
        ) : (
          <>
            <div className="d-flex justify-content-between">
              <h5>Your Addresses</h5>
              <h5
                className="text-primary cursor-pointer"
                onClick={() => setShowAddressForm(true)}
              >
                Add Address
              </h5>
            </div>
            <div className="row">{listItems}</div>
            {/* <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary next-button"
                onClick={() => onChangeStep(selectedAddress)}
                disabled={!selectedAddress}
              >
                Next
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

export default AddressList;

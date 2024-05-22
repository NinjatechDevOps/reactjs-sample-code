import Link from "next/link";
import { useRouter } from "next/router";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import axios from "axios";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AccountSidenav from "../../components/account/AccountSidenav";
import { API_URL, TOKEN_KEY } from "../../config/constant";
import { setAuthHeader } from "../../config/utils";
import { IAddress } from "../../models";
import { PURGE_AUTH } from "../../store/actions";
import { AddressForm } from "../../components/address/AddressForm";
import { ConfirmationModal } from "../../components/ConfirmationModal";

const MyAddress = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [addressList, setAddressList] = useState<IAddress[]>([]);
  const [editAddressInstance, setEditAddressInstance] =
    useState<IAddress>(null);
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
        .get(`${API_URL}/address`, setAuthHeader())
        .then((res) => res.data);
      setAddressList(response.data);
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
  if (addressList.length > 0) {
    listItems = addressList.map((element: IAddress, index: number) => {
      return (
        <div className="col-lg-6" key={element.id}>
          <div className="address-box">
            <div className="p-auto">
              <p className="f-w-500 pb-1 f-18">
                {element?.firstName + " " + element?.lastName}
              </p>
              <p>{element?.addressLine1}</p>
              <p>{element?.city}</p>
              <p>{element?.postalCode}</p>
            </div>
            <div className="mt-auto">
              <FontAwesomeIcon
                icon={faPencilAlt}
                className="me-3"
                onClick={(e) => {
                  e.preventDefault();
                  setEditAddressInstance({
                    ...element,
                    addressLine2: element?.addressLine2 || "",
                    addressLine3: element?.addressLine3 || "",
                  });
                  setShowAddressForm(true);
                }}
              />
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
      );
    });
  } else {
    listItems = (
      <div className="col-lg-12">
        <div className="text-center text-primary mt-5">No Address Founds</div>
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
          <div className="col-lg-9 address mt-3 mt-lg-0">
            <div className="title-text">
              {showAddressForm ? "Add New Address" : "Address Book"}
            </div>
            {!showAddressForm && (
              <div
                className="d-flex text-primary f-w-500 justify-content-end cursor-pointer m-none"
                onClick={() => setShowAddressForm(true)}
              >
                Add New Address
              </div>
            )}
            {showLoader ? (
              <div className="text-center text-primary mt-5">Loading...</div>
            ) : showAddressForm ? (
              <AddressForm
                editAddress={editAddressInstance}
                onCancel={() => {
                  setEditAddressInstance(null);
                  setShowAddressForm(false);
                }}
                onCreateSuccess={(e: any) => {
                  setShowAddressForm(false);
                  setEditAddressInstance(null);
                  getList();
                }}
              />
            ) : (
              <div className="row">{listItems}</div>
            )}
            {!showAddressForm && (
              <button
                className="btn btn-primary btn-block d-none"
                onClick={() => setShowAddressForm(true)}
              >
                Add New Address
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
};

export default MyAddress;

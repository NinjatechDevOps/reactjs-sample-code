import React from "react";
import { ContactUsForm } from "../components/ContactUsForm";
import { Map } from "../components/Map";

const ContactUs = () => {
  return (
    <React.Fragment>
      <div className="container">
        <div className="contact-us">
          <h3 className="title">Contact Us</h3>
          <div className="row">
            <div className="col-sm-7">
              <ContactUsForm />
            </div>
            <div className="col-sm-5 mt-4 mt-sm-0">
              <Map />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ContactUs;

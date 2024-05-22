import React from "react";
import { Map } from "../components/Map";
import { LOGO_NAME } from "../config/constant";

const ContactUs = () => {
  return (
    <React.Fragment>
      <div className="container">
        <div className="location">
          <h3 className="title">Our Location</h3>
          <Map />
          <p className="text-center mt-3 f-w-600">
            {LOGO_NAME} Group Ltd. Unit 52 Woolmer Way, Bordon, Hampshire, GU35
            9QF
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ContactUs;

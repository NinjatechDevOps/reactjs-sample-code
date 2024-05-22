import axios from "axios";
import { useEffect } from "react";
import { API_URL } from "../config/constant";

const Error = ({ error }) => {
  console.log("Error", error.message);

  useEffect(() => {
    onError();
  }, []);

  const onError = async () => {
    // try {
      const data = {
        message: error.message,
        stack: String(error.stack),
      };
      console.log("Error calling Error", data);
      await axios.post(`${API_URL}/error`, data);
    // } catch (e) {
    //   console.log("catch", e);
    // }
  };
  return <h1 className="mt-5 text-center">500 - Server Error</h1>;
};

Error.getInitialProps = async ({ error }) => {
  return { error };
};
export default Error;

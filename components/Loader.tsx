import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="loader-bg">
      <div className="loader-track">
        <div className="loader-fill" />
      </div>
    </div>
  );
};

export default Loader;

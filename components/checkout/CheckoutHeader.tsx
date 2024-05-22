type Props = {
  currentStep: number;
  onChangeStep: any;
};

export const CheckoutHeader = ({ currentStep, onChangeStep }: Props) => {
  return (
    <>
      <div className="stepwizard-row setup-panel">
        <div className="stepwizard-step">
          <a
            onClick={() => onChangeStep(1)}
            type="button"
            className={`btn btn-circle ${
              currentStep >= 1 ? "btn-primary" : ""
            }`}
          >
            <span></span>
          </a>
        </div>
        <div className="stepwizard-step">
          <a
            style={{ cursor: "default" }}
            type="button"
            className={`btn btn-circle ${
              currentStep >= 2 ? "btn-primary" : "btn-default"
            }`}
          >
            <span></span>
          </a>
        </div>
        <div className="stepwizard-step">
          <a
            style={{ cursor: "default" }}
            type="button"
            className={`btn btn-circle ${
              currentStep >= 3 ? "btn-primary" : "btn-default"
            }`}
          >
            <span></span>
          </a>
        </div>
      </div>
    </>
  );
};

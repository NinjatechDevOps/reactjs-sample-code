import { InformationBarModel } from "../../models";

type Props = {
  data: InformationBarModel[];
};

export const InformationBar = ({ data }: Props) => {
  if (data.length === 0) return <></>;
  return (
    <>
      <div className="information-bar-main">
        <div className="row">
          {data?.map((element) => {
            return (
              <div className="col-lg-4 col-4" key={element?.id}>
                <div className="delivery-box">
                  <div className="delivery-icon">
                    <img src={element?.image} alt={element?.title} />
                  </div>
                  <div className="delivery-text">
                    <h4>{element?.title}</h4>
                    <p className="text-muted">{element?.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

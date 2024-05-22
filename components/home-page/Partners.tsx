import { IPartners } from "../../models";

type Props = {
  data: IPartners;
};

export const Partners = ({ data }: Props) => {
  if (!data || !data?.partners || data.partners.length === 0) return <></>;
  return (
    <>
      <div className="sell-main">
        <div className="sell-block">
          <div className="title-main">
            <h2 className="text-center mb-4">Sell With Us</h2>
          </div>
          <div className="row">
            {data?.partners
              .filter((obj) => obj.isDisplay)
              .map((element, index) => {
                return (
                  <div className="col-lg-3 col-6" key={index}>
                    <div className="custom-box">
                      <img
                        src={element?.image?.image}
                        alt={element?.image?.altText}
                      />
                      <h3 className="text-primary">{element?.title}</h3>
                      <p>{element?.description}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

import axios, { AxiosResponse } from "axios";
import { GetServerSideProps } from "next";
import { API_URL } from "../../config/constant";
import { ICMS, ISections } from "../../models";

type Props = {
  data: ICMS;
};

export default function CMS({ data }: Props) {
  return (
    <div className="container">
      <div className="cms">
        {data.sections.map((section: ISections) => {
          if (section.type === "1") {
            return (
              <div
                key={section._id}
                className="mb-3 block-text"
                dangerouslySetInnerHTML={{ __html: section?.blockText }}
              ></div>
            );
          } else if (section.type === "2") {
            return (
              <div className="row mt-5" key={section._id}>
                {section.profileCards.map((card) => (
                  <div className="col text-center" key={card._id}>
                    <div className="about-block d-flex flex-column">
                      <img
                        src={card.image}
                        alt={card.text}
                        className="aboutus__img"
                      />
                      <div className="about-text">
                        <p className="mt-3 mb-3">{card.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          } else if (section.type === "3") {
            if (!section.banner.isShow) return <></>;
            return (
              <div className="banner" key={section._id}>
                <img
                  height="375"
                  width="1680"
                  src={section.banner.image}
                  alt={section.banner.altName}
                />
              </div>
            );
          } else if (section.type === "4") {
            return (
              <div className="row blog-card" key={section._id}>
                {section.blogCards.map((card) => {
                  if (card.layout === "1") {
                    return (
                      <div className="col-4" key={card._id}>
                        <div className="card bottom">
                          <img
                            src={card.image}
                            className="card-img-top"
                            alt="..."
                          />
                          <div className="card-body">
                            <div
                              className="block-text"
                              dangerouslySetInnerHTML={{
                                __html: card.description,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="col-4" key={card._id}>
                      <div className="card top">
                        <div className="card-body">
                          <div
                            className="block-text"
                            dangerouslySetInnerHTML={{
                              __html: card.description,
                            }}
                          ></div>
                        </div>
                        <img
                          src={card.image}
                          className="card-img-top"
                          alt="..."
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          } else if (section.type === "5") {
            return (
              <div className="row split-image" key={section._id}>
                {section.splitImageText.layout === "3" ? (
                  <>
                    <div className="col-4">
                      <img
                        src={section.splitImageText.image}
                        alt={section.splitImageText.altName}
                        width="400"
                      />
                    </div>
                    <div className="col-8">
                      <div
                        className="block-text"
                        dangerouslySetInnerHTML={{
                          __html: section.splitImageText.description,
                        }}
                      ></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-8">
                      <div
                        className="block-text"
                        dangerouslySetInnerHTML={{
                          __html: section.splitImageText.description,
                        }}
                      ></div>
                    </div>
                    <div className="col-4">
                      <img
                        src={section.splitImageText.image}
                        alt={section.splitImageText.altName}
                        width="400"
                      />
                    </div>
                  </>
                )}
              </div>
            );
          }
          return <></>;
        })}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  try {
    const { data } = await axios
      .get(`${API_URL}/cms/${params.link}`)
      .then((response: AxiosResponse) => {
        return response.data || null;
      });
    return {
      props: { data },
    };
  } catch {
    return { redirect: { permanent: false, destination: "/404" } };
  }
};

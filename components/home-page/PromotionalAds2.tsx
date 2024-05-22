import Link from "next/link";
import { IPromotionalAds } from "../../models";
import { useWindowSize } from "../hooks/window";

type Props = {
  data: IPromotionalAds;
};

export const PromotionalAds2 = ({ data }: Props) => {
  if (!data || data.values.length < 0) return <></>;

  const { width } = useWindowSize();

  return (
    <>
      <div className="greeting-main">
        <div className="greeting-block">
          <div className="title-main">
            <h2 className="text-center">{data?.name}</h2>
          </div>
          <div className="row mb-2">
            {data.values.map((element, index) => {
              let link: string = "";
              if (String(element.type) === "1") {
                const thirdLevel = element.category?.categoryRef;
                const secondLevel = element.category?.parentCategory;
                const topLevel = secondLevel?.parentCategory?.categoryRef;
                link = "#";
                if (secondLevel && topLevel) {
                  link = `/category/${topLevel}/${secondLevel?.categoryRef}/${thirdLevel}`;
                }
                if (element.tags && element.tags.length > 0) {
                  link += `?tag=${element.tags.toString()}`;
                }
              } else if (String(element.type) === "2") {
                link = `/product/${element.product.sku}`;
              } else if (String(element.type) === "3") {
                link = `/account/reminders?add=${true}`;
              }
              let defaultClass = "col-lg-3 col-6 text-center";
              if (width < 768) {
                defaultClass += index % 2 === 0 ? " pe-2" : " ps-2";
              }
              return (
                <div className={defaultClass} key={index}>
                  <Link href={link}>
                    <a className="greeting-cards d-flex flex-column">
                      <img
                        src={element?.image?.image}
                        alt={element?.image?.altText || data?.name}
                        className="product__img"
                      />
                      {/* <div className="greeting-text">
                        <h3>{element?.richText}</h3>
                      </div> */}
                    </a>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

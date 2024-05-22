import Link from "next/link";
import { useEffect, useState } from "react";
import { dynamicSort } from "../../config/utils";
import { IPromotionalAd, IPromotionalAds } from "../../models";
import { useWindowSize } from "../hooks/window";

type Props = {
  data: IPromotionalAds;
};

export const PromotionalAds1 = ({ data }: Props) => {
  let [values, setValues] = useState(
    data?.values.sort(dynamicSort("sortOrder"))
  );
  const { width } = useWindowSize();

  useEffect(() => {
    setValues(
      width < 768
        ? [data?.values[0], data?.values[2], data?.values[1]]
        : data?.values
    );
  }, [width]);

  if (values.length === 0) return <></>;

  return width < 768 ? (
    <div className="promo-gallery row">
      {values.map((element: IPromotionalAd, index) => {
        if (!element) return <></>;
        let link: string = "";
        // console.log(element.category, element.tags);
        if (String(element.type) === "1") {
          link = `/category/${element.category?.categoryRef}`;
          if (element.tags && element.tags.length > 0) {
            link += `?tag=${element.tags.toString()}`;
          }
        } else {
          link = `/product/${element.product.sku}`;
        }
        let classes = "";
        if (index === 0) {
          classes = "col-6 ps-0 pe-2";
        } else if (index === 1) {
          classes = "col-6 ps-2 pe-0";
        } else {
          classes = "col-12 p-0";
        }
        return (
          <div key={index} className={classes}>
            <Link href={link}>
              <img
                src={element?.image?.image}
                alt={element?.image?.altText || `promo_image_${index + 1}`}
              />
            </Link>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="home-promo-gallery">
      {values
        .filter((element) => element.isDisplay)
        .map((element: IPromotionalAd, index) => {
          let link: string = "";
          if (!element.type) return <></>;
          // console.log(element.category, element.tags);
          if (String(element?.type) === "1") {
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
          return (
            <Link href={link} key={index}>
              <img
                src={element?.image?.image}
                alt={element?.image?.altText || `promo_image_${index}`}
              />
            </Link>
          );
        })}
    </div>
  );
};

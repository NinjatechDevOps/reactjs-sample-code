import Link from "next/link";
import { IBanner, Image } from "../../models";
import { useWindowSize } from "../hooks/window";

type Props = {
  banner: IBanner;
};

export const Banner = ({ banner }: Props) => {
  if (!banner) return <></>;
  const { width } = useWindowSize();
  let link: string = "";
  if (String(banner.type) === "1") {
    const thirdLevel = banner.category?.categoryRef;
    const secondLevel = banner.category?.parentCategory;
    const topLevel = secondLevel?.parentCategory?.categoryRef;
    link = "#";
    if (secondLevel && topLevel) {
      link = `/category/${topLevel}/${secondLevel?.categoryRef}/${thirdLevel}`;
    }
    if (banner.tags && banner.tags.length > 0) {
      link += `?tag=${banner.tags.toString()}`;
    }
  } else if (String(banner.type) === "2") {
    link = `/product/${banner.product.sku}`;
  } else if (String(banner.type) === "3") {
    link = `/account/reminders?add=${true}`;
  }
  const image: Image = width < 768 ? banner?.mobileImage : banner?.image;
  return (
    <div className="home-banner">
      <div className="container" style={{ padding: 0 }}>
        <Link href={link}>
          <a>
            <img
            className="banner-image"
              height="375"
              width={image?.dimension?.width}
              src={image?.image}
              alt={image?.altText || banner?.name}
            />
            <img
              className="svg-image"
              src={image?.svgImage}
              alt={image?.altText || banner?.name}
            />
          </a>
        </Link>
      </div>
    </div>
  );
};

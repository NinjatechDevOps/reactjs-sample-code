import Slider from "react-slick";

import { IFeaturedItem, IProduct } from "../../models";
import { useWindowSize } from "../hooks/window";
import { ProductThumbnailView } from "../ProductThumbnailView";
import { CardThumbnailView } from "../CardThumbnailView";

type Props = {
  data: IFeaturedItem;
};

export const FeaturedProducts = ({ data }: Props) => {
  if (!data?.product || data?.product.length === 0) return <></>;

  const { width } = useWindowSize();

  return (
    <div className="season-main">
      <div className="row">
        <div className="col-12">
          <h1 className="title text-center mb-3">{data?.title}</h1>
        </div>
      </div>
      <div className="row">
        {width < 768 ? (
          <Slider
            infinite={true}
            swipeToSlide={true}
            arrows={false}
            focusOnSelect={true}
            lazyLoad={true}
            slidesToShow={2}
            slidesToScroll={1}
          >
            {data?.product.map((element: IProduct) => {
              return (
                <ProductThumbnailView product={element} key={element?.id} />
              );
            })}
          </Slider>
        ) : (
          data?.product.map((element: IProduct) => {
            if (element.productType === "5") {
              return <CardThumbnailView product={element} key={element?.id} />;
            }
            return <ProductThumbnailView product={element} key={element?.id} />;
          })
        )}
      </div>
    </div>
  );
};

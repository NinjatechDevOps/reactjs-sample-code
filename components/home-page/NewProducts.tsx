import Slider from "react-slick";

import { IFeaturedItem, IProduct } from "../../models";
import { useWindowSize } from "../hooks/window";
import { ProductThumbnailView } from "../ProductThumbnailView";

type Props = {
  data: IFeaturedItem;
};

export const NewProducts = ({ data }: Props) => {
  if (!data?.product || data?.product.length === 0) return <></>;
  const { width } = useWindowSize();

  return (
    <>
      <div className="season-main">
        <div className="title-main">
          <h2 className="text-center mb-4">{data?.title}</h2>
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
              return (
                <ProductThumbnailView product={element} key={element?.id} />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

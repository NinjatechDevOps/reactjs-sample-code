import { IFeaturedItem, IProduct } from "../../models";
import { ProductThumbnailView } from "../ProductThumbnailView";

type Props = {
  data: IFeaturedItem;
};

export const TopTrendings = ({ data }: Props) => {
  if (!data || data?.product.length === 0) return <></>;

  return (
    <>
      {/* <div className="container"> */}
      <div className="season-main">
        <div className="title-main">
          <h2 className="text-center mb-4">{data?.title}</h2>
        </div>
        <div className="row">
          {data?.product.map((element: IProduct) => {
            return <ProductThumbnailView product={element} key={element?.id} />;
          })}
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

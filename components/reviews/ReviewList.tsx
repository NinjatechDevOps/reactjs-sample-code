import { IReviewCount, IReviews } from "../../models";
import { ReviewAverage } from "./ReviewAverage";
import { ReviewItem } from "./ReviewItem";

type Props = {
  reviews: IReviews[];
  reviewCount: IReviewCount;
  totalCount: number;
};

export const ReviewList = ({ reviewCount, totalCount, reviews }: Props) => {
  return (
    <div className="product-ratings-reviews">
      <ReviewAverage reviewCount={reviewCount} totalCount={totalCount} />

      <div className="reviews mt-4 mt-md-5 pt-3">
        {reviews.map((item) => (
          <ReviewItem key={item.id} review={item} />
        ))}
      </div>
    </div>
  );
};

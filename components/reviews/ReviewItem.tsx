import { faCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { range } from "lodash";
import { getTimeDifference } from "../../config/utils";
import { IReviews } from "../../models";

type Props = {
  review: IReviews;
};

export const ReviewItem = ({ review }: Props) => {
  return (
    <>
      <div className="review-item">
        <div className="d-flex justify-content-between">
          <div className="rating-star d-flex">
            {range(1, 6).map((id) => (
              <FontAwesomeIcon
                key={id}
                height={18}
                icon={faStar}
                className={id <= review.rating ? "active" : ""}
              />
            ))}
          </div>
          {review.isRecommended && (
            <div className="text-recommend text-end">
              <FontAwesomeIcon height={14} icon={faCheck} className="" />{" "}
              Recommends this product
            </div>
          )}
        </div>
        <div className="d-flex justify-content-between align-items-center pt-2 pt-md-1">
          <div className="customername">
            {review.isAnonymous
              ? "Anonymous"
              : review.user?.firstName + " " + review.user?.lastName}
          </div>
          <div className="txt-days text-end">
            {getTimeDifference(new Date(review.createdAt))}
          </div>
        </div>
        <h3 className="review-title pt-3">{review.title}</h3>
        <div className="review-text">{review.comment}</div>
      </div>
      {review.reviewReply?.comment && (
        <div className="review-item ps-4">
          <p className="text-primary">Cauliflower's response</p>
          <div className="f-14">{review.reviewReply?.comment}</div>
        </div>
      )}
    </>
  );
};

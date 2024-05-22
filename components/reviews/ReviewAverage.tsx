import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "react-bootstrap/ProgressBar";
import { range } from "lodash";
import { IReviewCount } from "../../models";

type Props = {
  reviewCount: IReviewCount;
  totalCount: number;
};
export const ReviewAverage = ({ reviewCount, totalCount }: Props) => {
  return (
    <>
      <div className="rating-num text-center mt-1">
        {Number(reviewCount?.average).toFixed(1)}
      </div>
      <div className="rating-star text-center mt-2 pt-1">
        {range(1, 6).map((id) => (
          <FontAwesomeIcon
            key={id}
            height={24}
            icon={faStar}
            className={id <= reviewCount.average ? "active" : ""}
          />
        ))}
      </div>
      <div className="rating-text text-center mt-2">
        Based on {totalCount} reviews
      </div>
      <div className="progress-wrapper mt-3 pt-3">
        <div className="progress-item d-flex align-items-center">
          <h3 className="progress-text">Excellent</h3>
          <ProgressBar
            variant="primary"
            now={reviewCount[5]}
            min={0}
            max={totalCount}
          />
          <span className="progress-num">{reviewCount[5]}</span>
        </div>
        <div className="progress-item d-flex align-items-center mt-3 pt-1">
          <h3 className="progress-text">Good</h3>
          <ProgressBar
            variant="primary"
            now={reviewCount[4]}
            min={0}
            max={totalCount}
          />
          <span className="progress-num">{reviewCount[4]}</span>
        </div>
        <div className="progress-item d-flex align-items-center mt-3 pt-1">
          <h3 className="progress-text">Average</h3>
          <ProgressBar
            variant="primary"
            now={reviewCount[3]}
            min={0}
            max={totalCount}
          />
          <span className="progress-num">{reviewCount[3]}</span>
        </div>
        <div className="progress-item d-flex align-items-center mt-3 pt-1">
          <h3 className="progress-text">Below Average</h3>
          <ProgressBar
            variant="primary"
            now={reviewCount[2]}
            min={0}
            max={totalCount}
          />
          <span className="progress-num">{reviewCount[2]}</span>
        </div>
        <div className="progress-item d-flex align-items-center mt-3 pt-1">
          <h3 className="progress-text">Poor</h3>
          <ProgressBar
            variant="primary"
            now={reviewCount[1]}
            min={0}
            max={totalCount}
          />
          <span className="progress-num">{reviewCount[1]}</span>
        </div>
      </div>
    </>
  );
};

import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

import { IReviews, IReviewCount } from "../../models";
import {
  API_URL,
  DEFAULT_OFFSET,
  DEFAULT_PRODUCTS_LIMIT,
} from "../../config/constant";
import { setAuthHeader } from "../../config/utils";
import { ReviewAverage } from "./ReviewAverage";
import { ReviewItem } from "./ReviewItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

type Props = {
  reviewCount: IReviewCount;
  productId: string;
  show: boolean;
  onHide: () => void;
};

export const ReviewModal = ({
  reviewCount,
  productId,
  show,
  onHide,
}: Props) => {
  const [reviewList, setReviewList] = useState<IReviews[]>([]);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [offset, setOffset] = useState<number>(DEFAULT_OFFSET);

  useEffect(() => {
    getReviews();
  }, [offset]);

  const getReviews = async () => {
    setShowLoader(true);
    try {
      const { results, totalCounts } = await axios
        .get(
          `${API_URL}/reviews/${productId}?limit=${DEFAULT_PRODUCTS_LIMIT}&offset=${offset}`,
          setAuthHeader()
        )
        .then((res) => res.data);
      setReviewList([...reviewList, ...results]);
      setTotalCount(totalCounts);
    } catch (e) {
      setReviewList([]);
      setTotalCount(0);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <Modal
      size="lg"
      centered
      autoFocus={true}
      className="ratings-reviews-modal"
      show={show}
      onHide={() => onHide()}
    >
      <Modal.Header closeButton className="pt-4 pb-0 ps-5">
        <Modal.Title id="example-modal-sizes-title-lg">Reviews</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-2 p-sm-3 p-md-4">
        <div className="product-ratings-reviews">
          <ReviewAverage reviewCount={reviewCount} totalCount={totalCount} />
          <div className="reviews mt-54 pt-2 mt-3">
            {reviewList.map((item) => (
              <ReviewItem key={item.id} review={item} />
            ))}
            <div className="text-center mt-3">
              {reviewList.length < totalCount && !showLoader && (
                <button
                  className="btn btn-primary see-more-btn"
                  onClick={() => setOffset(offset + DEFAULT_PRODUCTS_LIMIT)}
                >
                  See More
                </button>
              )}
              {showLoader && (
                <FontAwesomeIcon
                  icon={faSpinner}
                  height={26}
                  pulse={true}
                  className="load-more"
                />
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

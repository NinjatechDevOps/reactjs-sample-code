import axios from "axios";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Cookies from "js-cookie";

import { ReviewForm } from "../components/reviews/ReviewForm";
import { API_URL, TOKEN_KEY } from "../config/constant";
import { setAuthHeader } from "../config/utils";

const Reviews = ({ products, recentOrderProducts }) => {
  return (
    <React.Fragment>
      <div className="container">
        <div className="breadcrumbs">
          <ul>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li className="text-capitalize">Leave a Review</li>
          </ul>
        </div>
      </div>
      <div className="pt-5">
        <Container>
          <Row>
            <Col>
              <h3 className="rf-page-title text-center">Leave A Review</h3>
              <div className="rf-subtext text-center bdr-btm">
                We'd love to know what you think. Please share your feedback
                with us by filling in the below form.
              </div>
            </Col>
          </Row>
        </Container>
        {recentOrderProducts.map(({ product }) => {
          if (!product) return <></>;
          return (
            <div className="review-item-row" key={product.id}>
              <ReviewForm product={product} />
              <Container>
                <Row>
                  <Col className="bdr-btm pt-4"></Col>
                </Row>
              </Container>
            </div>
          );
        })}
      </div>
      {products && products.length > 1 && (
        <div className="review-second-block pt-5 pb-5">
          <Container>
            <Row>
              <Col>
                <h3 className="rf-page-title text-center">
                  Your Other Purchases
                </h3>
                <p className="rf-subtext text-center">
                  These items are also waiting for a review.
                </p>
              </Col>
            </Row>
          </Container>
          {products.map((product) => {
            if (!product) return <></>;
            return (
              <div className="review-item-row" key={product.id}>
                <ReviewForm product={product} />
                <Container>
                  <Row>
                    <Col className="bdr-btm pt-4"></Col>
                  </Row>
                </Container>
              </div>
            );
          })}
        </div>
      )}
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { order } = query;
  try {
    let url = `${API_URL}/reviews`;
    if (order) {
      url += `?orderId=${order}`;
    }
    let token = null;
    if (req?.cookies) {
      token = req?.cookies[TOKEN_KEY];
    } else {
      token = Cookies.get(TOKEN_KEY);
    }
    const data = await axios
      .get(url, setAuthHeader(null, token))
      .then((res) => res.data);
    return { props: { ...data } };
  } catch (e) {
    // console.log(e);
    if (e.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: `/sign-in?next=/reviews?order=${order}`,
        },
      };
    }
    return { redirect: { permanent: false, destination: `/` } };
  }
};

export default Reviews;

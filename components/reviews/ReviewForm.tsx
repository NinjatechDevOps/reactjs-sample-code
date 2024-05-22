import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { range } from "lodash";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

import { IProduct } from "../../models";
import axios from "axios";
import { API_URL } from "../../config/constant";
import { setAuthHeader } from "../../config/utils";
import { PURGE_AUTH } from "../../store/actions";
import Link from "next/link";

type Props = {
  product: IProduct;
};

export const ReviewForm = ({ product }: Props) => {
  if (!product) return <></>;
  const router = useRouter();
  const dispatch = useDispatch();
  const [showSubmitLoader, setSubmitLoader] = useState<boolean>(false);
  const [isReviewAdded, setIsReviewAdded] = useState<boolean>(false);

  const initialValues = {
    product: product?.id,
    rating: 0,
    title: "",
    comment: "",
    isAnonymous: false,
    isRecommended: false,
  };

  const onSubmit = async (data) => {
    setSubmitLoader(true);
    try {
      await axios.post(`${API_URL}/reviews`, data, setAuthHeader());
      setIsReviewAdded(true);
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch({ type: PURGE_AUTH });
        router.push(`/sign-in?next=${window.location.pathname}`);
      }
    } finally {
      setSubmitLoader(false);
    }
  };

  const defaultImage =
    product.images.find((img) => img.isDefault) || product.images[0];
  return (
    <div className="review-form mt-4">
      <Container>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            onSubmit(values);
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().required("Please Enter Title"),
            comment: Yup.string().required("Please Enter Comment"),
            rating: Yup.number().min(1, "Please Select Rating"),
          })}
        >
          {(props) => {
            const {
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
            } = props;
            return (
              <form onSubmit={handleSubmit}>
                <Row>
                  <Col
                    md="3"
                    lg="2"
                    className="d-flex flex-column-reverse flex-md-column"
                  >
                    <h3 className="rf-prod-name text-center text-md-start mt-3 mt-md-0">
                      <Link href={`/product/${product.sku}`}>
                        <a>{product?.name}</a>
                      </Link>
                    </h3>
                    <Image
                      src={defaultImage.image}
                      className="rf-prod-img mx-auto mx-md-0 "
                    />
                  </Col>
                  <Col md="9" lg="10">
                    <Row className="flex-column flex-md-row">
                      <Col className="col-input order-2 order-md-0 mt-4 mt-md-0">
                        <Form.Group className="mb-3">
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            type="text"
                            value={values.title}
                            name="title"
                            className={`form-control ${
                              touched.title && errors.title ? "is-invalid" : ""
                            }`}
                            onChange={handleChange}
                          />
                          {touched.title && errors.title && (
                            <div className="invalid-feedback">
                              {errors.title}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col className="col-ratings order-1 order-md-0 text-center text-md-start">
                        <p>Overall Rating</p>
                        <div className="rating-star mt-2 pt-1">
                          {range(1, 6).map((id) => (
                            <FontAwesomeIcon
                              key={id}
                              height={24}
                              icon={faStar}
                              onClick={() => setFieldValue("rating", id)}
                              className={`cursor-pointer ${
                                id <= values.rating ? "active" : ""
                              }`}
                            />
                          ))}
                        </div>
                      </Col>
                      <Col md="12" className="order-3 order-md-0">
                        <Form.Group className="mb-3">
                          <Form.Label>Comment</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            name="comment"
                            value={values.comment}
                            className={`form-control ${
                              touched.comment && errors.comment
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={handleChange}
                          />
                          {touched.comment && errors.comment && (
                            <div className="invalid-feedback">
                              {errors.comment}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="align-items-center">
                      <Col md="5" className="mt-4 mt-md-2">
                        <label className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            // id="isRecommended"
                            name="isRecommended"
                            checked={values.isRecommended}
                            onChange={handleChange}
                          />
                          <span className="custom-control-indicator"></span>
                          <span className="custom-control-description">
                            I would recommend this product
                          </span>
                        </label>
                      </Col>
                      <Col md="3" className="mt-4 mt-md-2">
                        <label className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            // id="isAnonymous"
                            className="custom-control-input"
                            name="isAnonymous"
                            checked={values.isAnonymous}
                            onChange={handleChange}
                          />
                          <span className="custom-control-indicator"></span>
                          <span className="custom-control-description">
                            Remain Anonymous
                          </span>
                        </label>
                      </Col>
                      <Col
                        md="4"
                        className="text-center text-md-end mt-4 mt-md-2"
                      >
                        {isReviewAdded ? (
                          <Button
                            variant="success"
                            className="submit-review-btn"
                          >
                            Review Submitted
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            className="submit-review-btn"
                            type="submit"
                            disabled={showSubmitLoader}
                          >
                            {showSubmitLoader ? "Loading..." : "Submit Review"}
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </form>
            );
          }}
        </Formik>
      </Container>
    </div>
  );
};

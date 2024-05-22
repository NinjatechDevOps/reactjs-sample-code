import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import axios, { AxiosResponse } from "axios";
import Slider from "react-slick";

import {
  API_URL,
  DEFAULT_OFFSET,
  DEFAULT_PRODUCTS_LIMIT,
} from "../../config/constant";
import { IDesginer, IProduct } from "../../models";
import { useWindowSize } from "../../components/hooks/window";
import { ProductThumbnailView } from "../../components/ProductThumbnailView";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

type Props = {
  designer: IDesginer;
};

const DesginerDetail = ({ designer }: Props) => {
  // console.log("designer", products);
  const router = useRouter();
  const { width } = useWindowSize();

  const [totalCounts, setTotalCounts] = useState<number>(0);
  const [offset, setOffset] = useState<number>(DEFAULT_OFFSET);
  const [productsList, setProductsList] = useState<IProduct[]>([]);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  useEffect(() => {
    getProducts();
  }, [offset]);

  const getProducts = async () => {
    setShowLoader(true);
    try {
      const url = `${API_URL}/product?designer=${router.query?.id}&limit=${DEFAULT_PRODUCTS_LIMIT}&offset=${offset}`;
      const { results, totalCounts } = await axios
        .get(url)
        .then((response: AxiosResponse) => {
          return response.data;
        });
      setTotalCounts(totalCounts);
      if (results.length > 0) {
        setProductsList([...productsList, ...results]);
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="breadcrumbs">
          <ul>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li>Artist Profile</li>
          </ul>
        </div>
      </div>
      <div className="designer">
        <div className="container">
          <h5>{designer.name}</h5>
          {designer.image.desktopCoverPhoto && (
            <img
              className="background"
              src={
                width < 768
                  ? designer.image?.mobileCoverPhoto
                  : designer.image?.desktopCoverPhoto
              }
              alt="Background Photo"
            />
          )}
          {designer.image?.profilePicture && (
            <img
              src={designer.image?.profilePicture}
              className="profile"
              alt="Profile_picture"
            />
          )}
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: designer?.description }}
          ></div>
          <hr />
          <div className="season-main">
            <div className="row">
              {productsList.map((element: IProduct) => {
                return (
                  <ProductThumbnailView product={element} key={element?.id} />
                );
              })}
            </div>
            <div className="text-center">
              {productsList.length < totalCounts && !showLoader && (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setOffset(offset + DEFAULT_PRODUCTS_LIMIT)}
                >
                  Show More
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
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const { designer } = await axios
      .get(`${API_URL}/designer/${params.id}`)
      .then((response: AxiosResponse) => {
        return response.data || null;
      });
    return { props: { designer } };
  } catch {
    return { redirect: { permanent: false, destination: "/404" } };
  }
};

export default DesginerDetail;

import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";

import axios, { AxiosResponse } from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";

import {
  API_URL,
  DEFAULT_PRODUCTS_LIMIT,
  DEFAULT_OFFSET,
  APP_NAME,
} from "../../config/constant";
import { ICategorySlugResponse, IProduct } from "../../models";
import { ProductThumbnailView } from "../../components/ProductThumbnailView";
import { useWindowSize } from "../../components/hooks/window";
import Head from "next/head";

type Props = {
  data: ICategorySlugResponse;
};

const SlickArrowLeft: any = ({ currentSlide, slideCount, ...props }) => {
  let defauleClass = "slick-arrow slick-prev";
  if (currentSlide === slideCount - 1) {
    defauleClass += " slick-disabled";
  }
  return (
    <FontAwesomeIcon
      {...props}
      className={defauleClass}
      icon={faChevronLeft}
      height={16}
    />
  );
};

const SlickArrowRight: any = ({ currentSlide, slideCount, ...props }) => {
  let defauleClass = "slick-arrow slick-next";
  if (currentSlide === slideCount - 1) {
    defauleClass += " slick-disabled";
  }
  return (
    <FontAwesomeIcon
      {...props}
      className={defauleClass}
      icon={faChevronRight}
      height={16}
    />
  );
};

export default function Category({ data }: Props) {
  const router = useRouter();
  const { width } = useWindowSize();
  const tag: any = router.query.tag;
  const [selectedTags, setSelectedTags] = useState<string[]>(
    tag ? tag.split(",") : []
  );
  const [tags, setTags] = useState<string[]>(tag ? tag.split(",") : []);
  const [totalCounts, setTotalCounts] = useState<number>(0);
  const [offset, setOffset] = useState<number>(DEFAULT_OFFSET);
  const [productsList, setProductsList] = useState<IProduct[]>([]);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const settings = {
    arrows: true,
    dots: false,
    infinite: width < 768 ? tags?.length > 5 : tags?.length >= 13,
    speed: 500,
    slidesToShow: width < 768 ? 5 : tags?.length >= 13 ? 13 : tags?.length || 0,
    slidesToScroll: 5,
    nextArrow: <SlickArrowRight />,
    prevArrow: <SlickArrowLeft />,
  };

  useEffect(() => {
    // console.log("calling", offset);
    getProducts();
  }, [offset]);

  const getProducts = async () => {
    const catgoryId = data.category3.id;
    // try {
    setShowLoader(true);
    let defaultURL: string = `${API_URL}/product?category=${catgoryId}&limit=${DEFAULT_PRODUCTS_LIMIT}&offset=${offset}`;
    if (tag) {
      defaultURL += `&tag=${tag}`;
    }
    // console.log("defaultURL", defaultURL);
    const { results, totalCounts } = await axios
      .get(encodeURI(defaultURL))
      .then((response: AxiosResponse) => {
        return response.data;
      });
    // console.log(
    //   totalCounts,
    //   productsList.length,
    //   totalCounts >= productsList.length
    // );
    setTotalCounts(totalCounts);
    if (results.length > 0) {
      setProductsList([...productsList, ...results]);
      results.forEach((obj) => {
        tags.push(...obj.tags);
      });
      setTags(Array.from(new Set(tags)));
    }
    // } finally {
    setShowLoader(false);
    // }
  };

  return (
    <>
      <Head>
        <title>
          {data?.category3?.meta?.title
            ? `${data?.category3?.meta?.title} | ${APP_NAME}`
            : `${data?.category3?.name} | ${APP_NAME}`}
        </title>
        <meta
          property="title"
          content={
            data?.category3?.meta?.title
              ? `${data?.category3?.meta?.title} | ${APP_NAME}`
              : `${data?.category3?.name} | ${APP_NAME}`
          }
          key="title"
        />
        <meta name="description" content={data?.category3?.meta?.description} />
      </Head>
      <div className="container category-main">
        <div className="category-sub">
          <div className="breadcrumbs">
            <ul className="text-capitalize">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <a className="disable">
                  {String(data.category1?.name).toLowerCase()}
                </a>
              </li>
              <li>
                <a className="disable">
                  {String(data.category2?.name).toLowerCase()}
                </a>
              </li>
              <li>{String(data.category3?.name).toLowerCase()}</li>
            </ul>
          </div>
          <div className="category-title-text">
            {/* <h3>{data.category3?.name}</h3> */}
            <div
              className="category-header-text pb-4 text-muted"
              dangerouslySetInnerHTML={{ __html: data?.category3?.description }}
            ></div>
          </div>
          {tags && tags.length > 0 && (
            <div className="category-sub-nav">
              <ul>
                <Slider {...settings}>
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          const index = selectedTags.indexOf(tag);
                          selectedTags.splice(index, 1);
                          setSelectedTags([...selectedTags]);
                          router.push({
                            pathname: window.location.pathname,
                            query:
                              selectedTags.length === 0
                                ? {}
                                : { tag: selectedTags.toString() },
                          });
                          return;
                        }
                        const updatedTags = [...selectedTags, tag];
                        setSelectedTags(updatedTags);
                        router.push({
                          pathname: window.location.pathname,
                          query:
                            updatedTags.length === 0
                              ? {}
                              : { tag: updatedTags.toString() },
                        });
                      }}
                    >
                      <a
                        className={
                          selectedTags.includes(tag)
                            ? "btn btn-primary"
                            : "btn btn-outline-primary"
                        }
                      >
                        {tag}
                        {selectedTags.includes(tag) && (
                          <FontAwesomeIcon
                            className="close-svg"
                            icon={faTimes}
                            height={10}
                          />
                        )}
                      </a>
                    </li>
                  ))}
                </Slider>
              </ul>
            </div>
          )}
          <div className="season-main">
            <div className="row">
              {productsList.map((product) => {
                return (
                  <ProductThumbnailView product={product} key={product?.id} />
                );
              })}
            </div>
            <div className="text-center mt-1 mb-4">
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
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  let data: ICategorySlugResponse;
  const categoryRef: any = params.categoryRef;
  const url = categoryRef.join("/").trim();
  let defaultURL: string = `${API_URL}/category/${url}/products?limit=${DEFAULT_PRODUCTS_LIMIT}&offset=${DEFAULT_OFFSET}`;
  if (query.tag) {
    defaultURL += `?tag=${query.tag}`;
  }
  // console.log("defaultURL", defaultURL);
  const response = await axios
    .get(encodeURI(defaultURL))
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch(() => {
      // console.log("Error", error);
      return {
        redirect: { permanent: false, destination: `/` },
      };
    });
  data = response.data;
  if (data.products && data.products.length > 0) {
    const allTags = [];
    data.products.forEach((obj) => {
      allTags.push(...obj.tags);
    });
    data.tags = Array.from(new Set(allTags));
  }

  return {
    props: { data: data || {} }, // will be passed to the page component as props
  };
};

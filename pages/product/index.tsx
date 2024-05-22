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
} from "../../config/constant";
import { ICategorySlugResponse, IProduct } from "../../models";
import { ProductThumbnailView } from "../../components/ProductThumbnailView";

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

export default function Product() {
  const router = useRouter();
  const search: any = router.query.search;
  const tag: any = router.query.tag;
  const category: any = router.query.category;
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
    infinite: tags?.length >= 13,
    speed: 500,
    slidesToShow: tags?.length >= 13 ? 13 : tags?.length || 0,
    slidesToScroll: 5,
    nextArrow: <SlickArrowRight />,
    prevArrow: <SlickArrowLeft />,
  };

  useEffect(() => {
    // console.log("calling", offset);
    getProducts();
  }, [offset]);

  const getProducts = async () => {
    // try {
    setShowLoader(true);
    let defaultURL: string = `${API_URL}/product?limit=${DEFAULT_PRODUCTS_LIMIT}&offset=${offset}`;
    if (category) {
      defaultURL += `&categoryIds=${category}`;
    }
    if (tag) {
      defaultURL += `&tag=${tag}`;
    }
    if (search) {
      defaultURL += `&search=${search}`;
    }
    // console.log("defaultURL", defaultURL);
    const { results, totalCounts } = await axios
      .get(encodeURI(defaultURL))
      .then((response: AxiosResponse) => {
        return response.data;
      });
    setTotalCounts(totalCounts);
    if (results.length > 0) {
      setProductsList([...productsList, ...results]);
      results.forEach((obj) => {
        obj.tags = obj?.tags || [];
        tags.push(...obj.tags);
      });
      setTags(Array.from(new Set(tags)));
    }
    // } finally {
    setShowLoader(false);
    // }
  };

  return (
    <div className="container category-main">
      <div className="category-sub">
        <div className="breadcrumbs">
          <p className="mb-3">
            Showing <b>{totalCounts} results</b>{" "}
            {search && 'for "' + search + '"'}
          </p>
        </div>
        {tags && tags.length > 0 && (
          <div className="category-sub-nav">
            <ul>
              <Slider {...settings}>
                {tags.map((tag) => (
                  <li
                    key={tag}
                    onClick={() => {
                      const params = router.query;
                      if (selectedTags.includes(tag)) {
                        const index = selectedTags.indexOf(tag);
                        selectedTags.splice(index, 1);
                        setSelectedTags([...selectedTags]);
                        if (selectedTags.length === 0) {
                          delete params.tag;
                        } else {
                          params.tag = selectedTags.toString();
                        }
                        router.push({
                          pathname: window.location.pathname,
                          query: params,
                        });
                        return;
                      }
                      const updatedTags = [...selectedTags, tag];
                      if (updatedTags.length > 0) {
                        setSelectedTags(updatedTags);
                      }
                      params.tag = updatedTags.toString();
                      router.push({
                        pathname: window.location.pathname,
                        query: params,
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
  );
}

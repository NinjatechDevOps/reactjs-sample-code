import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import axios, { AxiosResponse } from "axios";
import Slider from "react-slick";

import ImageSlider from "../../components/ImageSlider";
import MobileImageSlider from "../../components/MobileImageSlider";
import { ProductThumbnailView } from "../../components/ProductThumbnailView";
import {
  API_URL,
  APP_NAME,
  BASKET_ITEMS,
  DEFAULT_PAPER_SIZE,
} from "../../config/constant";
import {
  IBasket,
  ICardPrice,
  IInitialState,
  Image,
  IPersonalisationFields,
  IProduct,
  ISwatchItems,
  IPersonalisationImageItem,
  IBasketSwatch,
  IReviews,
  IReviewCount,
} from "../../models";
import { PURGE_AUTH, SET_BASKET_PRODUCT } from "../../store/actions";
import {
  dynamicSort,
  setAuthHeader,
  isArrayEqual,
  toCurrencyFormat,
  toTitleCase,
} from "../../config/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { InitForm } from "../../components/personalisationFIelds/initForm";
import { useWindowSize } from "../../components/hooks/window";
import { ReviewModal } from "../../components/reviews/ReviewModal";
import { ReviewList } from "../../components/reviews/ReviewList";

type Props = {
  product: IProduct;
  cardPrice: ICardPrice[];
};

export default function ProductDetail({ product }: Props) {
  // console.log("data", cardPrice);
  const router = useRouter();
  const dispatch = useDispatch();
  const initFormRef: any = useRef();
  const { width } = useWindowSize();
  const basketProducts: IBasket[] = useSelector(
    (state: IInitialState) => state.basketProducts
  );
  const cardPriceList: ICardPrice[] = useSelector((state: IInitialState) =>
    state.cardPriceList.filter((obj) => obj.type === product?.card?.cardType)
  );
  const currentUser = useSelector((state: IInitialState) => state.currentUser);
  const [currentTab, setCurrentTab] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [slickValue, setSlickValue] = useState<number>(0);
  const [showSubmitLoader, setShowSubmitLoader] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isOutOfStock, setIsOutOfStock] = useState<boolean>(false);
  const [showSwatchError, setShowSwatchError] = useState<boolean>(false);
  const [saveData, setSaveData] = useState<boolean>(true);
  const [showPersonalisationImageError, setShowPersonalisationImageError] =
    useState<boolean>(false);
  const [selectedSwatch, setSelectedSwatch] = useState<ISwatchItems>(null);
  const [swatchProducts, setSwatchProducts] = useState<ISwatchItems[]>([]);
  const [productImages, setProductImages] = useState<Image[]>([]);
  const [personalisationFields, setPersonalisationFields] = useState<
    IPersonalisationFields[]
  >([]);
  const [
    selectedPersonalisationImageSwatch,
    setSelectedPersonalisationImageSwatch,
  ] = useState<IPersonalisationImageItem>(null);
  const [personalisationImageSwatchList, setPersonalisationImageSwatchList] =
    useState<IPersonalisationImageItem[]>([]);
  const [additionalCost, setAdditionalCost] = useState<number>(0);
  const [selectedCardPriceInstance, setSelectedCardPriceInstance] =
    useState<ICardPrice>(null);
  const [selectedCardPrice, setSelectedCardPrice] = useState<string>(null);
  const [selectedPaperSize, setSelectedPaperSize] = useState<string>("1");
  const [isProductOnSale, setIsProductOnSale] = useState<boolean>(
    product.pricing.onSale
  );
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showReviewLoader, setShowReviewLoader] = useState<boolean>(false);
  const [reviewList, setReviewList] = useState<IReviews[]>([]);
  const [reviewAverage, setReviewAverage] = useState<IReviewCount>(null);
  const [totalReviewCount, setTotalReviewCount] = useState<number>(0);

  useEffect(() => {
    getReviews();
  }, []);

  useEffect(() => {
    if (!cardPriceList || cardPriceList.length === 0 || selectedCardPrice)
      return;
    const isDefault = cardPriceList.find((obj) => obj.isDefault);
    setSelectedCardPrice(isDefault?.id || cardPriceList[0]?.id);
    setSelectedCardPriceInstance(isDefault);
  }, [cardPriceList]);

  useEffect(() => {
    if (!cardPriceList) return;
    const instance = cardPriceList.find((obj) => obj.id === selectedCardPrice);
    if (instance) {
      setSelectedCardPriceInstance(instance);
      if (!product?.pricing?.onSale) {
        setIsProductOnSale(instance?.onSale);
      }
    }
  }, [selectedCardPrice]);

  useEffect(() => {
    const swatchItems = product?.swatch?.items || [];
    setCurrentTab(
      (product?.personalisationFields &&
        product?.personalisationFields.length > 0) ||
        (product?.personalisationImage.items &&
          product?.personalisationImage.items.length > 0) ||
        swatchItems.length > 0 ||
        product?.productType === "5"
        ? 2
        : 1
    );
    setSwatchProducts(swatchItems);
    let stockQty: number = product.stockQty;
    if (product?.bundleItems?.length > 0) {
      const lowestStock = product?.bundleItems.reduce(function (prev, curr) {
        return prev.stockQty > curr.stockQty ? prev : curr;
      });
      stockQty = lowestStock?.stockQty;
    }
    if (swatchItems.length > 0) {
      const checkStock = swatchItems.find((obj) => obj.product?.stockQty > 0);
      stockQty = checkStock?.product?.stockQty || 0;
    }
    setIsOutOfStock(stockQty > 0 ? false : true);
    const swatchImages: Image[] = swatchItems
      .filter((obj) => obj.product.stockQty > 0 && obj.altImage)
      .map((obj: ISwatchItems) => {
        return {
          product: obj.product,
          image: obj.altImage,
          altText: obj.swatchText,
        };
      });
    const personalisationImageSwatchItems =
      product?.personalisationImage?.items.map((obj) => {
        return {
          image: obj.displayImage,
          altText: obj.swatchName,
          personalisationImage: obj,
        };
      });
    const dropdownImages = [];
    product.personalisationFields.forEach((element) => {
      if (element.type === "2") {
        element.dropdownOptions.forEach((dropdown) => {
          if (dropdown.image) {
            dropdownImages.push(dropdown);
          }
        });
      }
    });
    const productImages = [
      ...product.images,
      ...swatchImages,
      ...personalisationImageSwatchItems,
      ...dropdownImages,
    ].sort(dynamicSort("-isDefault"));
    setProductImages(productImages);
    setPersonalisationImageSwatchList(product?.personalisationImage?.items);
    setPersonalisationFields(
      product?.personalisationFields ? product?.personalisationFields : []
    );
    if (
      router.query.personalisationImage &&
      product?.personalisationImage?.items.length > 0
    ) {
      const productId = router.query.personalisationImage;
      const selectedImageSwatch = product?.personalisationImage?.items.find(
        (obj: IPersonalisationImageItem) => obj._id === productId
      );
      if (selectedImageSwatch) {
        const index = productImages.findIndex(
          (obj: any) => obj.product && obj.product?.id === productId
        );
        setSelectedPersonalisationImageSwatch(selectedImageSwatch);
        setSlickValue(index);
      }
    }
    if (router.query.swatch && swatchItems.length > 0) {
      const productId = router.query.swatch;
      const selectedItem = swatchItems.find(
        (obj: ISwatchItems) => obj.product.id === productId
      );
      if (selectedItem) {
        const index = productImages.findIndex(
          (obj: any) => obj.product && obj.product?.id === productId
        );
        if (selectedItem?.product?.stockQty > 0) {
          setSelectedSwatch(selectedItem);
          setSlickValue(index);
        }
      }
    }
  }, [product]);

  const getReviews = async () => {
    setShowReviewLoader(true);
    try {
      const { results, totalCounts, reviewCounts } = await axios
        .get(
          `${API_URL}/reviews/${product?.id}?limit=2&offset=0&fetchCount=true`,
          setAuthHeader()
        )
        .then((res) => res.data);
      console.log(results, totalCounts, reviewCounts);
      setReviewList(results);
      setTotalReviewCount(totalCounts);
      setReviewAverage(reviewCounts);
    } catch (e) {
      setReviewList([]);
      setTotalReviewCount(0);
      setReviewAverage(null);
    } finally {
      setShowReviewLoader(false);
    }
  };

  const addToBasket = async (values: any = null) => {
    if (swatchProducts.length > 0 && !selectedSwatch) {
      setShowSwatchError(true);
      return;
    }
    if (
      product?.productType === "5" &&
      !selectedCardPrice &&
      !selectedPaperSize
    ) {
      return;
    }
    if (
      personalisationImageSwatchList?.length > 0 &&
      !selectedPersonalisationImageSwatch
    ) {
      setShowPersonalisationImageError(true);
      return;
    }
    setShowSubmitLoader(true);
    if (!currentUser) {
      const basketProductsLists: any =
        JSON.parse(localStorage.getItem(BASKET_ITEMS)) || [];
      let productExists = false;
      if (selectedSwatch) {
        for (const index in basketProductsLists) {
          const element = basketProductsLists[index];
          if (
            String(element.product.id) !== String(product.id) &&
            String(element.swatchProduct) !==
              String(selectedSwatch?.product?.id)
          ) {
            continue;
          }
          const isProductSame = isArrayEqual(
            element.personalisationFields.map((obj) => {
              return { value: obj.value, id: obj.id };
            }),
            values
          );
          if (isProductSame) {
            productExists = true;
            basketProductsLists[index].quantity = quantity;
            break;
          }
        }
        if (!productExists) {
          const { swatch } = JSON.parse(JSON.stringify(product));
          const swatchItem = {
            name: swatch.name,
            items: [...swatch.items].map((obj: any) => {
              obj.product = obj.product.id;
              return obj;
            }),
          };
          basketProductsLists.push({
            _id: String(Date.now()),
            product: { ...product, swatch: swatchItem },
            quantity: quantity,
            personalisationFields: values || [],
            swatchProduct: selectedSwatch?.product?.id,
            personalisationImageSwatch: null,
          });
        }
      } else if (personalisationImageSwatchList.length > 0) {
        for (const index in basketProductsLists) {
          const element = basketProductsLists[index];
          if (
            String(element.product.id) !== String(product.id) &&
            String(element.personalisationImageSwatch) !==
              String(selectedPersonalisationImageSwatch?._id)
          ) {
            continue;
          }
          const isProductSame = isArrayEqual(
            element.personalisationFields.map((obj) => {
              return { value: obj.value, id: obj.id };
            }),
            personalisationFields
          );
          if (isProductSame) {
            productExists = true;
            basketProductsLists[index].quantity = quantity;
            break;
          }
        }
        if (!productExists) {
          productExists = false;
          basketProductsLists.push({
            _id: String(Date.now()),
            product: product,
            quantity: quantity,
            personalisationFields: values || [],
            swatchProduct: null,
            personalisationImageSwatch: selectedPersonalisationImageSwatch?._id,
          });
        }
      } else if (product?.productType === "5") {
        for (const index in basketProductsLists) {
          const element = basketProductsLists[index];
          if (element.product.id !== product.id) {
            continue;
          }
          const { cardPrice, paperSize } = element.card || {};
          if (
            selectedCardPrice === cardPrice &&
            paperSize === selectedPaperSize
          ) {
            productExists = true;
            basketProductsLists[index].quantity = quantity;
            break;
          }
        }
        if (!productExists) {
          const swatch: IBasketSwatch = {
            name: product.swatch.name,
            items: product.swatch.items.map((obj) => {
              let data = { ...obj, product: obj.product.id };
              return data;
            }),
          };
          const basketData: IBasket = {
            _id: String(Date.now()),
            product: {
              id: product.id,
              name: product.name,
              sku: product.sku,
              pricing: product.pricing,
              images: product.images,
              swatch: { ...swatch },
              personalisationFields: product.personalisationFields,
              personalisationImage: product.personalisationImage,
              productType: product.productType,
              linkedProducts: product.linkedProducts,
            },
            quantity: quantity,
            personalisationFields: values || [],
            swatchProduct: null,
            personalisationImageSwatch: null,
            card: {
              cardPrice: selectedCardPrice,
              paperSize: selectedPaperSize,
            },
          };
          basketProductsLists.push(basketData);
        }
      } else {
        for (const index in basketProductsLists) {
          const element = basketProductsLists[index];
          if (element.product.id !== product.id) {
            continue;
          }
          const isProductSame = isArrayEqual(
            element.personalisationFields.map((obj) => {
              return { value: obj.value, id: obj.id };
            }),
            personalisationFields
          );
          if (isProductSame) {
            productExists = true;
            basketProductsLists[index].quantity = quantity;
            break;
          }
        }
        if (!productExists) {
          const swatch: IBasketSwatch = {
            name: product.swatch.name,
            items: product.swatch.items.map((obj) => {
              let data = { ...obj, product: obj.product.id };
              return data;
            }),
          };
          const basketData: IBasket = {
            _id: String(Date.now()),
            product: {
              id: product.id,
              name: product.name,
              sku: product.sku,
              pricing: product.pricing,
              images: product.images,
              swatch: { ...swatch },
              personalisationImage: product.personalisationImage,
              productType: product.productType,
              linkedProducts: product.linkedProducts,
              personalisationFields: product.personalisationFields,
            },
            quantity: quantity,
            personalisationFields: values || [],
            swatchProduct: null,
            personalisationImageSwatch: null,
          };
          if (product?.productType === "5") {
            basketData.card = {
              cardPrice: selectedCardPrice,
              paperSize: selectedPaperSize,
            };
          }
          basketProductsLists.push(basketData);
        }
      }
      const basketProduct = basketProductsLists.map((element: IBasket) => {
        const data: IBasket = {
          product: element.product,
          swatchProduct: element?.swatchProduct || null,
          personalisationImageSwatch:
            element.personalisationImageSwatch || null,
          quantity: element.quantity,
          personalisationFields: element.personalisationFields,
        };
        if (element.card) {
          data.card = element.card;
        }
        return data;
      });
      setSaveData(false);
      localStorage.setItem(
        BASKET_ITEMS,
        JSON.stringify([...basketProductsLists])
      );
      localStorage.removeItem(`${router.query.productSku}`);
      dispatch({ type: SET_BASKET_PRODUCT, value: [...basketProduct] });
      // router.push(`/sign-in?next=${window.location.pathname}`);
      setTimeout(() => {
        setShowSubmitLoader(false);
      }, 5000);
      return;
    }
    setSaveData(false);
    localStorage.removeItem(`${router.query.productSku}`);
    setShowSwatchError(false);
    setIsSubmitted(true);
    const data: any = {
      product: product.id,
      quantity: quantity,
      swatchProduct: null,
      personalisationFields: values || [],
      personalisationImageSwatch: null,
      card: {
        cardPrice: selectedCardPrice,
        paperSize: selectedPaperSize,
      },
    };
    if (selectedSwatch) {
      data.swatchProduct = selectedSwatch?.product?.id;
    }
    if (selectedPersonalisationImageSwatch) {
      data.personalisationImageSwatch = selectedPersonalisationImageSwatch?._id;
    }
    try {
      const { totalQuantity, productExists } = await axios
        .post(`${API_URL}/basket`, data, setAuthHeader())
        .then((res) => res.data);
      if (productExists) {
        let index = null;
        if (product.productType === "5") {
          index = basketProducts.findIndex(
            (obj) =>
              obj.product.id == product.id &&
              obj?.card?.cardPrice === selectedCardPrice &&
              obj?.card?.paperSize === selectedPaperSize
          );
        } else {
          index = basketProducts.findIndex(
            (obj) => obj.product.id == product.id
          );
        }
        basketProducts[index].quantity = totalQuantity;
      } else {
        const swatch: IBasketSwatch = {
          name: product.swatch.name,
          items: product.swatch.items.map((obj) => {
            let data = { ...obj, product: obj.product.id };
            return data;
          }),
        };
        basketProducts.push({
          product: {
            id: product.id,
            name: product.name,
            sku: product.sku,
            pricing: product.pricing,
            images: product.images,
            swatch: { ...swatch },
            personalisationImage: product.personalisationImage,
            productType: product.productType,
          },
          swatchProduct: selectedSwatch?.product?.id || null,
          personalisationImageSwatch: selectedPersonalisationImageSwatch?._id,
          quantity: quantity,
          card: {
            cardPrice: selectedCardPrice,
            paperSize: selectedPaperSize,
          },
        });
      }
      dispatch({
        type: SET_BASKET_PRODUCT,
        value: [...basketProducts],
      });
    } catch (e: any) {
      // console.log(e);
      if (e.response.status === 401) {
        dispatch({ type: PURGE_AUTH });
        router.push(`/sign-in?next=${window.location.pathname}`);
      }
    } finally {
      setTimeout(() => {
        setShowSubmitLoader(false);
      }, 5000);
    }
  };

  let currentTabTexts: any = <></>;
  if (currentTab === 1) {
    currentTabTexts = (
      <>
        <div
          className="Description-tab"
          dangerouslySetInnerHTML={{
            __html: product?.description,
          }}
        ></div>
        <div className="mt-3 mb-3 d-none product-sku">SKU: {product?.sku}</div>
      </>
    );
  } else if (currentTab === 2) {
    currentTabTexts = (
      <div className="personalise-tab">
        <div className="personalise-block">
          {product?.productType === "5" ? (
            <>
              <p className="text-center text-muted mb-3">
                Size:{" "}
                {selectedCardPrice && (
                  <b>
                    {
                      cardPriceList.find(
                        (element) => element.id === selectedCardPrice
                      )?.size
                    }
                  </b>
                )}
              </p>
              {cardPriceList.map((element, index) => {
                return (
                  <div
                    key={element.id}
                    className={`card-price-box${
                      selectedCardPrice === element.id ? " active" : ""
                    }`}
                    onClick={() => setSelectedCardPrice(element.id)}
                  >
                    <div className="pe-2">
                      <div className="radio">
                        <input
                          name="radio"
                          id={`radio${element.id}`}
                          type="radio"
                          checked={selectedCardPrice === element.id}
                          readOnly={true}
                        />
                        <label htmlFor={`radio${index}`}>&nbsp;</label>
                      </div>
                    </div>
                    <div className="p-2 flex-grow-1">
                      <p className="f-w-500 pb-1">{element?.size}</p>
                    </div>
                    <div className="ml-auto">
                      {element?.onSale
                        ? toCurrencyFormat(element.salePrice)
                        : toCurrencyFormat(element.sellPrice)}
                    </div>
                  </div>
                );
              })}
              <p className="text-center text-muted mt-2 mb-2">
                Finish:{" "}
                {selectedPaperSize && (
                  <b>
                    {
                      DEFAULT_PAPER_SIZE.find(
                        (obj) => obj.value === selectedPaperSize
                      )?.label
                    }
                  </b>
                )}
              </p>
              <div className="paper-row">
                <div className="row">
                  {DEFAULT_PAPER_SIZE.map((element, index) => {
                    return (
                      <div
                        className={`col-lg-6${
                          selectedPaperSize === element.value ? " active" : ""
                        }`}
                        key={index}
                        onClick={() => setSelectedPaperSize(element.value)}
                      >
                        <div className="pe-3">
                          <div className="radio">
                            <input
                              name="paperRadio"
                              id={`radio${index}`}
                              type="radio"
                              checked={selectedPaperSize === element.value}
                              readOnly={true}
                            />
                            <label htmlFor={`radio${index}`}>&nbsp;</label>
                          </div>
                        </div>
                        {element?.label}
                      </div>
                    );
                  })}
                </div>
              </div>
              {product.templateSKU && (
                <div className="personalise-btn">
                  <Link
                    href={`/personalisation/${product.templateSKU}?productSKU=${product.sku}`}
                  >
                    <a className="btn btn-primary">Personalise</a>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="f-14">Complete your personalisation:</p>
              <div className="personalise-tab-content mt-4 mb-4">
                <div className="personalise-box">
                  {product?.swatch?.name && product?.swatch?.items.length > 0 && (
                    <p>
                      {product?.swatch?.name}
                      {selectedSwatch ? " - " + selectedSwatch?.swatchText : ""}
                    </p>
                  )}
                  {product?.personalisationImage?.name &&
                    product?.personalisationImage?.items.length > 0 && (
                      <p>
                        {product?.personalisationImage?.name}
                        {selectedPersonalisationImageSwatch &&
                          ` - ${selectedPersonalisationImageSwatch?.swatchName} [${selectedPersonalisationImageSwatch?.swatchCode}]`}
                      </p>
                    )}
                  <div className="swatch-img mt-2">
                    {swatchProducts.map((element: ISwatchItems, i) => {
                      let image = element?.product?.images.find(
                        (obj) => obj.isSwatchImage
                      );
                      let defaultClass = "";
                      if (element?.product?.stockQty < 1) {
                        defaultClass = "unavailable";
                      }
                      if (
                        selectedSwatch?.product?.id === element?.product?.id
                      ) {
                        defaultClass = "active";
                      }
                      return (
                        <img
                          key={i}
                          alt={image?.altText || element?.swatchText}
                          src={image?.image || element?.altImage}
                          className={defaultClass}
                          onClick={() => {
                            if (element?.product?.stockQty <= 0) return;
                            const index = productImages.findIndex(
                              (obj: any) =>
                                obj.product &&
                                obj.product?.id === element?.product?.id
                            );
                            // console.log('setSelectedSwatch calling', element);
                            setSelectedSwatch(element);
                            if (index !== -1) {
                              setSlickValue(index);
                            }
                            setShowSwatchError(false);
                          }}
                        />
                      );
                    })}
                    {personalisationImageSwatchList.map(
                      (element: IPersonalisationImageItem, i) => {
                        let defaultClass = "";
                        if (
                          selectedPersonalisationImageSwatch?._id ===
                          element?._id
                        ) {
                          defaultClass = "active";
                        }
                        return (
                          <img
                            key={i}
                            alt={element?.swatchName}
                            src={element?.swatchImage}
                            className={defaultClass}
                            onClick={() => {
                              const index = productImages.findIndex(
                                (obj: any) =>
                                  obj.personalisationImage &&
                                  obj.personalisationImage?._id === element?._id
                              );
                              setSelectedPersonalisationImageSwatch(element);
                              if (index !== -1) {
                                setSlickValue(index);
                              }
                              setShowPersonalisationImageError(false);
                            }}
                          />
                        );
                      }
                    )}
                  </div>
                  {showSwatchError && (
                    <p className="text-danger mt-2">
                      Please select your {product?.swatch?.name} before adding
                      to basket
                    </p>
                  )}
                  {showPersonalisationImageError && (
                    <p className="text-danger mt-2">
                      Please select your {product?.personalisationImage?.name}{" "}
                      before adding to basket
                    </p>
                  )}
                </div>
              </div>
              <InitForm
                fields={personalisationFields}
                isSubmitted={isSubmitted}
                onSave={(e) => addToBasket(e)}
                ref={initFormRef}
                saveData={saveData}
                onSetAdditionalCost={(value) => setAdditionalCost(value)}
                onSetImage={(image) => {
                  const index = productImages.findIndex(
                    (obj: any) => obj.image === image
                  );
                  setSlickValue(index);
                }}
              />
            </>
          )}
        </div>
      </div>
    );
  } else if (currentTab === 3) {
    if (showReviewLoader) {
      currentTabTexts = <p>Loading...</p>;
    } else if (totalReviewCount === 0) {
      currentTabTexts = <p>No Review Founds</p>;
    } else {
      currentTabTexts = (
        <>
          <div className="reviews-tab">
            <ReviewList
              reviewCount={reviewAverage}
              totalCount={totalReviewCount}
              reviews={reviewList}
            />
            {totalReviewCount > 2 && (
              <div className="text-center mt-3">
                <button
                  className="btn btn-primary see-more-btn"
                  onClick={() => setShowReviewModal(true)}
                >
                  See More
                </button>
              </div>
            )}
          </div>
          {showReviewModal && (
            <ReviewModal
              reviewCount={reviewAverage}
              productId={product.id}
              show={showReviewModal}
              onHide={() => setShowReviewModal(false)}
            />
          )}
        </>
      );
    }
  }

  return (
    <>
      <Head>
        <title>
          {product?.meta?.title
            ? `${product?.meta?.title} | ${APP_NAME}`
            : `${toTitleCase(product?.name)} | ${APP_NAME}`}
        </title>
        <meta
          property="title"
          content={`${product?.meta?.title}`}
          key="title"
        />
        <meta
          key="description"
          name="description"
          content={product?.meta?.description}
        />
      </Head>
      <div className="container">
        <div className="breadcrumbs">
          <ul>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li className="text-capitalize">{product?.name}</li>
          </ul>
        </div>
      </div>
      <div className="product-head">
        <div className="container">
          <div className="product-slider border-bottom pb-5">
            <div className="row">
              <div className="col-lg-5">
                <div className="product-slider-thumbnail">
                  {width <= 768 ? (
                    <MobileImageSlider
                      images={productImages || []}
                      slickValue={slickValue}
                      stockQty={product?.stockQty}
                      onSale={isProductOnSale}
                      isOutOfStock={isOutOfStock}
                      isNewProduct={product?.isNewProduct || false}
                      productType={product?.productType}
                      onChangeImage={(productId) => {
                        if (swatchProducts?.length > 0) {
                          const selectedProduct = swatchProducts.find(
                            (element: ISwatchItems) =>
                              element?.product?.id === productId
                          );
                          setSelectedSwatch(
                            selectedProduct?.product?.stockQty > 0
                              ? selectedProduct
                              : selectedSwatch || null
                          );
                        }
                      }}
                    />
                  ) : (
                    <ImageSlider
                      images={productImages || []}
                      slickValue={slickValue}
                      stockQty={product?.stockQty}
                      onSale={isProductOnSale}
                      isOutOfStock={isOutOfStock}
                      isNewProduct={product?.isNewProduct || false}
                      productType={product?.productType}
                      onChangeImage={(productId) => {
                        if (swatchProducts?.length > 0) {
                          const selectedProduct = swatchProducts.find(
                            (element: ISwatchItems) =>
                              element?.product?.id === productId
                          );
                          setSelectedSwatch(
                            selectedProduct?.product?.stockQty > 0
                              ? selectedProduct
                              : selectedSwatch || null
                          );
                        }
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="col-lg-7">
                <div className="product-details mt-3">
                  <div className="product-details-title">
                    <h3>{product?.name}</h3>
                    {product.productType === "5" ? (
                      selectedCardPriceInstance?.onSale ? (
                        <>
                          <div className="text-primary">
                            {toCurrencyFormat(
                              selectedCardPriceInstance?.salePrice
                            )}
                            <del className="text-muted">
                              {toCurrencyFormat(
                                selectedCardPriceInstance?.sellPrice
                              )}
                            </del>
                          </div>
                        </>
                      ) : (
                        <div className="text-primary">
                          {toCurrencyFormat(
                            selectedCardPriceInstance?.sellPrice
                          )}
                        </div>
                      )
                    ) : product.pricing.onSale ? (
                      <>
                        <div className="text-primary">
                          {toCurrencyFormat(
                            product?.pricing?.grossSalePrice + additionalCost
                          )}
                          <del className="text-muted">
                            {toCurrencyFormat(
                              product?.pricing?.grossSellPrice + additionalCost
                            )}
                          </del>
                        </div>
                      </>
                    ) : (
                      <div className="text-primary">
                        {toCurrencyFormat(
                          product?.pricing?.grossSellPrice + additionalCost
                        )}
                      </div>
                    )}
                  </div>
                  <div className="product-info">
                    <div className="product-stock m-none">
                      {/* <span className="d-block">
                        {product?.stockQty === 0 ? "Out Of Stock" : "In Stock"}
                      </span> */}
                      <span className="text-uppercase">
                        SKU: {product?.sku}
                      </span>
                      {product?.designer?.name && (
                        <div className="designer-text">
                          <span>Design By</span>
                          <Link href={`/designer/${product.designer.id}`}>
                            <a>{product?.designer?.name}</a>
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="product-bottom">
                      <div className="quantity m-none">
                        <div className="main">
                          <button
                            className="down_count basket-btn"
                            aria-label="Increase"
                            onClick={() =>
                              setQuantity(quantity > 1 ? quantity - 1 : 1)
                            }
                          >
                            {/* <i className="fa fa-minus"></i> */}
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                          <input
                            className="counter"
                            type="text"
                            value={quantity}
                            readOnly={true}
                          />
                          <button
                            className="up_count basket-btn"
                            aria-label="Decrease"
                            onClick={() => setQuantity(quantity + 1)}
                          >
                            {/* <i className="fa fa-plus"></i> */}
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                      </div>
                      {!isOutOfStock && (
                        <div className="add-basket-btn m-none ">
                          <button
                            type="button"
                            className={`btn btn-primary btn-sm cart-button ${
                              showSubmitLoader ? "clicked" : ""
                            }`}
                            // aria-label="Add to Basket"
                            onClick={() => {
                              if (personalisationFields.length === 0) {
                                addToBasket();
                              } else {
                                if (currentTab !== 2) {
                                  setCurrentTab(2);
                                  setTimeout(() => {
                                    initFormRef.current.handleSubmit();
                                  }, 100);
                                } else {
                                  initFormRef.current.handleSubmit();
                                }
                              }
                            }}
                            disabled={showSubmitLoader}
                          >
                            {/* {showSubmitLoader ? "Adding.." : "Add to Basket"} */}
                            {showSubmitLoader ? (
                              <>
                                <span className="added">Item added</span>
                                <i className="fa fa-shopping-cart"></i>
                                <i className="fa fa-square"></i>
                              </>
                            ) : (
                              <span className="add-to-cart">Add to Basket</span>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="product-details-text">
                    <div className="product-details-tab">
                      <div className="product-tab-head">
                        <div className="row">
                          {(product?.productType === "5" ||
                            personalisationFields.length > 0 ||
                            product?.swatch?.items.length > 0) && (
                            <div
                              className="col-lg-4 col-4 text-center"
                              onClick={() => setCurrentTab(2)}
                            >
                              <div
                                className={`product-tab-title ${
                                  currentTab === 2 ? "active" : ""
                                }`}
                              >
                                <h3 className="m-0">Personalise</h3>
                              </div>
                            </div>
                          )}
                          <div
                            className={`${
                              product?.productType === "5" ||
                              personalisationFields.length > 0 ||
                              product?.swatch?.items?.length > 0
                                ? "col-lg-4 col-4"
                                : "col-lg-6 col-6"
                            } text-center`}
                            onClick={() => setCurrentTab(1)}
                          >
                            <div
                              className={`product-tab-title ${
                                currentTab === 1 ? "active" : ""
                              }`}
                            >
                              <h3 className="m-0">Description</h3>
                            </div>
                          </div>
                          <div
                            className={`${
                              product?.productType === "5" ||
                              personalisationFields.length > 0 ||
                              product?.swatch?.items?.length > 0
                                ? "col-lg-4 col-4"
                                : "col-lg-6 col-6"
                            } text-center`}
                            onClick={() => setCurrentTab(3)}
                          >
                            <div
                              className={`product-tab-title ${
                                currentTab === 3 ? "active" : ""
                              }`}
                            >
                              <h3 className="m-0">Reviews</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-content">{currentTabTexts}</div>
                    </div>
                  </div>
                  <div className="d-none">
                    {!isOutOfStock && (
                      <div className="add-basket-btn">
                        <button
                          type="button"
                          className={`btn btn-primary btn-sm cart-button ${
                            showSubmitLoader ? "clicked" : ""
                          }`}
                          // aria-label="Add to Basket"
                          onClick={() => {
                            if (personalisationFields.length === 0) {
                              addToBasket();
                            } else {
                              if (currentTab !== 2) {
                                setCurrentTab(2);
                                setTimeout(() => {
                                  initFormRef.current.handleSubmit();
                                }, 100);
                              } else {
                                initFormRef.current.handleSubmit();
                              }
                            }
                          }}
                          disabled={showSubmitLoader}
                        >
                          {/* {showSubmitLoader ? "Adding.." : "Add to Basket"} */}
                          {showSubmitLoader ? (
                            <>
                              <span className="added">Item added</span>
                              <i className="fa fa-shopping-cart"></i>
                              <i className="fa fa-square"></i>
                            </>
                          ) : (
                            <span className="add-to-cart">Add to Basket</span>
                          )}
                        </button>
                      </div>
                    )}
                    {product?.designer?.name && (
                      <Link href={`/designer/${product.designer.id}`}>
                        <div className="designer-detail">
                          <div className="d-flex align-items-center">
                            <img
                              className="img-circle"
                              height="50"
                              src={product.designer?.image?.profilePicture}
                              alt="Profile"
                            />
                            <div className="ml-3">
                              <p className="text-primary">Designer By</p>
                              <p>{product.designer?.name}</p>
                            </div>
                          </div>
                          <div className="float-right mt-2">
                            <FontAwesomeIcon
                              height={16}
                              icon={faChevronRight}
                            />
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {product.linkedProducts && product.linkedProducts.length > 0 && (
        <div className="product-related">
          <div className="container">
            <div className="title-main mt-4">
              <h2 className="text-center mb-4">Related Products</h2>
            </div>
            <div className="season-main">
              <div className="row">
                {width < 768 ? (
                  <Slider
                    infinite={false}
                    swipeToSlide={true}
                    arrows={false}
                    focusOnSelect={true}
                    lazyLoad={true}
                    slidesToShow={2}
                    slidesToScroll={1}
                  >
                    {product.linkedProducts.map((product) => {
                      return (
                        <ProductThumbnailView
                          product={product}
                          key={product?.id}
                        />
                      );
                    })}
                  </Slider>
                ) : (
                  product.linkedProducts.map((product) => {
                    return (
                      <ProductThumbnailView
                        product={product}
                        key={product?.id}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <div className="testimonial">
        <div className="container">
          <div className="testimonial-block mt-5 mb-4">
            <div className="row">
              <div className="col-lg-3">
                <div className="testimonial-overview">
                  <h3>TRUSTED SELLER</h3>
                  <div className="start-reading">
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </div>
                  <p>19842 customer reviews</p>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="testimonial-box">
                  <div className="start-reading">
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </div>
                  <p>
                    De laudisciis et a ipsuntiunt. Citatemperis aut pra duciis
                    veliqui ulliciis re imus aut ipiendam, que conseru
                    ptiustiorro eum.
                  </p>
                  <h4>Clare Higgins</h4>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="testimonial-box">
                  <div className="start-reading">
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </div>
                  <p>
                    De laudisciis et a ipsuntiunt. Citatemperis aut pra duciis
                    veliqui ulliciis re imus aut ipiendam, que conseru
                    ptiustiorro eum.
                  </p>
                  <h4>Clare Higgins</h4>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="testimonial-box">
                  <div className="start-reading">
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </div>
                  <p>
                    De laudisciis et a ipsuntiunt. Citatemperis aut pra duciis
                    veliqui ulliciis re imus aut ipiendam, que conseru
                    ptiustiorro eum.
                  </p>
                  <h4>Clare Higgins</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  let defaultURL: string = `${API_URL}/product/${
    params.productSku
  }?linkedProducts=${true}&checkBasket=${true}`;
  try {
    const response = await axios
      .get(defaultURL, setAuthHeader(req?.cookies))
      .then((response: AxiosResponse) => {
        return response.data || null;
      });
    return {
      props: { ...response.data },
    };
  } catch {
    return { redirect: { permanent: false, destination: "/404" } };
  }
};

import Link from "next/link";
import React, { useState } from "react";
import { IProduct } from "../models";
import { CardThumbnailView } from "./CardThumbnailView";
import { useWindowSize } from "./hooks/window";
import { toCurrencyFormat } from "../config/utils";

type Props = {
  product: IProduct;
};

export const ProductThumbnailView = ({ product }: Props) => {
  if (!product || !product?.name) return <></>;
  const [showButton, setShowButton] = useState<boolean>(false);
  const { width } = useWindowSize();
  const defaultText = width < 768 ? 14 : 20;

  if (product.productType === "5") {
    return <CardThumbnailView product={product} />;
  }
  let defaultImage: string;
  let altText: string;
  let stockQty: number = product.stockQty;
  if (product?.bundleItems?.length > 0) {
    const lowestStock = product?.bundleItems.reduce(function (prev, curr) {
      return prev.stockQty > curr.stockQty ? prev : curr;
    });
    stockQty = lowestStock?.stockQty;
  }
  if (product.images && product.images.length > 0) {
    const image = product.images.find((image) => image.isDefault);
    defaultImage = image ? image.image : product.images[0].image;
    altText = image ? image.altText : product.images[0].altText;
  }
  const swatchItems = product?.swatch?.items || [];
  if (swatchItems.length > 0) {
    const checkStock = swatchItems.find((obj) => obj.product?.stockQty > 0);
    stockQty = checkStock?.product?.stockQty || 0;
  }
  if (!defaultImage) defaultImage = "/images/product_image_1.jpg";
  if (!product || !product?.name) return <></>;
  let productClass = "product d-flex flex-column";
  if (!stockQty || stockQty <= 0) {
    productClass += " out-of-stock";
  } else if (product.pricing.onSale) {
    productClass += " on-sale";
  } else if (product.isNewProduct) {
    productClass += " new-product";
  }

  return (
    <>
      <div
        className="col text-center"
        onMouseEnter={() => setShowButton(true)}
        onMouseLeave={() =>
          setTimeout(() => {
            setShowButton(false);
          }, 100)
        }
      >
        <Link href={`/product/${product.sku}`}>
          <a>
            <span className={productClass}>
              <img src={defaultImage} alt={altText} className="product__img" />
              {product.personalisationFields?.length > 0 && (
                <img
                  src="/images/personalise.svg"
                  alt="personalise"
                  className="product__personalise_img"
                />
              )}
              <div className="product-text">
                {width < 768 ? (
                  <h3 style={{ whiteSpace: "pre-wrap" }}>
                    {product?.name}
                    {/* {product?.name.length > 15
                      ? product?.name
                      : product?.name.split(" ").join("\n")} */}
                  </h3>
                ) : (
                  <h3>
                    {showButton
                      ? product?.name
                      : product?.name.length > defaultText
                      ? String(product?.name).substring(0, defaultText) + "..."
                      : product?.name}
                  </h3>
                )}
                {product.pricing.onSale ? (
                  <p>
                    <span className="text-primary me-2">
                      {toCurrencyFormat(product?.pricing?.grossSalePrice)}
                    </span>
                    <del className="text-muted">
                      {toCurrencyFormat(product?.pricing?.grossSellPrice)}
                    </del>
                  </p>
                ) : (
                  <p>{toCurrencyFormat(product?.pricing?.grossSellPrice)}</p>
                )}
                <div className="btn-shop-now">
                  <button className="btn btn-sm btn-primary">Shop Now</button>
                </div>
              </div>
            </span>
          </a>
        </Link>
      </div>
    </>
  );
};

import Link from "next/link";

import React from "react";
import { useSelector } from "react-redux";

import { IInitialState, IProduct } from "../models";

type Props = {
  product: IProduct;
};

export const CardThumbnailView = ({ product }: Props) => {
  if (!product || !product?.name) return <></>;
  const cardPriceList = useSelector(
    (state: IInitialState) => state.cardPriceList
  );

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
  let productClass = "product-card";
  if (!stockQty || stockQty <= 0) {
    productClass += " out-of-stock";
  } else if (product.pricing.onSale) {
    productClass += " on-sale";
  } else if (product.isNewProduct) {
    productClass += " new-product";
  }

  return (
    <>
      <div className="col text-center">
        <Link href={`/product/${product.sku}`}>
          <a>
            <div className={productClass}>
              <img
                src={defaultImage}
                alt={altText}
                className="product-card__img"
              />
            </div>
          </a>
        </Link>
      </div>
    </>
  );
};

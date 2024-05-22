import React, { Component } from "react";
import Slider from "react-slick";
import { Image } from "../models";

export default class MobileImageSlider extends Component<{
  images: Array<Image>;
  slickValue: number;
  stockQty?: number;
  onSale?: boolean;
  isNewProduct?: boolean;
  isOutOfStock?: boolean;
  onChangeImage: any;
  productType?: string;
}> {
  currentSlider: any = null;

  constructor(props: any) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    const { slickValue } = this.props;
    if (prevProps?.slickValue !== slickValue) {
      this.currentSlider.slickGoTo(slickValue);
    };
  }

  onChange(index) {
    const { images, onChangeImage } = this.props;
    const product = images[index]?.product;
    if (!product || product?.stockQty < 1) onChangeImage(null);
    onChangeImage(images[index]?.product?.id);
  }

  render() {
    const { images, isOutOfStock, onSale, isNewProduct, productType } =
      this.props;
    let imgClassName = "";
    if (isOutOfStock) {
      imgClassName += "out-of-stock";
    } else if (onSale) {
      imgClassName += "on-sale";
    } else if (isNewProduct) {
      imgClassName += "new-product";
    }
    return (
      <Slider
        infinite={true}
        swipeToSlide={true}
        arrows={false}
        focusOnSelect={true}
        lazyLoad={true}
        dots={true}
        beforeChange={(current, next) => this.onChange(next)}
        ref={(slider: any) => (this.currentSlider = slider)}
      >
        {images.map((img, index) => {
          return (
            <a key={index} className={imgClassName}>
              <img
                src={img.image}
                alt={img.altText}
                className={`product-thumbnail ${
                  productType === "5" ? "no-border" : ""
                }`}
              />
            </a>
          );
        })}
      </Slider>
    );
  }
}

import React, { Component } from "react";
import Slider from "react-slick";
import { Image } from "../models";

export default class ImageSlider extends Component<
  {
    images: Array<Image>;
    slickValue: number;
    stockQty?: number;
    onSale?: boolean;
    isNewProduct?: boolean;
    isOutOfStock?: boolean;
    onChangeImage: any;
    productType?: string;
  },
  { nav1: any; nav2: any }
> {
  slider1: any = null;
  slider2: any = null;

  constructor(props: any) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null,
    };
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2,
    });
  }

  componentDidUpdate(prevProps) {
    const { slickValue } = this.props;
    if (prevProps.slickValue !== slickValue) {
      this.slider2.slickGoTo(slickValue);
    }
  }

  onChange(index) {
    const { images, onChangeImage } = this.props;
    const product = images[index]?.product;
    if (!product || product?.stockQty < 1) onChangeImage(null);
    onChangeImage(images[index]?.product?.id);
  }

  render() {
    const { nav2, nav1 } = this.state;
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
      <>
        <ul className="bxslider">
          <Slider
            asNavFor={nav2}
            ref={(slider: any) => (this.slider1 = slider)}
            arrows={false}
            beforeChange={(current, next) => this.onChange(next)}
          >
            {images.map((img, index) => {
              return (
                <div key={index}>
                  <li className={imgClassName}>
                    <img
                      className={`product-thumbnail ${
                        productType === "5" ? "no-border" : ""
                      }`}
                      src={img.image || "/images/promo_image_1.jpg"}
                      alt={img.altText || ""}
                    />
                  </li>
                </div>
              );
            })}
          </Slider>
        </ul>
        <div className="bx-pager">
          <Slider
            asNavFor={nav1}
            infinite={images.length > 4}
            ref={(slider: any) => (this.slider2 = slider)}
            slidesToShow={4}
            swipeToSlide={true}
            arrows={false}
            focusOnSelect={true}
            lazyLoad={true}
          >
            {images.map((img, index) => {
              return (
                <div key={index}>
                  <a>
                    <img
                      src={img.image || "/images/promo_image_1.jpg"}
                      alt={img.altText || ""}
                    />
                  </a>
                </div>
              );
            })}
          </Slider>
        </div>
      </>
    );
  }
}

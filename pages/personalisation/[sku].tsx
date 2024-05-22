import { GetServerSideProps } from "next";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import axios, { AxiosResponse } from "axios";

import { useWindowSize } from "../../components/hooks/window";
import { FullScreenPersonalisation } from "../../components/personalisation/FullScreenPersonalisation";
import { MobilePersonalisation } from "../../components/personalisation/MobilePersonalisation";
import { API_URL } from "../../config/constant";
import { setAuthHeader } from "../../config/utils";
import { SET_TEMPLATE_CARD_TYPE, SHOW_FOOTER } from "../../store/actions";
import { IProduct } from "../../models";

type Props = {
  template: any;
  product: IProduct;
};

export default function Personalisation({ template, product }: Props) {
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState<boolean>(true);

  useEffect(() => {
    dispatch({ type: SHOW_FOOTER, value: false });
    dispatch({ type: SET_TEMPLATE_CARD_TYPE, value: product.card?.cardType });
    return () => {
      dispatch({ type: SHOW_FOOTER, value: true });
      dispatch({ type: SET_TEMPLATE_CARD_TYPE, value: null });
    };
  }, []);

  return width < 940 ? (
    <MobilePersonalisation />
  ) : (
    <FullScreenPersonalisation template={template} product={product} />
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  query,
}) => {
  const { sku } = params;
  const { productSKU } = query;
  let defaultURL: string = `${API_URL}/card-template/${sku}`;
  if (productSKU) {
    defaultURL += `?productSKU=${productSKU}`;
  }
  try {
    const response = await axios
      .get(defaultURL, setAuthHeader(req?.cookies))
      .then((response: AxiosResponse) => {
        return response.data || null;
      });
    return {
      props: { template: response.data, product: response.product },
    };
  } catch (e) {
    console.log(e);
    return { redirect: { permanent: false, destination: "/404" } };
  }
};

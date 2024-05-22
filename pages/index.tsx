import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import {
  Banner,
  FeaturedProducts,
  InformationBar,
  Partners,
  PromotionalAds1,
  PromotionalAds2,
} from "../components/home-page";
import { API_URL, APP_NAME } from "../config/constant";
import { IHomePageResponse } from "../models";

type Props = {
  data: IHomePageResponse;
};
const Index = ({ data }: Props) => {
  // console.log("Index getStaticProps", data);
  return (
    <>
      <Head>
        <title>
          {data?.metaTags?.title
            ? `${data?.metaTags?.title} | ${APP_NAME}`
            : `Home Page | ${APP_NAME}`}
        </title>
        <meta
          property="title"
          content={`${data?.metaTags?.title}`}
          key="title"
        />
        <meta
          key="description"
          name="description"
          content={data?.metaTags?.description}
        />
      </Head>
      <Banner banner={data?.banner} />
      <div className="home container">
        <PromotionalAds1 data={data?.promotionalAds1} />
        <FeaturedProducts data={data?.featuredProducts} />
        <PromotionalAds2 data={data?.promotionalAds2} />
        <FeaturedProducts data={data?.trendingProducts} />
        <InformationBar data={data?.informationBar || []} />
        <FeaturedProducts data={data?.newProducts} />
        <Partners data={data?.partners} />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  let data: IHomePageResponse = null;
  try {
    const response = await axios.get(`${API_URL}/home`).then((res) => res.data);
    data = response.data || null;
  } catch {
    data = null;
  }
  return { props: { data } };
};

export default Index;

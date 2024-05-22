import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { useWindowSize } from "../hooks/window";
import { IInitialState } from "../../models";
import {
  SET_CANVAS_CURRENT_INDEX,
  SET_CANVAS_LOADING,
} from "../../store/actions";

export const PersonalizationHeader = () => {
  const { width } = useWindowSize();
  const router = useRouter();
  const dispatch = useDispatch();
  const showCanvasLoading: boolean = useSelector(
    (state: IInitialState) => state.showCanvasLoading
  );
  const canvasTemplateImage: any = useSelector(
    (state: IInitialState) => state.canvasTemplateImage
  );
  const canvasTemplateIndex: any = useSelector(
    (state: IInitialState) => state.canvasTemplateIndex
  );
  const tempalteCardType: any = useSelector(
    (state: IInitialState) => state.tempalteCardType
  );
  const cardItemStyle = { width: "75px", height: "97px" };
  if (tempalteCardType === "1") {
    cardItemStyle.width = "90px";
  }

  return (
    <>
      <div
        className={`personalization-header d-flex ${
          width > 768 ? "sticky" : ""
        }`}
      >
        <div className="prs-hdr-left d-flex">
          <a
            className="back-to d-flex align-items-center"
            onClick={() => router.back()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18.399"
              height="32.927"
              viewBox="0 0 18.399 32.927"
            >
              <path
                d="M-17.467,39.9-2.941,54.433A1.949,1.949,0,0,0-1.573,55a1.949,1.949,0,0,0,1.368-.567L14.328,39.9a1.934,1.934,0,0,0-2.736-2.736L-1.573,50.33-14.731,37.168a1.932,1.932,0,0,0-2.736,0,1.932,1.932,0,0,0,0,2.736Z"
                transform="translate(55 18.034) rotate(90)"
              />
            </svg>
          </a>
          <div className="prs-logo">
            <Link href="/">
              <img src="/images/logo.svg" alt="Gift" />
            </Link>
          </div>
        </div>
        <div className="card-thumbs-block d-flex">
          {canvasTemplateImage.length > 1 && (
            <div className="prev-card d-flex align-items-center">
              <a
                style={{
                  cursor: showCanvasLoading ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  if (showCanvasLoading) return;
                  dispatch({
                    type: SET_CANVAS_LOADING,
                    value: true,
                  });
                  const nextIndex =
                    canvasTemplateIndex === 0
                      ? canvasTemplateImage.length - 1
                      : canvasTemplateIndex - 1;
                  dispatch({
                    type: SET_CANVAS_CURRENT_INDEX,
                    value: nextIndex,
                  });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12.604"
                  height="22.557"
                  viewBox="0 0 12.604 22.557"
                >
                  <path
                    d="M-17.645,38.864l9.951,9.953a1.335,1.335,0,0,0,.937.388,1.335,1.335,0,0,0,.937-.388l9.956-9.953A1.325,1.325,0,1,0,2.261,36.99l-9.019,9.016-9.014-9.016a1.323,1.323,0,0,0-1.874,0,1.323,1.323,0,0,0,0,1.874Z"
                    transform="translate(49.205 18.034) rotate(90)"
                  />
                </svg>
              </a>
            </div>
          )}
          <div className="card-thumbs d-flex">
            {/* <div className="card-item"></div>
            <div className="card-item me-0"></div>
            <div className="card-item ms-0"></div> */}
            {canvasTemplateImage.map((item, index) => {
              let extraClass = "";
              if (
                index !== 0 &&
                index !== canvasTemplateImage.length - 1 &&
                index % 2 !== 0
              ) {
                extraClass = "me-0";
              } else if (
                index !== 0 &&
                index !== canvasTemplateImage.length - 1 &&
                index % 2 === 0
              ) {
                extraClass = "ms-0";
              }
              return (
                <div
                  key={index}
                  style={cardItemStyle}
                  className={`card-item ${
                    canvasTemplateIndex === index ? "active" : ""
                  } ${extraClass}`}
                  onClick={() => {
                    dispatch({
                      type: SET_CANVAS_CURRENT_INDEX,
                      value: index,
                    });
                  }}
                >
                  <img src={item} style={{ padding: "1px" }} />
                </div>
              );
            })}
          </div>
          {canvasTemplateImage.length > 1 && (
            <div className="next-card d-flex align-items-center">
              <a
                style={{
                  cursor: showCanvasLoading ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  if (showCanvasLoading) return;
                  dispatch({
                    type: SET_CANVAS_LOADING,
                    value: true,
                  });
                  const nextIndex =
                    canvasTemplateIndex === canvasTemplateImage.length - 1
                      ? 0
                      : canvasTemplateIndex + 1;
                  dispatch({
                    type: SET_CANVAS_CURRENT_INDEX,
                    value: nextIndex,
                  });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12.604"
                  height="22.557"
                  viewBox="0 0 12.604 22.557"
                >
                  <path
                    d="M-17.645,38.864l9.951,9.953a1.335,1.335,0,0,0,.937.388,1.335,1.335,0,0,0,.937-.388l9.956-9.953A1.325,1.325,0,1,0,2.261,36.99l-9.019,9.016-9.014-9.016a1.323,1.323,0,0,0-1.874,0,1.323,1.323,0,0,0,0,1.874Z"
                    transform="translate(-36.601 4.522) rotate(-90) rotate(0)"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
        <div className="prs-hdr-right">
          <button className="btn btn-lt-grey">Preview</button>
          <button className="btn btn-primary">Add To Basket</button>
        </div>
      </div>
      {/* personalization-header end */}
    </>
  );
};

import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faFont,
  faTextWidth,
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faCircle,
  faUpload,
  faUndoAlt,
  faSearchPlus,
  faSmile,
  faUndo,
  faRedo,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { FileUpload } from "./FileUpload";
import { CustomFabric } from "../../fabric/index";
import {
  SET_CANVAS_CURRENT_INDEX,
  SET_CANVAS_LOADING,
} from "../../store/actions";

const horizontalAlingment = {
  left: faAlignLeft,
  right: faAlignRight,
  center: faAlignCenter,
  justify: faAlignJustify,
};

const verticalAlingment = {
  top: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 31.5 8.5"
      style={{ alignSelf: "flex-start" }}
    >
      <g>
        <line
          style={{
            fill: "none",
            stroke: "#000",
            strokeLinecap: "round",
            strokeWidth: "2.5px",
          }}
          x1="1.25"
          y1="1.25"
          x2="30.25"
          y2="1.25"
        />
        <line
          style={{
            fill: "none",
            stroke: "#000",
            strokeLinecap: "round",
            strokeWidth: "2.5px",
          }}
          x1="1.25"
          y1="7.25"
          x2="29.98"
          y2="7.25"
        />
      </g>
    </svg>
  ),
  center: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 31.5 8.5"
      style={{ alignSelf: "flex-center" }}
    >
      <g>
        <line
          style={{
            fill: "none",
            stroke: "#000",
            strokeLinecap: "round",
            strokeWidth: "2.5px",
          }}
          x1="1.25"
          y1="1.25"
          x2="30.25"
          y2="1.25"
        />
        <line
          style={{
            fill: "none",
            stroke: "#000",
            strokeLinecap: "round",
            strokeWidth: "2.5px",
          }}
          x1="1.25"
          y1="7.25"
          x2="29.98"
          y2="7.25"
        />
      </g>
    </svg>
  ),
  bottom: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 31.5 8.5"
      style={{ alignSelf: "flex-end" }}
    >
      <g>
        <line
          style={{
            fill: "none",
            stroke: "#000",
            strokeLinecap: "round",
            strokeWidth: "2.5px",
          }}
          x1="1.25"
          y1="1.25"
          x2="30.25"
          y2="1.25"
        />
        <line
          style={{
            fill: "none",
            stroke: "#000",
            strokeLinecap: "round",
            strokeWidth: "2.5px",
          }}
          x1="1.25"
          y1="7.25"
          x2="29.98"
          y2="7.25"
        />
      </g>
    </svg>
  ),
};

const textBoxTab = [
  { id: 1, name: "Font", icon: faFont },
  { id: 2, name: "Size", icon: faTextWidth },
  { id: 3, name: "Align", icon: faAlignCenter },
  { id: 4, name: "Color", icon: faCircle },
];

const imageBoxTab = [
  { id: 1, name: "Upload", icon: faUpload },
  { id: 2, name: "Rotate", icon: faUndoAlt },
  { id: 3, name: "Zoom", icon: faSearchPlus },
  { id: 4, name: "Filters", icon: faSmile },
];

const imageFilters = {
  3: "Sepia",
  19: "Black & White",
};

export function FullScreenPersonalisation({ template, product }) {
  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const canvasTemplateIndex = useSelector((state) => state.canvasTemplateIndex);
  const showCanvasLoading = useSelector((state) => state.showCanvasLoading);
  const [currentTab, setCurrentTab] = useState(1);
  const [isCanvasActive, setIsCanvasActive] = useState(false);
  const [activeCanvasProperties, setActiveCanvasProperties] = useState({});
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSlideName, setCurrentSlideName] = useState(null);

  useEffect(() => {
    if (!template) return;
    const { canvasData } = template;
    setSlides(canvasData || []);
  }, [template]);

  useEffect(() => {
    if (currentSlide === canvasTemplateIndex) return;
    setCurrentSlide(canvasTemplateIndex);
  }, [canvasTemplateIndex]);

  let currentTabHTML;
  let currentHeaderHTML;
  if (
    activeCanvasProperties?.type === "image" ||
    activeCanvasProperties?.type === "rect"
  ) {
    if (currentTab === 1) {
      currentTabHTML = (
        <div className="font-option">
          <h3 className="block-title">Upload Photos</h3>
          <FileUpload
            color="default"
            labelName={
              <>
                <FontAwesomeIcon icon={faUpload} size="2x" />
                <p>Upload</p>
              </>
            }
            onSetFile={(img) => {
              if (!img) return;
              if (canvasRef.current) {
                canvasRef.current.setComponentImage(img);
              }
            }}
          />
        </div>
      );
    } else if (currentTab === 2) {
      currentTabHTML = (
        <div className="text-size">
          <h3 className="block-title">Rotate</h3>
          <div className="rotate-btn">
            <button
              type="button"
              onClick={() => {
                if (canvasRef.current) {
                  canvasRef.current.rotateImage(90);
                }
              }}
            >
              <FontAwesomeIcon icon={faUndo} height={30} />
            </button>
            <button
              type="button"
              onClick={() => {
                if (canvasRef.current) {
                  canvasRef.current.rotateImage(-90);
                }
              }}
            >
              <FontAwesomeIcon icon={faRedo} height={30} />
            </button>
          </div>
        </div>
      );
    } else if (currentTab === 3) {
      currentTabHTML = (
        <div className="text-align">
          <div className="rotate-btn">
            <button
              type="button"
              onClick={() => {
                if (canvasRef.current) {
                  canvasRef.current.rotateImage(90);
                }
              }}
            >
              <FontAwesomeIcon icon={faUndo} height={30} />
            </button>
            <button
              type="button"
              onClick={() => {
                if (canvasRef.current) {
                  canvasRef.current.rotateImage(-90);
                }
              }}
            >
              <FontAwesomeIcon icon={faRedo} height={30} />
            </button>
          </div>
        </div>
      );
    } else if (currentTab === 4) {
      currentTabHTML = (
        <div className="text-color">
          <h3 className="block-title">Filters</h3>
          <ul>
            {Object.keys(imageFilters).map((key, index) => {
              return (
                <li
                  key={index}
                  className={
                    activeCanvasProperties.appliedImageFilters?.includes(
                      Number(key)
                    )
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    if (canvasRef.current) {
                      canvasRef.current.applyImageFilter(key);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faImage} height={40} />
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    currentHeaderHTML = imageBoxTab.map((element) => {
      return (
        <div
          key={element.id}
          className={`option-item ${currentTab === element.id ? "active" : ""}`}
          onClick={() => setCurrentTab(element.id)}
        >
          <FontAwesomeIcon icon={element.icon} height="20" />
          <p>{element.name}</p>
        </div>
      );
    });
  } else {
    if (currentTab === 1) {
      currentTabHTML = (
        <div className="font-option">
          <h3 className="block-title">Fonts</h3>
          <ul>
            {activeCanvasProperties?.availableFonts &&
              activeCanvasProperties?.availableFonts.map((font, index) => {
                return (
                  <li
                    className={
                      activeCanvasProperties.fontFamily === font ? "active" : ""
                    }
                    key={index}
                    onClick={() => {
                      if (canvasRef.current) {
                        canvasRef.current.setTextFontFamily(font);
                      }
                    }}
                  >
                    <span className="dot"></span> {font}
                  </li>
                );
              })}
          </ul>
        </div>
      );
    } else if (currentTab === 2) {
      currentTabHTML = (
        <div className="text-size">
          <h3 className="block-title">Text Size</h3>
          <ul>
            {activeCanvasProperties?.availableFontSizes &&
              activeCanvasProperties?.availableFontSizes.map((size) => {
                return (
                  <li
                    key={size}
                    className={
                      Number(size) ===
                      Number(activeCanvasProperties["fontSize"])
                        ? "active"
                        : ""
                    }
                    onClick={() => {
                      if (canvasRef.current) {
                        canvasRef.current.setTextBoxFontSize(size);
                      }
                    }}
                  >
                    {size}
                  </li>
                );
              })}
          </ul>
        </div>
      );
    } else if (currentTab === 3) {
      currentTabHTML = (
        <div className="text-align">
          <h3 className="block-title">Text Alignment</h3>
          <h3 className="block-subtitle">Horizontal</h3>
          <ul>
            {activeCanvasProperties.availableHorizontalAlignments &&
              activeCanvasProperties.availableHorizontalAlignments.map(
                (key) => {
                  const alignment = String(key).toLowerCase();
                  const selected = String(
                    activeCanvasProperties["textAlign"]
                  ).toLowerCase();
                  return (
                    <li
                      key={alignment}
                      className={selected === alignment ? "active" : ""}
                      onClick={() => {
                        if (canvasRef.current) {
                          canvasRef.current.setTextAlignment(alignment);
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={horizontalAlingment[alignment]}
                        height="20"
                      />
                    </li>
                  );
                }
              )}
          </ul>
          <h3 className="block-subtitle">Vertical</h3>
          <ul>
            {activeCanvasProperties.availableVerticalAlignments &&
              activeCanvasProperties.availableVerticalAlignments.map((key) => {
                const alignment = String(key).toLowerCase();
                return (
                  <li
                    key={key}
                    className={
                      activeCanvasProperties["vAlign"] === alignment
                        ? "active"
                        : ""
                    }
                    onClick={() => {
                      if (canvasRef.current) {
                        canvasRef.current.setVerticalTextAlignment(alignment);
                      }
                    }}
                  >
                    {/* <FontAwesomeIcon
                    icon={verticalAlingment[alignment]}
                    height="20"
                  /> */}
                    {verticalAlingment[alignment]}
                  </li>
                );
              })}
          </ul>
        </div>
      );
    } else if (currentTab === 4) {
      currentTabHTML = (
        <div className="text-color">
          <h3 className="block-title">Text Colour</h3>
          <ul>
            {activeCanvasProperties.availableColours &&
              activeCanvasProperties.availableColours.map((color, index) => {
                return (
                  <li
                    key={index}
                    className={
                      color === activeCanvasProperties["fill"] ? "active" : ""
                    }
                    onClick={() => {
                      if (canvasRef.current) {
                        canvasRef.current.setTextColor(color);
                      }
                    }}
                  >
                    <span style={{ backgroundColor: color }}></span>
                  </li>
                );
              })}
          </ul>
        </div>
      );
    }
    currentHeaderHTML = textBoxTab.map((element) => {
      return (
        <div
          key={element.id}
          className={`option-item ${currentTab === element.id ? "active" : ""}`}
          onClick={() => setCurrentTab(element.id)}
        >
          <FontAwesomeIcon icon={element.icon} height="20" />
          <p>{element.name}</p>
        </div>
      );
    });
  }

  if (!template) <></>;
  return (
    <>
      <div className="personalisation">
        <div className="container">
          <div className="prs-wrapper d-flex">
            <div className="canvas-area">
              <div className="canvas-editor-area">
                <h2 className="section-title">{currentSlideName}</h2>
                <div className="canvas-block">
                  {slides.length > 1 && (
                    <>
                      <span
                        className="prev arrow"
                        style={{
                          cursor: showCanvasLoading ? "not-allowed" : "pointer",
                        }}
                        onClick={() => {
                          if (showCanvasLoading) return;
                          const nextIndex =
                            currentSlide === 0
                              ? slides.length - 1
                              : currentSlide - 1;
                          setCurrentSlide(nextIndex);
                          setCurrentSlideName(slides[nextIndex]?.name);
                          dispatch({
                            type: SET_CANVAS_CURRENT_INDEX,
                            value: nextIndex,
                          });
                          dispatch({
                            type: SET_CANVAS_LOADING,
                            value: true,
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faChevronLeft} height="18" />
                      </span>
                      <span
                        className="next arrow"
                        style={{
                          cursor: showCanvasLoading ? "not-allowed" : "pointer",
                        }}
                        onClick={() => {
                          if (showCanvasLoading) return;
                          const nextIndex =
                            currentSlide === slides.length - 1
                              ? 0
                              : currentSlide + 1;
                          // console.log(nextIndex);
                          setCurrentSlide(nextIndex);
                          dispatch({
                            type: SET_CANVAS_CURRENT_INDEX,
                            value: nextIndex,
                          });
                          dispatch({
                            type: SET_CANVAS_LOADING,
                            value: true,
                          });
                          setCurrentSlideName(slides[nextIndex]?.name);
                        }}
                      >
                        <FontAwesomeIcon icon={faChevronRight} height="18" />
                      </span>
                    </>
                  )}
                  <div className="canvas-content">
                    <CustomFabric
                      ref={canvasRef}
                      id="canvas"
                      template={template}
                      currentSlide={currentSlide}
                      onActiveCanvasUpdate={(e) => {
                        // console.log("onActiveCanvasUpdate", e);
                        setActiveCanvasProperties(e);
                        setIsCanvasActive(true);
                      }}
                      onClearSelection={() => {
                        setActiveCanvasProperties({});
                        setIsCanvasActive(false);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="sidebar-right d-flex">
              <div className="sidebar-right-top">
                {isCanvasActive ? (
                  <>
                    <div className="option-items-block">
                      {currentHeaderHTML}
                    </div>
                    <div className="option-item-content">{currentTabHTML}</div>
                  </>
                ) : (
                  <p className="text-center text-primary">
                    Select a text or photo space to personalise.
                  </p>
                )}
              </div>
              <div className="sidebar-btns">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    console.log(canvasRef.current.getCanvasData());
                  }}
                >
                  Preview
                </button>
                <button
                  className="btn btn-primary cart-button"
                  onClick={() => {
                    console.log(canvasRef.current.getCanvasData());
                  }}
                >
                  Add to Basket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

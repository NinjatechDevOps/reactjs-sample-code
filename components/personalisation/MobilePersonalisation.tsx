import { useState } from "react";

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
} from "@fortawesome/free-solid-svg-icons";
import { DEFAULT_COLORS } from "../../config/constant";

export function MobilePersonalisation() {
  const [currentTab, setCurrentTab] = useState<number>(1);
  const [showOptions, setShowOptions] = useState<boolean>(true);

  let currentTabHTML: any;
  if (currentTab === 1) {
    currentTabHTML = (
      <div className="font-option">
        <h3 className="block-title">Fonts</h3>
        <ul>
          <li className="active">
            <span className="dot"></span> Montserrat
          </li>
          <li>
            <span className="dot"></span> Kalam
          </li>
          <li>
            <span className="dot"></span> Tahoma
          </li>
          <li>
            <span className="dot"></span> America Typewriter
          </li>
          <li>
            <span className="dot"></span> Amatic
          </li>
          <li>
            <span className="dot"></span> Bodomi
          </li>
        </ul>
      </div>
    );
  } else if (currentTab === 2) {
    currentTabHTML = (
      <div className="text-size">
        <h3 className="block-title">Text Size</h3>
        <ul>
          <li className="active">14</li>
          <li>16</li>
          <li>18</li>
          <li>20</li>
          <li>22</li>
          <li>24</li>
          <li>26</li>
          <li>28</li>
        </ul>
      </div>
    );
  } else if (currentTab === 3) {
    currentTabHTML = (
      <div className="text-align">
        <h3 className="block-title">Text Alignment</h3>
        <h3 className="block-subtitle">Horizontal</h3>

        <ul>
          <li className="active">
            <FontAwesomeIcon icon={faAlignLeft} height="20" />
          </li>
          <li>
            <FontAwesomeIcon icon={faAlignCenter} height="20" />
          </li>
          <li>
            <FontAwesomeIcon icon={faAlignRight} height="20" />
          </li>
          <li>
            <FontAwesomeIcon icon={faAlignJustify} height="20" />
          </li>
        </ul>

        <h3 className="block-subtitle">Vertical</h3>
        <ul>
          <li>
            <FontAwesomeIcon icon={faAlignJustify} height="20" />
          </li>
          <li>
            <FontAwesomeIcon icon={faAlignJustify} height="20" />
          </li>
          <li>
            <FontAwesomeIcon icon={faAlignJustify} height="20" />
          </li>
        </ul>
      </div>
    );
  } else if (currentTab === 4) {
    currentTabHTML = (
      <div className="text-color">
        <h3 className="block-title">Text Colour</h3>
        <ul>
          {DEFAULT_COLORS.map((color, index) => {
            return (
              <li key={index}>
                <span style={{ backgroundColor: color }}></span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  return (
    <>
      <div className="m-personalisation">
        <div className="container">
          <div className="prs-wrapper d-flex">
            <div className="sidebar-right d-flex">
              <div className="sidebar-right-top">
                <div className="option-items-block">
                  <div
                    className={`option-item ${
                      currentTab === 1 ? "active" : ""
                    }`}
                    onClick={() => {
                      setShowOptions(true);
                      setCurrentTab(1);
                    }}
                  >
                    <FontAwesomeIcon icon={faFont} height="20" />
                    <p>Font</p>
                  </div>
                  <div
                    className={`option-item ${
                      currentTab === 2 ? "active" : ""
                    }`}
                    onClick={() => {
                      setShowOptions(true);
                      setCurrentTab(2);
                    }}
                  >
                    <FontAwesomeIcon icon={faTextWidth} height="20" />
                    <p>Size</p>
                  </div>
                  <div
                    className={`option-item ${
                      currentTab === 3 ? "active" : ""
                    }`}
                    onClick={() => {
                      setShowOptions(true);
                      setCurrentTab(3);
                    }}
                  >
                    <FontAwesomeIcon icon={faAlignCenter} height="20" />
                    <p>Align</p>
                  </div>
                  <div
                    className={`option-item ${
                      currentTab === 4 ? "active" : ""
                    }`}
                    onClick={() => {
                      setShowOptions(true);
                      setCurrentTab(4);
                    }}
                  >
                    <FontAwesomeIcon icon={faCircle} height="20" />
                    <p>Color</p>
                  </div>
                </div>
                {showOptions && (
                  <div className="option-item-content">
                    <a onClick={() => setShowOptions(false)} className="close">
                      x
                    </a>
                    {currentTabHTML}
                  </div>
                )}
              </div>
            </div>

            <div className="canvas-area">
              <div className="canvas-editor-area">
                <div className="canvas-block">
                  <div className="canvas-content"> </div>
                </div>
                <h2 className="section-title">Front</h2>
                <span className="prev arrow">
                  <FontAwesomeIcon icon={faChevronLeft} height="18" />
                </span>
                <span className="next arrow">
                  <FontAwesomeIcon icon={faChevronRight} height="18" />
                </span>
              </div>
            </div>

            <div className="sidebar-btns">
              <button className="btn btn-outline-primary">Preview</button>
              <button className="btn btn-primary cart-button">
                Add to Basket
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import { HIDE_NAVBAR, SHOW_NAVBAR, SHOW_SEARCH_BAR } from "../../store/actions";
import { IInitialState } from "../../models";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const NavBar = () => {
  const dispatch = useDispatch();
  const basketProducts = useSelector(
    (state: IInitialState) => state.basketProducts
  );
  const showNavBarMenu = useSelector(
    (state: IInitialState) => state.showNavBarMenu
  );
  const [basketCount, setBasketCount] = useState<number>(0);

  useEffect(() => {
    setBasketCount(basketProducts.length);
  }, [basketProducts]);

  return (
    <>
      <div className="fix-menu">
        <div className="fix-menu__top-circle"></div>
        <div className="fix-menu__item">
          <a
            onClick={() =>
              dispatch({ type: showNavBarMenu ? HIDE_NAVBAR : SHOW_NAVBAR })
            }
          >
            {showNavBarMenu ? (
              <FontAwesomeIcon icon={faTimes} height={20} />
            ) : (
              <div className="ham-icon">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <p>Menu</p>
          </a>
          <a onClick={() => dispatch({ type: SHOW_SEARCH_BAR })}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20.96"
              height="21.066"
              viewBox="0 0 20.96 21.066"
            >
              <g
                id="Group_7"
                data-name="Group 7"
                transform="translate(-295.4 321.6)"
              >
                <g
                  id="Group_1149"
                  data-name="Group 1149"
                  transform="translate(296 -321)"
                >
                  <path
                    id="Path_140"
                    data-name="Path 140"
                    d="M.556,1.112A7.012,7.012,0,0,0,7.568-5.9,7.012,7.012,0,0,0,.555-12.913,7.012,7.012,0,0,0-6.456-5.9,7.012,7.012,0,0,0,.557,1.112Z"
                    transform="translate(6.456 12.913)"
                    fill="none"
                    stroke="#06060b"
                    stroke-width="1.2"
                  />
                </g>
                <path
                  id="Path_923"
                  data-name="Path 923"
                  d="M0,0,7.011,7.118"
                  transform="translate(308.5 -308.5)"
                  fill="none"
                  stroke="#06060b"
                  stroke-linecap="round"
                  stroke-width="1.2"
                />
              </g>
            </svg>
            <p>Search</p>
          </a>
          <Link href="/">
            <a className="fix-menu__middle">
              <img src="/images/logo.svg" alt="Logo" />
            </a>
          </Link>
          <Link href="/account">
            <a>
              <img src="/images/account.svg" alt="Account" />
              <p>Account</p>
            </a>
          </Link>
          <Link href="/basket">
            <a>
              {basketCount > 0 && (
                <span className="badge">{basketCount}</span>
              )}
              <img src="/images/basket.svg" alt="Basket Product" />
              <p>Basket</p>
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

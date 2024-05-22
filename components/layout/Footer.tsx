import Link from "next/link";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import { dynamicSort, sortParentChild } from "../../config/utils";
import { IFooter } from "../../models";
import { useWindowSize } from "../hooks/window";
import { APP_NAME } from "../../config/constant";

type Props = {
  footer: IFooter[];
};

const Footer = ({ footer }: Props) => {
  const { width } = useWindowSize();
  const [footerList, setFooterList] = useState<IFooter[]>([]);
  const [accordion, setAccordion] = useState<string[]>([]);

  useEffect(() => {
    setFooterList(
      footer && footer.length > 0
        ? sortParentChild(footer?.sort(dynamicSort("sortOrder")), "parentId")
        : []
    );
  }, [footer]);

  let listItems: any = <></>;
  if (footerList.length > 0) {
    if (width > 768) {
      listItems = footerList.map((element: IFooter) => {
        return (
          <div className="col-lg-4" key={element?.id}>
            <h3 className="f-w-600">{element?.name}</h3>
            <ul>
              {element?.children &&
                element?.children.length > 0 &&
                element?.children.map((children: IFooter) => {
                  return (
                    <li key={children?.id}>
                      <Link
                        href={
                          children.isStaticPage
                            ? `/${children?.url}` || "#"
                            : `/hc/${children?.cms?.link || ""}`
                        }
                      >
                        <a>{children?.name}</a>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        );
      });
    } else {
      listItems = footerList.map((element: IFooter) => {
        return (
          <div className="col-lg-4" key={element?.id}>
            <h3
              className="f-w-600 cursor-pointer"
              onClick={() => {
                if (accordion.includes(element.id)) {
                  const index = accordion.indexOf(element.id);
                  accordion.splice(index, 1);
                } else {
                  accordion.push(element.id);
                }
                setAccordion([...accordion]);
              }}
            >
              {element?.name}
              <div className="pull-right">
                <FontAwesomeIcon
                  icon={
                    accordion.includes(element.id) ? faChevronUp : faChevronDown
                  }
                  height={18}
                />
              </div>
            </h3>
            {accordion.includes(element.id) && (
              <ul>
                {element?.children &&
                  element?.children.length > 0 &&
                  element?.children.map((children: IFooter) => {
                    return (
                      <li key={children?.id}>
                        <Link
                          href={
                            children.isStaticPage
                              ? `/${children?.url}` || "#"
                              : `/hc/${children?.cms?.link || ""}`
                          }
                        >
                          <a>{children?.name}</a>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            )}
            <hr />
          </div>
        );
      });
    }
  }

  return (
    <div className="footer">
      <div className="container">
        <div className="footer-part">
          <div className="row">
            <div className="col-lg-8">
              <div className="footer-link f-w-500">
                <div className="row">{listItems}</div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="footer-contact">
                {/* <h3 className="f-w-600">Call Us</h3>
                <h4>
                  <a href="#" className="text-primary f-w-600">
                    08000432273
                  </a>
                </h4> 
                <p className="f-w-500">Office hours Mon-fri: 9am - 5pm</p> */}
                <div className="footer-card-box d-flex">
                  <img src="/images/all-cards.png" alt="All Cards" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 copyright-text">
              &copy; 2021 {APP_NAME}
              {/* | <a href="#">Terms</a> & <a href="#"> Privacy Policy</a> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

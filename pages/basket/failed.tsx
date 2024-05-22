import Link from "next/link";

const OrderFailed = () => {
  return (
    <>
      <div className="breadcrumbs">
        <div className="container">
          <ul>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li>
              <Link href="/basket">Basket</Link>
            </li>
            <li>Failed</li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="empty-basket">
          <img src="/images/empty-basket.svg" alt="Empty Basket" />
          <p>Order Failed!</p>
          <Link href="/">
            <a className="btn btn-primary">Continue Shopping</a>
          </Link>
        </div>
      </div>
    </>
  );
};
export default OrderFailed;

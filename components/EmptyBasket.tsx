import Link from "next/link";

export const EmptyBasket = () => {
  return (
    <div className="empty-basket">
      <img src="/images/empty-basket.svg" alt="Empty Basket" />
      <p>Your Basket is Empty!</p>
      <Link href="/">
        <a className="btn btn-primary">Continue Shopping</a>
      </Link>
    </div>
  );
};

import Link from "next/link";

export default function Custom404() {
  return (
    <div className="container page-404 pt-4 mt-3 mt-md-5">
      <div className="row">
        <p className="txt-sml mb-3">OOPS!</p>
        <div className="mid-img mb-5">
          <img src="/images/img-404.png" alt="Page Not Found" />
        </div>
      </div>
      <div className="row justify-content-center mb-4 mb-md-3 mb-md-5">
        <div className="col-lg-4 col-md-6 col-sm-10">
          <h2 className="txt-1">
            We can't find the page that you're looking for :(
          </h2>
        </div>
      </div>
      <div className="row">
        <div className="btn-404 pb-4 mb-2 mb-md-5">
          <Link href="/">
            <a className="btn btn-sm btn-primary">Back To Home</a>
          </Link>
        </div>
      </div>
    </div>
  );
}

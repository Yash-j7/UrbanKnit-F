import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div>
      <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
        <nav className="grid grid-flow-col gap-4">
          <Link to="/about" className="link link-hover">
            About us
          </Link>
          <Link to="/contact" className="link link-hover">
            Contact
          </Link>
          <Link to="/jobs" className="link link-hover">
            Jobs
          </Link>
          <Link to="/press-kit" className="link link-hover">
            Press kit
          </Link>
        </nav>
        <nav>
          <div className="grid grid-flow-col gap-4">
            <Link to="https://x.com/AiBasys?mx=2" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </Link>
            <Link
              to="https://www.linkedin.com/company/basysai/"
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current text-black" // You can change the color as needed
              >
                <path d="M19.053 3H4.947C3.871 3 3 3.871 3 4.947v14.106C3 20.129 3.871 21 4.947 21h14.106C20.129 21 21 20.129 21 19.053V4.947C21 3.871 20.129 3 19.053 3zM8.997 17H6.75V9.5h2.247V17zm-1.123-8.182c-.721 0-1.305-.584-1.305-1.305s.584-1.305 1.305-1.305 1.305.584 1.305 1.305-.584 1.305-1.305 1.305zM17.25 17h-2.247v-4.75c0-1.128-.021-2.583-1.577-2.583-1.578 0-1.82 1.228-1.82 2.5V17h-2.247V9.5h2.157v1.139h.03c.299-.563 1.031-1.158 2.124-1.158 2.272 0 2.691 1.496 2.691 3.44V17z"></path>
              </svg>
            </Link>

            <Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </Link>
          </div>
        </nav>
        <aside>
          <p>Copyright © 2024 - All right reserved by Hospital</p>
        </aside>
      </footer>
    </div>
  );
}

export default Footer;

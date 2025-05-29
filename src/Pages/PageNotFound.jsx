import React from "react";
import Layout from "../Layout/Layout";

function PageNotFound() {
  return (
    <Layout>
      <div className="text-center mt-44">
        <h1 className="text-9xl">Error 404</h1>;
        <h1 className="text-4xl"> Oops ! Page Not Found Go Back</h1>
      </div>
    </Layout>
  );
}

export default PageNotFound;

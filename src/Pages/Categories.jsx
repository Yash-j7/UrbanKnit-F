import React from "react";
import Layout from "../Layout/Layout";
import useCategory from "../hooks/useCategory";
import { Link } from "react-router-dom";

function Categories() {
  const categories = useCategory();
  return (
    <Layout>
      <h1 className="text-center text-4xl font-bold mt-8 mb-6">
        All Categories
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {categories?.map((c) => {
          return (
            <div
              key={c._id}
              className="p-6 shadow-lg rounded-lg bg-white hover:bg-blue-50 transition-colors duration-200"
            >
              <Link
                to={`/category/${c.slug}`}
                className="block text-center text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                {c.name}
              </Link>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export default Categories;

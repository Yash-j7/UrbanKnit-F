import React from "react";
import { useSearch } from "../context/Search.jsx";
import Layout from "../Layout/Layout"; //
import { NavLink } from "react-router-dom";
function Search() {
  const [values, setValues] = useSearch();

  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-xl">
          {values?.results.length < 1
            ? "No results found"
            : `Found ${values.results.length} results`}
        </h1>
        <div className="m-5">
          <h1 className="text-2xl font-bold mb-4 text-center">Products</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values?.results.map((p) => (
              <div
                className="card card-compact bg-base-100 shadow-xl"
                key={p._id}
              >
                <figure>
                  <img
                    src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{p.name}</h2>
                  <p>{p.description}</p>
                  <div className="card-actions justify-end">
                    <NavLink to={`/dashboard/admin/update-product/${p.slug}`}>
                      <button className="btn btn-primary">Update</button>
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Search;

import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Layout/AdminMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { NavLink } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [auth] = useAuth();

  const getProducts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/product/get-product",
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      if (data.success) {
        setProducts(data.products);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <AdminMenu />
          </div>
          <div className="col-span-9">
            <h1 className="text-2xl font-bold mb-4 text-center">Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products?.map((p) => (
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
      </div>
    </Layout>
  );
}

export default Products;

import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import { Button } from "antd";

function CategoryProduct() {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  useEffect(() => {
    if (params?.slug) getCateProd();
  }, [params?.slug]);

  const getCateProd = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl text-center">category {category?.name}</h1>
      <h1 className="text-xl text-center mt-5 mb-12">
        Found {products?.length} results
      </h1>
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {products?.map((p) => (
            <Card
              key={p._id}
              hoverable
              style={{ width: 300 }}
              className="m-3 p-2"
              cover={
                <img
                  alt={p.name}
                  src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                />
              }
            >
              <Meta title={p.name} description={p.description} />
              <div className="card-name-price mt-3">
                <h5 className="card-title">{p.price} years old</h5>
              </div>
              <div className="mt-3 flex">
                <Button
                  type="primary"
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  More Details
                </Button>
                <Button
                  type="default"
                  className="ml-2"
                  onClick={() => {
                    setCart([...cart, p]);
                    localStorage.setItem("cart", JSON.stringify([...cart, p]));
                    toast.success("Item Added to cart");
                  }}
                >
                  Add to Criticals
                </Button>
              </div>
            </Card>
          ))}
        </div>
        {/* <div className="m-2 p-3">
          {products && products.length < total && (
            <button
              className="btn btn-info"
              onClick={(e) => {
                e.preventDefault();
                setPage(page + 1);
              }}
            >
              {loading ? "loading..." : "loadmore"}
            </button>
          )}
        </div> */}
      </div>
    </Layout>
  );
}

export default CategoryProduct;

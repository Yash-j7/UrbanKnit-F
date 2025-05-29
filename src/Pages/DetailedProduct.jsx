import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout.jsx";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Badge, Divider, Rate, Breadcrumb, Spin } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  StarFilled,
  CheckCircleOutlined,
  TruckOutlined,
  SafetyOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

const { Meta } = Card;

function DetailedProduct() {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [prod, setProd] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const getProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/get-product/${params.slug}`
      );

      if (data?.product) {
        setProd(data.product);
        getRelatedProducts(data.product._id, data.product.category._id);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const getRelatedProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/related-product/${pid}/${cid}`
      );

      if (data?.products) {
        setRelatedProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.slug) getProducts();
  }, [params.slug]);

  const handleAddToCart = (product, qty = 1) => {
    const existingItem = cart.find((item) => item._id === product._id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: (item.quantity || 1) + qty }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: qty }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success(`${qty} item(s) added to cart`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  if (!prod) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl text-gray-500">Product not found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb className="text-sm">
              <Breadcrumb.Item>
                <a href="/" className="text-gray-500 hover:text-blue-600 transition-colors">Home</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <a href="/products" className="text-gray-500 hover:text-blue-600 transition-colors">Products</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <a href={`/category/${prod?.category?.name}`} className="text-gray-500 hover:text-blue-600 transition-colors">
                  {prod?.category?.name}
                </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item className="text-gray-900 font-medium">
                {prod?.name}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* Product Detail Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border relative group">
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                      <Spin size="large" />
                    </div>
                  )}
                  <img
                    alt={prod.name}
                    src={`http://localhost:8080/api/v1/product/product-photo/${prod._id}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Product Title & Category */}
                <div>
                  <Badge
                    count={
                      <a
                        href={`/category/${prod?.category?.name}`}
                        className="text-blue-600 hover:text-blue-800 no-underline transition-colors"
                      >
                        {prod?.category?.name}
                      </a>
                    }
                    style={{
                      backgroundColor: "#f0f8ff",
                      color: "#1890ff",
                      border: "1px solid #d6e4ff",
                    }}
                    className="mb-3 cursor-pointer"
                  />
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    {prod.name}
                  </h1>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center space-x-4">
                  <Rate disabled defaultValue={4.5} className="text-sm" />
                  <span className="text-sm text-gray-600">(128 reviews)</span>
                  <Badge
                    count="In Stock"
                    style={{ backgroundColor: "#52c41a" }}
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-3">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{prod.price.toLocaleString()}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{(prod.price * 1.2).toLocaleString()}
                    </span>
                    <Badge
                      count="20% OFF"
                      style={{ backgroundColor: "#ff4d4f" }}
                    />
                  </div>
                  <p className="text-sm text-green-600 flex items-center">
                    <CheckCircleOutlined className="mr-1" />
                    Free delivery on orders above ₹499
                  </p>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-lg bg-white">
                    <button
                      className="px-4 py-2 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-6 py-2 border-x text-center min-w-[60px] font-medium">
                      {quantity}
                    </span>
                    <button
                      className="px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {quantity} × ₹{prod.price.toLocaleString()} = ₹{(quantity * prod.price).toLocaleString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <Button
                      type="primary"
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      className="flex-1 h-12 text-base font-medium hover:scale-[1.02] transition-transform"
                      onClick={() => handleAddToCart(prod, quantity)}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      size="large"
                      icon={<HeartOutlined />}
                      className="h-12 px-4 hover:scale-[1.02] transition-transform"
                    />
                    <Button
                      size="large"
                      icon={<ShareAltOutlined />}
                      className="h-12 px-4 hover:scale-[1.02] transition-transform"
                    />
                  </div>

                  <Button
                    size="large"
                    className="w-full h-12 text-base font-medium hover:scale-[1.02] transition-transform"
                    style={{
                      backgroundColor: "#ff6b35",
                      borderColor: "#ff6b35",
                      color: "white",
                    }}
                  >
                    Buy Now
                  </Button>
                </div>

                {/* Features */}
                <div className="border-t pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2 text-sm bg-gray-50 p-3 rounded-lg">
                      <TruckOutlined className="text-blue-500 text-lg" />
                      <span>Free Delivery</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm bg-gray-50 p-3 rounded-lg">
                      <ReloadOutlined className="text-green-500 text-lg" />
                      <span>Easy Returns</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm bg-gray-50 p-3 rounded-lg">
                      <SafetyOutlined className="text-purple-500 text-lg" />
                      <span>Secure Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                You May Also Like
              </h2>
              <Button type="link" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                View All
              </Button>
            </div>

            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {relatedProducts.slice(0, 5).map((p) => (
                  <Card
                    key={p._id}
                    hoverable
                    className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300"
                    cover={
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                          alt={p.name}
                          src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    }
                    actions={[
                      <Button
                        type="text"
                        icon={<ShoppingCartOutlined />}
                        className="w-full hover:text-blue-600 transition-colors"
                        onClick={() => handleAddToCart(p)}
                      >
                        Add to Cart
                      </Button>,
                    ]}
                  >
                    <div className="p-2">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer"
                          onClick={() => navigate(`/product/${p.slug}`)}>
                        {p.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{p.price.toLocaleString()}
                        </span>
                        <Button
                          type="link"
                          size="small"
                          onClick={() => navigate(`/product/${p.slug}`)}
                          className="p-0 h-auto text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          View Details
                        </Button>
                      </div>
                      <div className="flex items-center mt-2">
                        <Rate disabled defaultValue={4} className="text-xs" />
                        <span className="text-xs text-gray-500 ml-1">(42)</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500 text-lg">
                  No similar products found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DetailedProduct;

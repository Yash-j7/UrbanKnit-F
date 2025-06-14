import React, { useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import UserMenu from "../../Layout/UserMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Spin, Empty, Badge, Card } from "antd";
import {
  ShoppingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import FootballLoading from "../../components/FootballLoading.jsx";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "https://urnanknit-backend.onrender.com/api/v1/auth/order",
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      setOrders(data);
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getStatusColor = (status, paymentStatus) => {
    if (paymentStatus === "failed") {
      return "error";
    }
    switch (status.toLowerCase()) {
      case "processing":
        return "processing";
      case "shipped":
        return "warning";
      case "delivered":
        return "success";
      case "cancel":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <UserMenu />
          </div>
          <div className="md:col-span-9">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
                <div className="flex items-center gap-2">
                  <ShoppingOutlined className="text-xl text-gray-600" />
                  <span className="text-gray-600">
                    Total Orders: {orders.length}
                  </span>
                </div>
              </div>

              {loading ? (
                <FootballLoading />
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order, index) => (
                    <Card
                      key={order._id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Order #{index + 1}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Placed on{" "}
                            {moment(order.createdAt).format(
                              "MMMM Do YYYY, h:mm a"
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            status={getStatusColor(
                              order.status,
                              order.paymentStatus
                            )}
                            text={
                              <span className="font-medium capitalize">
                                {order.paymentStatus === "failed"
                                  ? "Payment Failed"
                                  : order.status}
                              </span>
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {order.products.map((product) => (
                          <div
                            key={product._id}
                            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={`https://urnanknit-backend.onrender.com/api/v1/product/product-photo/${product._id}`}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800">
                                {product.name}
                              </h4>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {product.description}
                              </p>
                              <div className="mt-2 flex items-center justify-between">
                                <div className="space-y-1">
                                  <div className="text-sm text-gray-500">
                                    Unit Price: ₹
                                    {product.price.toLocaleString("en-IN")}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Quantity: {product.quantity || 1}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-semibold text-gray-900">
                                    Item Total: ₹
                                    {(
                                      product.price * (product.quantity || 1)
                                    ).toLocaleString("en-IN")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {order.paymentStatus === "success" ? (
                              <CheckCircleOutlined className="text-green-500 text-xl" />
                            ) : (
                              <CloseCircleOutlined className="text-red-500 text-xl" />
                            )}
                            <span className="font-medium">
                              Payment:{" "}
                              {order.paymentStatus === "success"
                                ? "Successful"
                                : "Failed"}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Order Total</p>
                            <p className="text-lg font-bold text-gray-900">
                              ₹
                              {order.products
                                .reduce(
                                  (total, p) =>
                                    total + p.price * (p.quantity || 1),
                                  0
                                )
                                .toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Empty description="No orders found" className="my-8" />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Orders;

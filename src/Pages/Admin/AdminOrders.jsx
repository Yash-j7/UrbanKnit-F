import React, { useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import AdminMenu from "./../../Layout/AdminMenu";
import { Select, Spin, Empty, Badge, Card, message } from "antd";
import { ShoppingOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const [status] = useState([
    "To be Processed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/auth/all-order",
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
      message.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (orderId, val) => {
    try {
      const { data } = await axios.put(
        `http://localhost:8080/api/v1/auth/order-status/${orderId}`,
        {
          status: val,
        },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      message.success("Order status updated successfully");
      getOrders();
    } catch (error) {
      console.error(error);
      message.error("Failed to update order status");
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getStatusColor = (status) => {
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
            <AdminMenu />
          </div>
          <div className="md:col-span-9">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">All Orders</h1>
                <div className="flex items-center gap-2">
                  <ShoppingOutlined className="text-xl text-gray-600" />
                  <span className="text-gray-600">Total Orders: {orders.length}</span>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Spin size="large" />
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order, index) => (
                    <Card key={order._id} className="hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Order #{index + 1}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Placed on {moment(order.createdAt).format("MMMM Do YYYY, h:mm a")}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            status={getStatusColor(order.status)}
                            text={
                              <span className="font-medium capitalize">{order.status}</span>
                            }
                          />
                          <Select
                            bordered={false}
                            onChange={(val) => handleChange(order._id, val)}
                            defaultValue={order?.status}
                            className="min-w-[150px]"
                          >
                            {status.map((s) => (
                              <Option key={s} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {order.products.map((product) => (
                          <div
                            key={product._id}
                            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={`http://localhost:8080/api/v1/product/product-photo/${product._id}`}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800">{product.name}</h4>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {product.description}
                              </p>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="font-semibold text-gray-900">
                                  ₹{product.price.toLocaleString("en-IN")}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Quantity: {product.quantity || 1}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {order.payment.success ? (
                              <CheckCircleOutlined className="text-green-500 text-xl" />
                            ) : (
                              <CloseCircleOutlined className="text-red-500 text-xl" />
                            )}
                            <span className="font-medium">
                              Payment: {order.payment.success ? "Successful" : "Failed"}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Order Total</p>
                            <p className="text-lg font-bold text-gray-900">
                              ₹{order.products.reduce((total, p) => total + p.price * (p.quantity || 1), 0).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Empty
                  description="No orders found"
                  className="my-8"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminOrders;

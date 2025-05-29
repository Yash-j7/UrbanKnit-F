import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";

function Cart() {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCartItem = (pid) => {
    try {
      const myCart = [...cart];
      let idx = myCart.findIndex((item) => item._id === pid);
      myCart.splice(idx, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
      toast.success("Product removed successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/product/braintree/token",
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (!data?.token) console.log("here");
      setClientToken(data?.token);
    } catch (error) {
      console.log(error);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      const res = await loadRazorpayScript();

      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // Create order on backend
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/product/payment/orders",
        { amount: finalTotal },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      if (!data.success) {
        toast.error("Failed to create order");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_W9novgmLjyoNbf",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Your Store Name",
        description: "Payment for your order",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const { data: verifyData } = await axios.post(
              "http://localhost:8080/api/v1/product/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cart,
              },
              {
                headers: {
                  Authorization: auth?.token,
                },
              }
            );

            if (verifyData.success) {
              toast.success("Payment Successful!");
              localStorage.removeItem("cart");
              setCart([]);
              navigate("/dashboard/user/orders");
            } else {
              toast.error(verifyData.message || "Payment verification failed");
              // Don't clear cart on failed payment
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error(error.response?.data?.message || "Error in payment verification");
            // Don't clear cart on error
          }
        },
        prefill: {
          name: auth?.user?.name,
          email: auth?.user?.email,
          contact: auth?.user?.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Error in payment process");
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  // const handlePayment = async () => {
  //   try {
  //     setLoading(true);
  //     const { nonce } = await instance.requestPaymentMethod();
  //     const { data } = await axios.post(
  //       "http://localhost:8080/api/v1/product/braintree/payment",
  //       {
  //         nonce,
  //         cart,
  //       },
  //       {
  //         headers: {
  //           Authorization: auth?.token,
  //         },
  //       }
  //     );
  //     setLoading(false);
  //     localStorage.removeItem("cart");
  //     setCart([]);
  //     navigate("/dashboard/user/orders");
  //     toast.success("Payment Completed Successfully");
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };

  const totalPrice = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  const deliveryFee = totalPrice > 1000 ? 0 : 50;
  const finalTotal = totalPrice + deliveryFee;

  return (
    <Layout>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Shopping Cart
            </h1>
            <p className="text-gray-600 text-lg">
              {auth?.user?.name && `Welcome back, ${auth.user.name}!`}
            </p>
            <div className="flex items-center justify-center mt-4">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                {cart?.length} {cart?.length === 1 ? "item" : "items"} in cart
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {cart.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-8">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up!
            </p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] shadow-sm"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Cart Items
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {cart.map((product, index) => (
                    <div
                      key={index}
                      className="p-6 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0 group">
                          <img
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200 group-hover:scale-105 transition-transform duration-300"
                            src={`http://localhost:8080/api/v1/product/product-photo/${product._id}`}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-lg font-medium text-gray-900 mb-1 hover:text-blue-600 transition-colors cursor-pointer"
                            onClick={() => navigate(`/product/${product.slug}`)}
                          >
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-xl font-bold text-gray-900">
                                ₹{product.price.toLocaleString("en-IN")}
                              </span>
                              <div className="flex items-center border rounded-lg bg-white">
                                <button
                                  className="px-3 py-1 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() =>
                                    handleQuantityChange(
                                      product._id,
                                      (product.quantity || 1) - 1
                                    )
                                  }
                                  disabled={(product.quantity || 1) <= 1}
                                >
                                  -
                                </button>
                                <span className="px-4 py-1 border-x text-center min-w-[40px] font-medium">
                                  {product.quantity || 1}
                                </span>
                                <button
                                  className="px-3 py-1 hover:bg-gray-50 transition-colors"
                                  onClick={() =>
                                    handleQuantityChange(
                                      product._id,
                                      (product.quantity || 1) + 1
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <button
                              className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 transition-all duration-200"
                              onClick={() => handleCartItem(product._id)}
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-4">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order Summary
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Subtotal ({cart.length} items)
                      </span>
                      <span className="font-medium">
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery</span>
                      <span
                        className={`font-medium ${
                          deliveryFee === 0 ? "text-green-600" : ""
                        }`}
                      >
                        {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                      </span>
                    </div>
                    {deliveryFee === 0 && (
                      <p className="text-xs text-green-600 bg-green-50 p-2 rounded-lg">
                        🎉 Free delivery on orders above ₹1,000
                      </p>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{finalTotal.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Authentication Check */}
                  {!auth?.token ? (
                    <div className="space-y-3">
                      <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] shadow-sm"
                        onClick={() => navigate("/login", { state: "/cart" })}
                      >
                        Login to Checkout
                      </button>
                      <p className="text-xs text-gray-500 text-center">
                        Please login to proceed with your order
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Delivery Address */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                              Delivery Address
                            </h4>
                            {auth?.user?.address ? (
                              <p className="text-sm text-gray-600">
                                {auth.user.address}
                              </p>
                            ) : (
                              <p className="text-sm text-red-600">
                                No address added
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => navigate("/dashboard/user/profile")}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            {auth?.user?.address ? "Change" : "Add"}
                          </button>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <button
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                          auth?.user?.address
                            ? "bg-green-600 hover:bg-green-700 text-white hover:scale-[1.02] shadow-sm"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!auth?.user?.address}
                        onClick={handlePayment}
                      >
                        {auth?.user?.address
                          ? "Proceed to Payment"
                          : "Add Address to Continue"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Secure Checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Cart;

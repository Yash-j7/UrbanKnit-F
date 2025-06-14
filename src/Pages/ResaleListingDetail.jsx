import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Rate,
  message,
  Spin,
  Divider,
  Tag,
  Modal,
  Carousel,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/auth.jsx";
import { useCart } from "../context/CartContext.jsx";
import FootballLoading from "../components/FootballLoading.jsx";

function ResaleListingDetail() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();

  // Fetch listing details
  const fetchListing = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://urnanknit-backend.onrender.com/api/user-listings/${slug}`
      );
      if (res.data) {
        setListing(res.data);
      } else {
        message.error("Listing not found");
        navigate("/resale");
      }
    } catch (err) {
      console.error("Error fetching listing:", err);
      message.error(
        err.response?.data?.error || "Failed to fetch listing details"
      );
      navigate("/resale");
    } finally {
      setLoading(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      if (!authData || !authData.token) {
        message.error("Please login to add items to cart");
        navigate("/login");
        return;
      }

      const existingItem = cart.find((item) => item._id === listing._id);
      if (existingItem) {
        message.info("Item is already in your cart");
        return;
      }

      // Create cart item with image URL
      const cartItem = {
        ...listing,
        quantity: 1,
        image: `https://urnanknit-backend.onrender.com/api/user-listings/photo/${listing._id}`,
        type: "resale", // Add type to distinguish from regular products
      };

      setCart([...cart, cartItem]);
      message.success("Added to cart successfully");
    } catch (err) {
      console.error("Add to cart error:", err);
      message.error("Failed to add to cart");
    }
  };

  // Handle wishlist toggle
  const handleToggleWishlist = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      if (!authData || !authData.token) {
        message.error("Please login to add items to wishlist");
        navigate("/login");
        return;
      }

      const newWishlist = wishlist.includes(listing._id)
        ? wishlist.filter((id) => id !== listing._id)
        : [...wishlist, listing._id];
      setWishlist(newWishlist);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      message.success(
        wishlist.includes(listing._id)
          ? "Removed from wishlist"
          : "Added to wishlist"
      );
    } catch (err) {
      console.error("Wishlist error:", err);
      message.error("Failed to update wishlist");
    }
  };

  // Handle share
  const handleShare = async () => {
    try {
      await navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
      message.error("Failed to share listing");
    }
  };

  useEffect(() => {
    fetchListing();
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <FootballLoading />
        </div>
      </Layout>
    );
  }

  if (!listing) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Listing Not Found
            </h2>
            <Button type="primary" onClick={() => navigate("/resale")}>
              Back to Listings
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
              <img
                src={`https://urnanknit-backend.onrender.com/api/user-listings/photo/${listing._id}`}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-4">
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="large"
                className="flex-1 bg-green-500 hover:bg-green-600 border-0"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button
                type={wishlist.includes(listing._id) ? "primary" : "default"}
                icon={<HeartOutlined />}
                size="large"
                onClick={handleToggleWishlist}
                className={
                  wishlist.includes(listing._id)
                    ? "bg-red-500 hover:bg-red-600 border-0"
                    : ""
                }
              />
              <Button
                type="default"
                icon={<ShareAltOutlined />}
                size="large"
                onClick={handleShare}
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {listing.title}
              </h1>
              <div className="flex items-center gap-4">
                <Tag
                  color={
                    listing.condition === "New"
                      ? "success"
                      : listing.condition === "Used"
                      ? "warning"
                      : "processing"
                  }
                >
                  {listing.condition}
                </Tag>
                <Rate disabled defaultValue={4.5} />
                <span className="text-gray-500">(4.5)</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-gray-900">
              ₹{listing.price.toLocaleString("en-IN")}
            </div>

            <Divider />

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-600 whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Tag color="blue" className="px-3 py-1">
                    Category
                  </Tag>
                  <span className="text-gray-600">{listing.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag color="purple" className="px-3 py-1">
                    Listed
                  </Tag>
                  <span className="text-gray-600">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Seller Information
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserOutlined className="text-xl text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {listing.user?.name || "Anonymous Seller"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Member since{" "}
                    {new Date(listing.user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        <Modal
          title="Contact Seller"
          open={contactModalVisible}
          onCancel={() => setContactModalVisible(false)}
          footer={null}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MailOutlined className="text-xl text-gray-500" />
              <span className="text-gray-600">{listing.user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <PhoneOutlined className="text-xl text-gray-500" />
              <span className="text-gray-600">+91 1234567890</span>
            </div>
            <div className="flex items-center gap-3">
              <EnvironmentOutlined className="text-xl text-gray-500" />
              <span className="text-gray-600">Mumbai, India</span>
            </div>
            <div className="flex items-center gap-3">
              <ClockCircleOutlined className="text-xl text-gray-500" />
              <span className="text-gray-600">
                Usually responds within 24 hours
              </span>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}

export default ResaleListingDetail;

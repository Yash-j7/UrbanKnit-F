import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Input,
  Select,
  Spin,
  Empty,
  Badge,
  Rate,
  message,
  Tag,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  HeartOutlined,
  ReloadOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/auth.jsx";
import { useCart } from "../context/CartContext.jsx";
import FootballLoading from "../components/FootballLoading.jsx";

const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

function ResaleListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [cart, setCart] = useCart();

  const categories = [
    "Boots",
    "Jersey",
    "Accessories",
    "Signed Memorabilia",
    "Other",
  ];
  const conditions = ["New", "Used", "Signed"];

  // Fetch listings
  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://urnanknit-backend.onrender.com/api/user-listings"
      );
      if (res.data && Array.isArray(res.data)) {
        setListings(res.data);
      } else {
        setListings([]);
        message.error("Invalid data received from server");
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      message.error(err.response?.data?.error || "Failed to fetch listings");
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Handle add to cart
  const handleAddToCart = async (listing) => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      if (!auth || !auth.token) {
        message.error("Please login to add items to cart");
        navigate("/login");
        return;
      }

      // Check if item already exists in cart
      const existingItem = cart.find((item) => item._id === listing._id);
      let updatedCart;

      if (existingItem) {
        updatedCart = cart.map((item) =>
          item._id === listing._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        // Add new item to cart with type and image
        updatedCart = [
          ...cart,
          {
            ...listing,
            quantity: 1,
            type: "resale",
            image: `https://urnanknit-backend.onrender.com/api/user-listings/photo/${listing._id}`,
          },
        ];
      }

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      message.success("Added to cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      message.error("Failed to add to cart");
    }
  };

  // Handle wishlist toggle
  const handleToggleWishlist = async (listingId) => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      if (!auth || !auth.token) {
        message.error("Please login to add items to wishlist");
        navigate("/login");
        return;
      }

      // Toggle wishlist logic here
      const newWishlist = wishlist.includes(listingId)
        ? wishlist.filter((id) => id !== listingId)
        : [...wishlist, listingId];
      setWishlist(newWishlist);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      message.success(
        wishlist.includes(listingId)
          ? "Removed from wishlist"
          : "Added to wishlist"
      );
    } catch (err) {
      console.error("Wishlist error:", err);
      message.error("Failed to update wishlist");
    }
  };

  // Filter and sort listings
  const filteredListings = Array.isArray(listings)
    ? listings.filter((listing) => {
        const matchesSearch = listing.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesCategory = !category || listing.category === category;
        const matchesCondition = !condition || listing.condition === condition;
        return matchesSearch && matchesCategory && matchesCondition;
      })
    : [];

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.title.localeCompare(b.title);
      case "newest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setCategory("");
    setCondition("");
    setSortBy("newest");
    message.success("Filters reset");
  };

  useEffect(() => {
    fetchListings();
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <FootballLoading />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16 rounded-xl mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Football Collectibles Marketplace
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Buy and sell authentic football memorabilia, signed items, and
                collectibles from fellow enthusiasts.
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Search
              placeholder="Search listings..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <Select
              placeholder="Category"
              size="large"
              value={category}
              onChange={setCategory}
              allowClear
            >
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Condition"
              size="large"
              value={condition}
              onChange={setCondition}
              allowClear
            >
              {conditions.map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Sort by"
              size="large"
              value={sortBy}
              onChange={setSortBy}
            >
              <Option value="newest">Newest First</Option>
              <Option value="price-low">Price: Low to High</Option>
              <Option value="price-high">Price: High to Low</Option>
              <Option value="name">Name</Option>
            </Select>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              icon={<ReloadOutlined />}
              onClick={resetFilters}
              className="text-red-500 hover:text-red-600"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedListings.length > 0 ? (
            sortedListings.map((listing) => (
              <Card
                key={listing._id}
                hoverable
                cover={
                  <div className="aspect-square overflow-hidden">
                    <img
                      alt={listing.title}
                      src={`https://urnanknit-backend.onrender.com/api/user-listings/photo/${listing._id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                }
                actions={[
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/resale/${listing.slug}`)}
                  >
                    View
                  </Button>,
                  <Button
                    type="text"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleAddToCart(listing)}
                  >
                    Add to Cart
                  </Button>,
                  <Button
                    type="text"
                    icon={<HeartOutlined />}
                    onClick={() => handleToggleWishlist(listing._id)}
                    className={
                      wishlist.includes(listing._id)
                        ? "text-red-500"
                        : "text-gray-500"
                    }
                  />,
                ]}
              >
                <Meta
                  title={listing.title}
                  description={
                    <div className="space-y-2">
                      <p className="text-gray-600 line-clamp-2">
                        {listing.description}
                      </p>
                      <div className="flex items-center justify-between">
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
                        <span className="text-lg font-bold text-gray-900">
                          ₹{listing.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  }
                />
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Empty description="No listings found" className="py-12" />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ResaleListings;

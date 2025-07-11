import React, { useEffect, useRef, useState } from "react";
import Layout from "./../Layout/Layout";
import axios from "axios";
import {
  Card,
  Checkbox,
  Radio,
  Button,
  Collapse,
  Badge,
  Rate,
  Input,
  Select,
  Spin,
  Empty,
  Drawer,
  Carousel,
  Upload,
  Modal,
  Tabs,
  Typography,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  HeartOutlined,
  StarFilled,
  ReloadOutlined,
  SortAscendingOutlined,
  ArrowRightOutlined,
  FireOutlined,
  TagOutlined,
  ThunderboltOutlined,
  CameraOutlined,
  TrophyOutlined,
  TeamOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Age } from "./Prices";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.jsx";
import { useCart } from "../context/CartContext.jsx";
import FootballLoading from "../components/FootballLoading.jsx";

const { Meta } = Card;
const { Panel } = Collapse;
const { Search } = Input;
const { Option } = Select;
const { Dragger } = Upload;

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [cart, setCart] = useCart();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const location = useLocation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchType, setSearchType] = useState("text"); // 'text' or 'visual'

  const footballCategories = [
    { name: "Football Boots", icon: "👟", slug: "football-boots" },
    { name: "Jerseys", icon: "👕", slug: "jerseys" },
    { name: "Training Gear", icon: "⚽", slug: "training-gear" },
    { name: "Accessories", icon: "🎯", slug: "accessories" },
    { name: "Team Merchandise", icon: "🏆", slug: "team-merchandise" },
  ];

  // Handle search
  const handleSearch = async (value) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://urnanknit-backend.onrender.com/api/v1/product/search/${value}`
      );
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Search failed");
      setLoading(false);
    }
  };

  // Fetch products
  const getProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://urnanknit-backend.onrender.com/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setInitialLoading(false);
      if (data.success) setProducts(data.products);
    } catch (error) {
      setLoading(false);
      setInitialLoading(false);
      console.error(error);
      toast.error("Failed to load products");
    }
  };

  // Fetch categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "https://urnanknit-backend.onrender.com/api/v1/category/get-category"
      );
      if (data?.success) setCategories(data?.category);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        "https://urnanknit-backend.onrender.com/api/v1/product/product-count"
      );
      setTotal(data?.total);
    } catch (error) {
      console.error(error);
    }
  };

  // Load more products
  const loadmore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://urnanknit-backend.onrender.com/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      if (data.success) setProducts([...products, ...data?.products]);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  // Filter products
  const filterProduct = async () => {
    try {
      setInitialLoading(true);
      const { data } = await axios.post(
        "https://urnanknit-backend.onrender.com/api/v1/product/product-filters",
        {
          checked,
          radio,
          page: 1, // Reset to first page when filtering
        }
      );
      if (data?.success) {
        setProducts(data?.products);
        setPage(1); // Reset page number
        setTotal(data?.total || 0); // Update total count
      }
      setInitialLoading(false);
    } catch (error) {
      console.error(error);
      setInitialLoading(false);
      toast.error("Failed to apply filters");
    }
  };

  // Handle category filter
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Product added to cart");
  };

  // Handle wishlist toggle
  const toggleWishlist = (productId) => {
    const updatedWishlist = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    toast.success(
      wishlist.includes(productId)
        ? "Removed from wishlist"
        : "Added to wishlist"
    );
  };

  // Filter products by search term
  const filteredProducts = products;

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      case "newest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Reset all filters
  const resetFilters = () => {
    setChecked([]);
    setRadio([]);
    setPage(1);
    getProducts();
    toast.success("Filters reset successfully");
  };

  // Effect hooks
  useEffect(() => {
    getAllCategory();
    getTotal();
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    if (!checked.length && !radio.length) getProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  useEffect(() => {
    if (page === 1) return;
    loadmore();
  }, [page]);

  const shouldRenderButton = location.pathname === "/";

  // Filter Component
  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FilterOutlined className="mr-2" />
          Categories
        </h4>

        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {categories?.map((c) => (
            <Checkbox
              key={c._id}
              onChange={(e) => handleFilter(e.target.checked, c._id)}
              checked={checked.includes(c._id)}
              className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <span className="ml-2">{c.name}</span>
            </Checkbox>
          ))}
        </div>
      </div>

      <div>
        <h5 className="font-medium text-gray-700 mb-3">Age Range</h5>
        <Radio.Group
          onChange={(e) => setRadio(e.target.value)}
          value={radio}
          className="space-y-2"
        >
          {Age?.map((p) => (
            <Radio
              key={p._id}
              value={p.array}
              className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <span className="ml-2">{p.name}</span>
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <div className="flex gap-2">
        <Button
          type="primary"
          onClick={filterProduct}
          className="flex-1"
          icon={<FilterOutlined />}
        >
          Apply Filters
        </Button>
        <Button
          onClick={resetFilters}
          className="flex-1"
          icon={<ReloadOutlined />}
        >
          Reset
        </Button>
      </div>
    </div>
  );

  const fileInputRef = useRef(null);

  const handleDirectFileSelect = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file!");
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB!");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    toast.success(`File selected: ${file.name}`);
  };

  // Handle visual search
  const handleVisualSearch = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    try {
      setLoading(true);
      // toast.info("Processing image...");

      const formData = new FormData();
      formData.append("image", selectedFile);

      console.log("Sending file:", selectedFile);
      console.log("FormData entries:", [...formData.entries()]);

      const response = await axios.post(
        "https://urnanknit-backend.onrender.com/api/visual-search/search",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 second timeout
        }
      );

      if (response.data.success) {
        setProducts(response.data.results.map((result) => result.product));
        setIsModalVisible(false);
        toast.success("Visual search completed!");
      } else {
        toast.error(
          "Visual search failed: " + (response.data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error during visual search:", error);
      if (error.code === "ECONNABORTED") {
        toast.error("Search timeout - please try again");
      } else if (error.response) {
        toast.error(
          `Search failed: ${
            error.response.data?.message || error.response.statusText
          }`
        );
      } else {
        toast.error("Network error during visual search");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (info) => {
    const file = info.file.originFileObj;
    alert("File selected: " + file.name);
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB!");
        return;
      }
      console.log("Selected file:", file);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadProps = {
    name: "image",
    multiple: false,
    accept: "image/*",
    beforeUpload: () => false,
    onChange: handleFileSelect,
    showUploadList: false,
  };

  if (initialLoading) {
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
        <div className="max-w-4xl mx-auto mb-8">
          {/* Tabs for Search (Preserved) */}
          <Tabs
            activeKey={searchType}
            onChange={setSearchType}
            items={[
              {
                key: "text",
                label: (
                  <span className="flex items-center gap-2">
                    <SearchOutlined />
                    Text Search
                  </span>
                ),
                children: (
                  <div className="flex gap-4">
                    <Search
                      placeholder="Search for football boots, jerseys, accessories..."
                      allowClear
                      enterButton={<SearchOutlined />}
                      size="large"
                      onSearch={handleSearch}
                      className="flex-1"
                    />
                  </div>
                ),
              },
              {
                key: "visual",
                label: (
                  <span className="flex items-center gap-2">
                    <CameraOutlined />
                    Visual Search
                  </span>
                ),
                children: (
                  <div className="flex gap-4">
                    <Button
                      type="primary"
                      icon={<CameraOutlined />}
                      size="large"
                      onClick={() => setIsModalVisible(true)}
                      className="flex-1"
                    >
                      Upload Image to Search
                    </Button>
                  </div>
                ),
              },
            ]}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4"
          />

          {/* Visual Search Modal (Preserved) */}
          <Modal
            title="Visual Search"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>,
              <Button
                key="search"
                type="primary"
                onClick={handleVisualSearch}
                loading={loading}
                disabled={!selectedFile}
              >
                Search
              </Button>,
            ]}
            width={600}
          >
            <div className="flex flex-col gap-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleDirectFileSelect}
                  className="hidden"
                />
                <CameraOutlined className="text-4xl text-gray-400 mb-4" />
                <p className="text-lg text-gray-600 mb-2">
                  Click to select an image for visual search
                </p>
                <p className="text-sm text-gray-400">
                  Support for image files. Max size: 5MB
                </p>
              </div>

              {previewUrl && (
                <div className="text-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </Modal>
        </div>

        <div className="bg-gray-50 min-h-screen">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Your Ultimate Football Store
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Discover premium football gear, from professional boots to
                  official team jerseys. Everything a football enthusiast needs
                  in one place.
                </p>
                {/* Added football specific buttons - keeping original styling approach */}
                {/* <div className="mt-8 flex justify-center gap-4">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShopOutlined />}
                    onClick={() => navigate("/shop")}
                    className="bg-blue-600 hover:bg-blue-700 border-blue-600 px-6 py-3 text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Shop All Football Gear
                  </Button>
                  <Button
                    size="large"
                    icon={<TeamOutlined />}
                    onClick={() => navigate("/teams")}
                    className="bg-white border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 px-6 py-3 text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Browse Team Merchandise
                  </Button>
                </div> */}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Mobile Filter Button (Preserved) */}
              <div className="lg:hidden mb-4">
                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                  onClick={() => setFilterDrawerVisible(true)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <span>Filters</span>
                  {(checked.length > 0 || radio.length > 0) && (
                    <Badge count={checked.length + radio.length} size="small" />
                  )}
                </Button>
              </div>

              {/* Filters Sidebar - Desktop (Preserved) */}
              <div className="hidden lg:block lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-4">
                  {/* Updated Category Filter in Sidebar */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FilterOutlined className="mr-2" />
                        Categories
                      </h4>

                      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                        {categories?.map((c) => (
                          <Checkbox
                            key={c._id}
                            onChange={(e) =>
                              handleFilter(e.target.checked, c._id)
                            }
                            checked={checked.includes(c._id)}
                            className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
                          >
                            <span className="ml-2">{c.name}</span>
                          </Checkbox>
                        ))}
                      </div>
                    </div>

                    {/* Age Filter (Preserved) */}
                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">
                        Age Range
                      </h5>
                      <Radio.Group
                        onChange={(e) => setRadio(e.target.value)}
                        value={radio}
                        className="space-y-2"
                      >
                        {Age?.map((p) => (
                          <Radio
                            key={p._id}
                            value={p.array}
                            className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
                          >
                            <span className="ml-2">{p.name}</span>
                          </Radio>
                        ))}
                      </Radio.Group>
                    </div>
                  </div>

                  <Button
                    type="default"
                    icon={<ReloadOutlined />}
                    className="w-full mt-6 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
                    onClick={resetFilters}
                  >
                    Reset All Filters
                  </Button>
                </div>
              </div>

              {/* Products Grid (Preserved) */}
              <div className="flex-1">
                {loading && !initialLoading ? (
                  <div className="flex justify-center items-center min-h-[400px]">
                    <FootballLoading />
                  </div>
                ) : sortedProducts.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <Empty
                      description={
                        <span className="text-gray-500">
                          No football gear found
                        </span>
                      }
                    />
                  </div>
                ) : (
                  <>
                    <div
                      className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                      style={{
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(260px, 1fr))",
                      }}
                    >
                      {sortedProducts.map((p) => (
                        <Card
                          key={p._id}
                          hoverable
                          style={{
                            minWidth: 260,
                            maxWidth: 340,
                            margin: "auto",
                            overflow: "hidden",
                          }}
                          className="group relative border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-lg md:rounded-xl transform hover:-translate-y-1 md:hover:-translate-y-2 overflow-hidden flex flex-col justify-between"
                        >
                          {/* Cover Image and Overlays */}
                          <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                            <img
                              alt={p.name}
                              src={`https://urnanknit-backend.onrender.com/api/v1/product/product-photo/${p._id}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Desktop Quick Action Buttons */}
                            <div className="hidden lg:flex absolute inset-0 items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                              <Button
                                type="primary"
                                shape="circle"
                                icon={<EyeOutlined />}
                                onClick={() => navigate(`/product/${p.slug}`)}
                                className="bg-white/95 backdrop-blur-sm border-0 text-gray-800 hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
                                size="small"
                              />
                              <Button
                                type={
                                  wishlist.includes(p._id)
                                    ? "primary"
                                    : "default"
                                }
                                shape="circle"
                                icon={<HeartOutlined />}
                                onClick={() => toggleWishlist(p._id)}
                                className={`backdrop-blur-sm border-0 hover:scale-105 transition-all duration-200 shadow-lg ${
                                  wishlist.includes(p._id)
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-white/95 text-gray-800 hover:bg-white"
                                }`}
                                size="small"
                              />
                              <Button
                                type="primary"
                                shape="circle"
                                icon={<ShoppingCartOutlined />}
                                onClick={() => handleAddToCart(p)}
                                className="bg-green-500 hover:bg-green-600 border-0 hover:scale-105 transition-all duration-200 shadow-lg backdrop-blur-sm"
                                size="small"
                              />
                            </div>

                            {/* Price Badge */}
                            <div className="absolute top-3 left-3 z-10">
                              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">
                                <span className="text-sm font-bold whitespace-nowrap">
                                  ₹{p.price.toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>

                            {/* Stock Badge - Desktop */}
                            <div className="hidden md:block absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div
                                className={`px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm text-sm font-medium whitespace-nowrap ${
                                  p.quantity > 0
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                }`}
                              >
                                {p.quantity > 0
                                  ? "✓ In Stock"
                                  : "✗ Out of Stock"}
                              </div>
                            </div>

                            {/* Discount Badge */}
                            {p.originalPrice && p.originalPrice > p.price && (
                              <div className="absolute bottom-3 left-3 z-10">
                                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full shadow-md">
                                  <span className="text-sm font-bold whitespace-nowrap">
                                    {Math.round(
                                      ((p.originalPrice - p.price) /
                                        p.originalPrice) *
                                        100
                                    )}
                                    % OFF
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Card Body */}
                          <div
                            className="p-4 md:p-5 flex flex-col justify-between min-h-[320px]"
                            style={{ paddingBottom: "1.5rem" }}
                          >
                            {/* Title & Rating */}
                            <div className="mb-4">
                              <h3
                                className="font-semibold text-base md:text-lg text-gray-900 mb-2 truncate cursor-pointer hover:text-blue-600 transition-colors duration-200 leading-tight"
                                onClick={() => navigate(`/product/${p.slug}`)}
                                title={p.name}
                              >
                                {p.name}
                              </h3>

                              <div className="hidden sm:flex items-center gap-2 mb-3">
                                <Rate
                                  disabled
                                  defaultValue={4.2}
                                  allowHalf
                                  className="text-sm"
                                />
                                <span className="text-sm text-gray-600 font-medium">
                                  (4.2)
                                </span>
                                <span className="hidden lg:inline text-sm text-gray-400">
                                  •
                                </span>
                                <span className="hidden lg:inline text-sm text-gray-500">
                                  127 reviews
                                </span>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="hidden sm:block text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                              {p.description}
                            </p>

                            {/* Price */}
                            <div className="mb-4">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xl md:text-2xl font-bold text-gray-900">
                                    ₹{p.price.toLocaleString("en-IN")}
                                  </span>
                                  {p.originalPrice &&
                                    p.originalPrice > p.price && (
                                      <span className="text-sm text-gray-500 line-through">
                                        ₹
                                        {p.originalPrice.toLocaleString(
                                          "en-IN"
                                        )}
                                      </span>
                                    )}
                                </div>
                                {p.originalPrice &&
                                  p.originalPrice > p.price && (
                                    <span className="text-sm font-semibold text-green-600">
                                      Save ₹
                                      {(
                                        p.originalPrice - p.price
                                      ).toLocaleString("en-IN")}
                                    </span>
                                  )}
                              </div>
                            </div>

                            {/* Stock - Mobile */}
                            <div className="flex md:hidden items-center mb-4">
                              <div
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                  p.quantity > 0
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {p.quantity > 0
                                  ? "✓ In Stock"
                                  : "✗ Out of Stock"}
                              </div>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3">
                              <Button
                                type="primary"
                                onClick={() => handleAddToCart(p)}
                                disabled={p.quantity === 0}
                                className={`w-full h-10 text-sm font-medium rounded-lg transition-all duration-200 ${
                                  p.quantity === 0
                                    ? "bg-gray-300 border-gray-300 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0 shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
                                }`}
                                icon={
                                  <ShoppingCartOutlined className="text-sm" />
                                }
                              >
                                {p.quantity === 0
                                  ? "Out of Stock"
                                  : "Add to Cart"}
                              </Button>

                              <div className="flex gap-3">
                                <Button
                                  type="default"
                                  onClick={() => navigate(`/product/${p.slug}`)}
                                  className="flex-1 h-10 text-sm rounded-lg border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 transform hover:scale-[1.02]"
                                  icon={<EyeOutlined className="text-sm" />}
                                >
                                  <span className="hidden sm:inline lg:hidden xl:inline">
                                    View Details
                                  </span>
                                  <span className="sm:hidden lg:inline xl:hidden">
                                    View
                                  </span>
                                </Button>

                                <Button
                                  type={
                                    wishlist.includes(p._id)
                                      ? "primary"
                                      : "default"
                                  }
                                  onClick={() => toggleWishlist(p._id)}
                                  className={`h-10 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
                                    wishlist.includes(p._id)
                                      ? "bg-red-500 hover:bg-red-600 text-white border-0"
                                      : "border-gray-200 hover:border-red-500 hover:text-red-600"
                                  }`}
                                  icon={<HeartOutlined className="text-sm" />}
                                />
                              </div>
                            </div>

                            {/* Additional Info */}
                            <div className="pt-4 mt-4 border-t border-gray-100">
                              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-4 text-gray-500">
                                  <span className="flex items-center gap-1.5">
                                    <svg
                                      className="w-4 h-4"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    <span className="hidden sm:inline">
                                      Free Shipping
                                    </span>
                                    <span className="sm:hidden">Free Ship</span>
                                  </span>

                                  <span className="flex items-center gap-1.5">
                                    <svg
                                      className="w-4 h-4"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    <span className="hidden md:inline">
                                      Easy Returns
                                    </span>
                                    <span className="md:hidden">Returns</span>
                                  </span>
                                </div>

                                <span className="text-gray-500 font-mono">
                                  #{p._id.slice(-6).toUpperCase()}
                                </span>
                              </div>
                            </div>

                            {loading && (
                              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg md:rounded-xl">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                  <span className="text-xs text-gray-600">
                                    Adding...
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Load More Button (Preserved) */}
                    {products &&
                      shouldRenderButton &&
                      products.length < total && (
                        <div className="mt-12 text-center">
                          <Button
                            type="primary"
                            size="large"
                            loading={loading}
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(page + 1);
                            }}
                            className="px-8 py-2 h-12 text-base font-medium hover:scale-[1.02] transition-transform shadow-sm"
                          >
                            {loading ? "Loading..." : "Load More Football Gear"}
                          </Button>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer (Preserved) */}
        <Drawer
          title={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <div>
                  <span className="text-lg font-semibold text-gray-900">
                    Football Filters
                  </span>
                  {(checked.length > 0 || radio.length > 0) && (
                    <div className="text-xs text-gray-500 -mt-1">
                      {checked.length + radio.length} filter
                      {checked.length + radio.length !== 1 ? "s" : ""} applied
                    </div>
                  )}
                </div>
              </div>

              {(checked.length > 0 || radio.length > 0) && (
                <Button
                  type="text"
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={resetFilters}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 text-xs"
                >
                  Reset All
                </Button>
              )}
            </div>
          }
          placement="right"
          onClose={() => setFilterDrawerVisible(false)}
          open={filterDrawerVisible}
          width="100%"
          height="100%"
          className="filter-drawer md:!w-96"
          styles={{
            body: {
              padding: 0,
              background: "#ffffff",
              height: "calc(100vh - 140px)",
              overflowY: "auto",
            },
            header: {
              padding: "16px",
              borderBottom: "1px solid #e5e7eb",
              background: "#ffffff",
              position: "sticky",
              top: 0,
              zIndex: 10,
            },
            mask: {
              backdropFilter: "blur(4px)",
              background: "rgba(0, 0, 0, 0.3)",
            },
            wrapper: {
              boxShadow: "none",
            },
            content: {
              borderRadius: 0,
              height: "100vh",
            },
          }}
          closeIcon={
            <div className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          }
        >
          {/* Updated Category Filter in Mobile Drawer */}
          <div className="px-4 py-6 pb-20">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FilterOutlined className="mr-2" />
                  Categories
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {categories?.map((c) => (
                    <Checkbox
                      key={c._id}
                      onChange={(e) => handleFilter(e.target.checked, c._id)}
                      checked={checked.includes(c._id)}
                      className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      <span className="ml-2">{c.name}</span>
                    </Checkbox>
                  ))}
                </div>
              </div>

              {/* Age Filter (Preserved) */}
              <div>
                <h5 className="font-medium text-gray-700 mb-3">Age Range</h5>
                <Radio.Group
                  onChange={(e) => setRadio(e.target.value)}
                  value={radio}
                  className="space-y-2"
                >
                  {Age?.map((p) => (
                    <Radio
                      key={p._id}
                      value={p.array}
                      className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      <span className="ml-2">{p.name}</span>
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            </div>

            <Button
              type="default"
              icon={<ReloadOutlined />}
              className="w-full mt-6 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
              onClick={resetFilters}
            >
              Reset All Filters
            </Button>
          </div>

          {/* Mobile-optimized footer (Preserved) */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-20">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium">
                  {checked.length + radio.length}
                </span>{" "}
                filters active
              </div>
              <div className="flex gap-2">
                <Button
                  type="text"
                  onClick={() => setFilterDrawerVisible(false)}
                  className="text-gray-600 hover:text-gray-800 px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    // Apply filters logic here
                    setFilterDrawerVisible(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 border-blue-600 px-6 py-2"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    </Layout>
  );
}

export default HomePage;

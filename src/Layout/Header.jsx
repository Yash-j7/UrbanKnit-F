import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.jsx";
import toast from "react-hot-toast";
import SearchForm from "./../Pages/form/SearchForm";
import useCategory from "../hooks/useCategory.jsx";
import { useCart } from "../context/CartContext.jsx";
import { Sun, Moon, Menu, ShoppingCart, X } from "lucide-react";

function Header() {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    setIsOpen(false);
    if (option === "view") {
      navigate("/resale");
    } else if (option === "upload") {
      navigate("/upload-resale");
    }
  };
  // Handle dropdown hover with delay
  const handleDropdownHover = (isOpen, type) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }

    if (isOpen) {
      if (type === "category") {
        setCategoryDropdownOpen(true);
      } else {
        setUserDropdownOpen(true);
      }
    } else {
      const timeout = setTimeout(() => {
        if (type === "category") {
          setCategoryDropdownOpen(false);
        } else {
          setUserDropdownOpen(false);
        }
      }, 200); // 200ms delay before closing
      setDropdownTimeout(timeout);
    }
  };

  useEffect(() => {
    const element = document.documentElement;
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logged out successfully");
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50 font-inter">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
            aria-label="ProPitch Home"
          >
            ProPitch
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 font-semibold"
                    : ""
                }`
              }
            >
              Home
            </NavLink>

            {/* Category Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover(true, "category")}
              onMouseLeave={() => handleDropdownHover(false, "category")}
            >
              <button className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center space-x-1">
                <span>Category</span>
                <svg
                  className={`h-4 w-4 transform transition-transform duration-200 ${
                    categoryDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {categoryDropdownOpen && (
                <div className="absolute bg-white dark:bg-gray-700 rounded-lg shadow-lg mt-2 w-56 py-2 z-10 transform transition-all duration-200 ease-in-out">
                  <Link
                    to="/category"
                    className="block px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    All Categories
                  </Link>
                  {categories?.map((c) => (
                    <Link
                      key={c._id}
                      to={`/category/${c.slug}`}
                      className="block px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Links */}
            {!auth.user ? (
              <div className="flex items-center space-x-6">
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 font-semibold"
                        : ""
                    }`
                  }
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 font-semibold"
                        : ""
                    }`
                  }
                >
                  Login
                </NavLink>
              </div>
            ) : (
              <div
                className="relative"
                onMouseEnter={() => handleDropdownHover(true, "user")}
                onMouseLeave={() => handleDropdownHover(false, "user")}
              >
                <button className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center space-x-1">
                  <span>{auth?.user?.name}</span>
                  <svg
                    className={`h-4 w-4 transform transition-transform duration-200 ${
                      userDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {userDropdownOpen && (
                  <div className="absolute bg-white dark:bg-gray-700 rounded-lg shadow-lg mt-2 w-48 py-2 z-10 transform transition-all duration-200 ease-in-out">
                    <NavLink
                      to={`/dashboard/${
                        auth?.user?.role === 1 ? "admin" : "user"
                      }`}
                      className="block px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/"
                      onClick={handleLogout}
                      className="block px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      Logout
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            {/* Search Form */}
            <div className="ml-4">
              <SearchForm />
            </div>

            {/* Resale Options */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center space-x-1"
              >
                <span>Resale</span>
                <svg
                  className={`h-4 w-4 transform transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isOpen && (
                <div className="absolute bg-white dark:bg-gray-700 rounded-lg shadow-lg mt-2 w-48 py-2 z-10 transform transition-all duration-200 ease-in-out">
                  <button
                    onClick={() => handleOptionClick("view")}
                    className="w-full text-left px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    View Resale Listings
                  </button>
                  <button
                    onClick={() => handleOptionClick("upload")}
                    className="w-full text-left px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    Upload for Resale
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <NavLink
              to="/cart"
              className="relative flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              aria-label={`Cart with ${cart?.length} items`}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span>Cart</span>
              {cart?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart?.length}
                </span>
              )}
            </NavLink>

            {/* Theme Toggle */}
            {/* <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button> */}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 lg:hidden">
            <NavLink
              to="/cart"
              className="relative flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              aria-label={`Cart with ${cart?.length} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {cart?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart?.length}
                </span>
              )}
            </NavLink>
            <button
              className="text-gray-600 dark:text-gray-200 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed inset-0 bg-white dark:bg-gray-800 z-40 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ top: "60px" }}
        >
          <nav className="p-4 space-y-4">
            <NavLink
              to="/"
              className="block py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>

            <div className="space-y-2">
              <button
                className="w-full text-left py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              >
                Category
              </button>
              <div
                className={`pl-4 space-y-2 transform transition-all duration-200 ${
                  categoryDropdownOpen
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <Link
                  to="/category"
                  className="block py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Categories
                </Link>
                {categories?.map((c) => (
                  <Link
                    key={c._id}
                    to={`/category/${c.slug}`}
                    className="block py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Resale Options in Mobile Menu */}
            <div className="space-y-2">
              <button
                className="w-full text-left py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsOpen(!isOpen)}
              >
                Resale
              </button>
              <div
                className={`pl-4 space-y-2 transform transition-all duration-200 ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <button
                  onClick={() => {
                    handleOptionClick("view");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  View Resale Listings
                </button>
                <button
                  onClick={() => {
                    handleOptionClick("upload");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Upload for Resale
                </button>
              </div>
            </div>

            {!auth.user ? (
              <div className="space-y-2">
                <NavLink
                  to="/register"
                  className="block py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className="block py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
              </div>
            ) : (
              <div className="space-y-2">
                <NavLink
                  to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                  className="block py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Logout
                </NavLink>
              </div>
            )}

            <div className="py-2">
              <SearchForm />
            </div>

            {/* <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {theme === "light" ? (
                <>
                  <Moon className="h-5 w-5" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="h-5 w-5" />
                  <span>Light Mode</span>
                </>
              )}
            </button> */}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;

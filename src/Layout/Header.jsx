import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/auth.jsx";
import toast from "react-hot-toast";
import SearchForm from "./../Pages/form/SearchForm";
import useCategory from "../hooks/useCategory.jsx";
import { useCart } from "../context/CartContext.jsx";
import { Sun, Moon, Menu, ShoppingCart } from "lucide-react";

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

  // Handle dropdown hover with delay
  const handleDropdownHover = (isOpen, type) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
    
    if (isOpen) {
      if (type === 'category') {
        setCategoryDropdownOpen(true);
      } else {
        setUserDropdownOpen(true);
      }
    } else {
      const timeout = setTimeout(() => {
        if (type === 'category') {
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
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
          aria-label="Hospital Home"
        >
          Hospital
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-600 dark:text-gray-200 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <NavLink
            to="/"
            className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            activeClassName="text-blue-600 dark:text-blue-400 font-semibold"
          >
            Home
          </NavLink>

          {/* Category Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleDropdownHover(true, 'category')}
            onMouseLeave={() => handleDropdownHover(false, 'category')}
          >
            <button className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center">
              Category
              <svg
                className="ml-1 h-4 w-4"
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
              <div className="absolute bg-white dark:bg-gray-700 rounded-lg shadow-lg mt-2 w-48 z-10 py-1">
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
            <>
              <NavLink
                to="/register"
                className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                activeClassName="text-blue-600 dark:text-blue-400 font-semibold"
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                activeClassName="text-blue-600 dark:text-blue-400 font-semibold"
              >
                Login
              </NavLink>
            </>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => handleDropdownHover(true, 'user')}
              onMouseLeave={() => handleDropdownHover(false, 'user')}
            >
              <button className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center">
                {auth?.user?.name}
                <svg
                  className="ml-1 h-4 w-4"
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
                <div className="absolute bg-white dark:bg-gray-700 rounded-lg shadow-lg mt-2 w-48 z-10">
                  <NavLink
                    to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                    className="block px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/"
                    onClick={handleLogout}
                    className="block px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400"
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
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4">
            <NavLink
              to="/"
              className="block py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <div className="relative">
              <button
                className="block py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setMobileMenuOpen(true)}
              >
                Category
              </button>
              <div className="pl-4">
                <Link
                  to="/category"
                  className="block py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Categories
                </Link>
                {categories?.map((c) => (
                  <Link
                    key={c.id}
                    to={`/category/${c.slug}`}
                    className="block py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
            {!auth.user ? (
              <>
                <NavLink
                  to="/register"
                  className="block py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className="block py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                  className="block py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
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
                  className="block py-2 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Logout
                </NavLink>
              </>
            )}
            <div className="py-2">
              <SearchForm />
            </div>
          </nav>
        )}

        {/* Right Side: Theme Toggle and Cart */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
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
        </div>
      </div>
    </header>
  );
}

export default Header;

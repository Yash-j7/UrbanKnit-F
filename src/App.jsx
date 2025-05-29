import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Policy from "./Pages/Policy";
import PageNotFound from "./Pages/PageNotFound";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import Dashboard from "./Pages/user/Dashboard";
import PrivateRoute from "./Routes/Private.jsx";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import AdminRoute from "./Routes/AdminRoute";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import CreateCategory from "./Pages/Admin/CreateCategory.jsx";
import User from "./Pages/Admin/User.jsx";
import CreateProduct from "./Pages/Admin/CreateProduct.jsx";
import Orders from "./Pages/user/Orders.jsx";
import Profle from "./Pages/user/Profle.jsx";
import Products from "./Pages/Admin/Products.jsx";
import UpdateProduct from "./Pages/Admin/UpdateProduct";
import Search from "./Pages/Search.jsx";
import DetailedProduct from "./Pages/DetailedProduct.jsx";
import Categories from "./Pages/Categories.jsx";
import CategoryProduct from "./Pages/CategoryProduct.jsx";
import Cart from "./Pages/Cart";
import AdminOrders from "./Pages/Admin/AdminOrders.jsx";
function App() {
  return (
    <div className="dark:bg-slate-900 dark:text-white">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/category" element={<Categories />} />
        <Route path="/category/:slug" element={<CategoryProduct />} />

        <Route path="/product/:slug" element={<DetailedProduct />} />

        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/orders" element={<Orders />} />
          <Route path="user/profile" element={<Profle />} />
        </Route>
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path="admin/orders" element={<AdminOrders />} />

          <Route
            path="admin/update-product/:slug"
            element={<UpdateProduct />}
          />

          <Route path="admin/products" element={<Products />} />
          <Route path="admin/users" element={<User />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />

        <Route path="/login" element={<Login />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;

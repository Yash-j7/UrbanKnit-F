import React from "react";
import { NavLink } from "react-router-dom";

function UserMenu() {
  return (
    <div className="text-center">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h4 className="text-lg font-bold mb-4">User Panel</h4>
        <nav className="space-y-2">
          <NavLink
            to="/dashboard/user/profile"
            className="block py-2 px-4 rounded-lg text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition duration-300"
            activeClassName="bg-blue-500 text-white"
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/user/orders"
            className="block py-2 px-4 rounded-lg text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition duration-300"
            activeClassName="bg-blue-500 text-white"
          >
            Orders
          </NavLink>
          {/* <NavLink
        to="/dashboard/admin/products"
        className="block py-2 px-4 rounded-lg text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition duration-300"
        activeClassName="bg-blue-500 text-white"
      >
        Products
      </NavLink> */}
          {/* <NavLink
        to="/dashboard/admin/users"
        className="block py-2 px-4 rounded-lg text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition duration-300"
        activeClassName="bg-blue-500 text-white"
      >
        Users
      </NavLink> */}
          {/* <NavLink
            to="/dashboard/admin/users"
            className="block py-2 px-4 rounded-lg text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition duration-300"
            activeClassName="bg-blue-500 text-white"
          >
            Users
          </NavLink> */}
        </nav>
      </div>
    </div>
  );
}

export default UserMenu;

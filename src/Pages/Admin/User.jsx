import React from "react";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Layout/AdminMenu";

function User() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Admin Menu */}
          <div className="md:col-span-3">
            <AdminMenu />
          </div>
          {/* Admin Information */}
          <div className="md:col-span-9">
            <div className="bg-white shadow-md rounded-lg p-4"></div>
            <div>Users</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default User;

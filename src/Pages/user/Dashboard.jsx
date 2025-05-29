import React from "react";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import UserMenu from "../../Layout/UserMenu";

function Dashboard() {
  const [auth] = useAuth();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <UserMenu />
          </div>
          {/* Admin Information */}
          <div className="md:col-span-9">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-xl font-bold mb-4">User Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700">USer Name:</p>
                  <p className="font-semibold">{auth?.user?.name}</p>
                </div>
                <div>
                  <p className="text-gray-700">USer Email:</p>
                  <p className="font-semibold">{auth?.user?.email}</p>
                </div>
                <div>
                  <p className="text-gray-700">USer Contact:</p>
                  <p className="font-semibold">{auth?.user?.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Layout from "../../Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth.jsx";
import UserMenu from "./../../Layout/UserMenu";

function Profile() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [auth, setAuth] = useAuth();

  useEffect(() => {
    if (auth?.user) {
      const { name, address, email, phone, password } = auth.user;
      setName(name);
      setAddress(address);
      setEmail(email);
      setPhone(phone);
      //setPassword(password);
    }
  }, [auth?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(
        "http://localhost:8080/api/v1/auth/profile",
        {
          name,
          email,
          password,
          phone,
          address,
        },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth((prevAuth) => {
          const updatedAuth = { ...prevAuth, user: data.updatedUser };
          localStorage.setItem("auth", JSON.stringify(updatedAuth));
          return updatedAuth;
        });
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <UserMenu />
          </div>
          <div className="md:col-span-9">
            <div className="bg-white shadow-md rounded-lg p-4"></div>
            <div>
              <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-12">
                  <h2 className="text-2xl font-semibold text-center mb-6">
                    Update Details
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <input
                        id="name"
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        disabled
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        id="phone"
                        type="tel"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        id="password"
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        id="address"
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;

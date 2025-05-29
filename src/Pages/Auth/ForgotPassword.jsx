import React, { useState } from "react";
import Layout from "../../Layout/Layout.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPasssword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");

  const navigate = useNavigate();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //const port = process.env.VITE_API_URL;
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/forgotPassword",
        {
          email,
          newPassword,
          answer,
        }
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);

        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Forgot Password
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                id="email"
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                id="answer"
                type="answer"
                placeholder="Answer"
                required
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <input
                id="newPassword"
                type="Password"
                placeholder="New Password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                RESET
              </button>
            </div>
            <div className="text-center mt-3"></div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasssword;

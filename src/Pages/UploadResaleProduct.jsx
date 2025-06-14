import { useState } from "react";
import axios from "axios";
import Layout from "../Layout/Layout";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const UploadResaleProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    price: "",
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Boots",
    "Jersey",
    "Accessories",
    "Signed Memorabilia",
    "Other",
  ];
  const conditions = ["New", "Used", "Signed"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        message.error("Image size should be less than 2MB");
        e.target.value = null;
        return;
      }
      // Validate file type
      if (!file.type.startsWith("image/")) {
        message.error("Please upload an image file");
        e.target.value = null;
        return;
      }
      setPhoto(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.condition ||
      !formData.price
    ) {
      message.error("Please fill in all required fields");
      return;
    }

    if (!photo) {
      message.error("Please upload a photo");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    data.append("photo", photo);

    try {
      setLoading(true);
      const auth = JSON.parse(localStorage.getItem("auth"));
      if (!auth || !auth.token) {
        message.error("Please login to upload a product");
        navigate("/login");
        return;
      }

      console.log("Sending request with data:", {
        formData: Object.fromEntries(data.entries()),
        photo: photo.name,
      });

      const res = await axios.post(
        "https://urnanknit-backend.onrender.com/api/user-listings",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth.token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log("Upload progress:", percentCompleted);
          },
        }
      );

      if (res.data) {
        message.success("Product uploaded successfully!");
        navigate("/resale"); // Redirect to listings page
      }
    } catch (err) {
      console.error("Upload error:", err);
      if (err.response?.status === 401) {
        message.error("Please login to upload a product");
        navigate("/login");
      } else if (err.response?.data?.details) {
        message.error(err.response.data.details);
      } else {
        message.error(err.response?.data?.error || "Failed to upload product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow mt-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Upload Product for Resale
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 rounded border dark:bg-gray-800 dark:text-white"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 rounded border dark:bg-gray-800 dark:text-white"
            rows={4}
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-3 rounded border dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
            className="w-full p-3 rounded border dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select Condition</option>
            {conditions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full p-3 rounded border dark:bg-gray-800 dark:text-white"
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            />
            {photo && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Selected file: {photo.name} (
                {(photo.size / 1024 / 1024).toFixed(2)}MB)
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Upload Product"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default UploadResaleProduct;

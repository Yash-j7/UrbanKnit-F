import React, { useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

function CreateProduct() {
  const [auth] = useAuth();
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");

  // Fetch categories from the API
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "https://urnanknit-backend.onrender.com/api/v1/category/get-category",
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting categories");
    }
  };

  // Call getAllCategory on component mount
  useEffect(() => {
    getAllCategory();
  }, []);

  const navigate = useNavigate();

  // Handle form submission
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("category", category);
      productData.append("shipping", shipping);
      if (photo) {
        productData.append("photo", photo);
      }

      const { data } = await axios.post(
        "https://urnanknit-backend.onrender.com/api/v1/product/create-product",
        productData,
        {
          headers: {
            Authorization: auth?.token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.success) {
        setTimeout(() => {
          navigate("/dashboard/admin/products");
        }, 1500);
        toast.success("Product created successfully");
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in creating product");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <AdminMenu />
          </div>
          <div className="col-span-9">
            <h1 className="text-2xl font-bold mb-4">Create Product</h1>
            <form onSubmit={handleCreate}>
              <div>
                <label className="block mb-2">Category</label>
                <Select
                  placeholder="Select a category"
                  size="large"
                  className="w-full border rounded-lg"
                  onChange={(val) => setCategory(val)}
                >
                  {categories.map((category) => (
                    <Option key={category._id} value={category._id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block mb-2">Upload Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border rounded-lg p-2"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
                <div>
                  {photo && (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="product_photo"
                        height={"200px"}
                        className="img h-[200px]"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <input
                  type="text"
                  value={name}
                  placeholder="Product name"
                  className="w-full border rounded-lg p-2"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <textarea
                  value={description}
                  placeholder="Product description"
                  className="w-full border rounded-lg p-2"
                  rows="4"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="number"
                  value={price}
                  placeholder="Product Age"
                  className="w-full border rounded-lg p-2"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="number"
                  value={quantity}
                  placeholder="Product Relatives"
                  className="w-full border rounded-lg p-2"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <Select
                  placeholder="Have you been in this UrbanKnit before"
                  size="large"
                  className="w-full border rounded-lg"
                  onChange={(val) => setShipping(val)}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white rounded-lg p-2"
                >
                  Entry Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateProduct;

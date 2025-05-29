import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import CategoryForm from "../form/CategoryForm";
import { useAuth } from "../../context/auth";
import { Modal } from "antd";

function CreateCategory() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [auth, setAuth] = useAuth();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/category/create-category",
        {
          name,
        },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (data?.success) {
        toast.success(`${name} is created`);
        getAllCategory();
        setName("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      // toast.error("somthing went wrong in input form");
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/category/get-category",
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
      toast.error("Something wwent wrong in getting catgeory");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `http://localhost:8080/api/v1/category/update-category/${selected._id}`,

        {
          name: updatedName,
        },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (data?.success) {
        toast.success(`${updatedName} is updated`);
        getAllCategory();
        setUpdatedName("");
        setSelected(null);
        setVisible(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      // toast.error("somthing went wrong in input form");
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8080/api/v1/category/delete-category/${categoryId}`,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (data?.success) {
        toast.success("Category deleted successfully");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in deleting category");
    }
  };

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
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="overflow-x-auto">
                <CategoryForm
                  handleSubmit={handleSubmit}
                  value={name}
                  setValue={setName}
                />
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories?.map((c) => (
                      <tr key={c._id}>
                        <td>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-primary ms-2"
                            onClick={() => {
                              setVisible(true);
                              setUpdatedName(c.name);
                              setSelected(c);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn bg-red-500 ms-2"
                            onClick={() => {
                              handleDelete(c._id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Modal
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
              >
                <CategoryForm
                  value={updatedName}
                  setValue={setUpdatedName}
                  handleSubmit={handleUpdate}
                />
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateCategory;

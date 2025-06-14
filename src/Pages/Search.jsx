import React, { useState } from "react";
import { useSearch } from "../context/Search.jsx";
import Layout from "../Layout/Layout";
import { NavLink } from "react-router-dom";
import { Tabs, Typography } from 'antd';
import { SearchOutlined, CameraOutlined } from '@ant-design/icons';
import VisualSearch from "../components/VisualSearch.jsx";

const { Title } = Typography;

function Search() {
  const [values, setValues] = useSearch();
  const [activeTab, setActiveTab] = useState('text');

  const items = [
    {
      key: 'text',
      label: (
        <span className="flex items-center gap-2">
          <SearchOutlined />
          Text Search
        </span>
      ),
      children: (
        <div className="text-center">
          <Title level={4} className="mb-6">
            {values?.results.length < 1
              ? "No results found"
              : `Found ${values.results.length} results`}
          </Title>
          <div className="m-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values?.results.map((p) => (
                <div
                  className="card card-compact bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                  key={p._id}
                >
                  <figure className="relative h-48">
                    <img
                      src={`https://urnanknit-backend.onrender.com/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{p.name}</h2>
                    <p className="line-clamp-2">{p.description}</p>
                    <div className="card-actions justify-end mt-4">
                      <NavLink to={`/dashboard/admin/update-product/${p.slug}`}>
                        <button className="btn btn-primary">Update</button>
                      </NavLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'visual',
      label: (
        <span className="flex items-center gap-2">
          <CameraOutlined />
          Visual Search
        </span>
      ),
      children: <VisualSearch />,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Title level={2} className="text-center mb-8">
          Search Products
        </Title>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4"
          size="large"
        />
      </div>
    </Layout>
  );
}

export default Search;

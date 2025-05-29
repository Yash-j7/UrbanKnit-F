import React from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom";

function About() {
  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8 lg:px-10 bg-white shadow-lg rounded-lg">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
            About UrbanKnit
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Welcome to <span className="font-semibold">UrbanKnit</span> – your
            one-stop destination for trendy, high-quality fashion that fits your
            lifestyle. We are passionate about bringing you modern, affordable,
            and comfortable clothing designed with you in mind.
          </p>

          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Customer-Centric Fashion
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            At <span className="font-semibold">UrbanKnit</span>, every customer
            is at the heart of what we do. Our collections are curated to
            reflect the latest trends while keeping comfort and quality as our
            top priorities. Whether you're shopping for daily wear, office
            looks, or something for a special occasion, we’ve got you covered.
          </p>

          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            What We Offer
          </h2>
          <ul className="list-disc pl-6 text-lg text-gray-700 mb-6">
            <li>Wide range of men's and women's clothing</li>
            <li>Seasonal fashion drops and limited-edition collections</li>
            <li>Easy-to-use online shopping experience</li>
            <li>Secure payment and fast delivery</li>
            <li>Dedicated customer support</li>
          </ul>

          <h2 className="text-2xl font-bold text-blue-600 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Our mission is simple: to make fashion accessible, exciting, and
            empowering. We believe everyone deserves to feel confident in what
            they wear. With UrbanKnit, you don’t just wear clothes — you express
            yourself.
          </p>

          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Why Shop With Us?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            UrbanKnit is more than just an online store — it's a community of
            style-savvy individuals who care about quality and affordability. We
            use sustainable practices where possible and aim to reduce our
            environmental footprint, all while delivering fresh looks to your
            wardrobe.
          </p>

          <div className="text-center mt-10">
            <Link
              to="/contact"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default About;

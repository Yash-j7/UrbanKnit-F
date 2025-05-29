import React from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom";

function About() {
  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8 lg:px-10 bg-white shadow-lg rounded-lg">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
            About Us
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Welcome to <span className="font-semibold">Our UrbanKnit</span>,
            where our top priority is providing exceptional healthcare services
            to our Products. We are dedicated to the highest standards of
            medical care, ensuring that every Product receives compassionate,
            personalized treatment. From the moment you enter our UrbanKnit, you
            will experience a warm and caring environment, designed to provide
            the best possible outcomes for your health.
          </p>

          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Product-Centered Care
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            At <span className="font-semibold">Our UrbanKnit</span>, we believe
            that every Product is unique and deserves customized care. We work
            closely with Products and their families to develop personalized
            treatment plans that address their specific health needs. Our
            multidisciplinary team of doctors, nurses, and healthcare
            professionals ensures that each Product’s medical history, current
            condition, and long-term health goals are taken into consideration.
          </p>

          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Our Services
          </h2>
          <ul className="list-disc pl-6 text-lg text-gray-700 mb-6">
            <li>Comprehensive Product health records management</li>
            <li>Advanced diagnostic tools and lab results tracking</li>
            <li>Personalized treatment plans for chronic conditions</li>
            <li>Medication history and prescription management</li>
            <li>Critical care and emergency services</li>
          </ul>

          <h2 className="text-2xl font-bold text-blue-600 mb-4">Our Vision</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Our vision is to create a healthcare system where Products are
            empowered with their health information, allowing them to make
            informed decisions. We are continually investing in advanced
            technology to enhance our services, ensuring that Products have
            access to their medical history, past treatments, lab results, and
            more—all in one place.
          </p>

          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            With a commitment to excellence,{" "}
            <span className="font-semibold">Our UrbanKnit</span> combines
            cutting-edge technology with compassionate care. Our Product
            management system allows us to keep track of every Product’s
            details, conditions, and treatment history, ensuring that every
            decision is informed by the best available data. We strive to make
            your healthcare journey seamless and stress-free, while prioritizing
            your well-being at every step.
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

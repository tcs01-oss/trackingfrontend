import React from 'react';
import { FaShippingFast, FaCheckCircle, FaLock } from 'react-icons/fa';

const About = () => {
  return (
    <div className="bg-white text-gray-800 dark:bg-boxdark dark:text-bodydark">
      {/* Hero Section */}
      <div className="relative bg-gray-50 py-20 dark:bg-meta-4">
        <div className="mx-auto max-w-c-1390 px-4 text-center md:px-8 2xl:px-0">
          <h1 className="mb-4 text-3xl font-bold text-black dark:text-white md:text-4xl">
            About Our Service
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            We provide a simple and reliable way to track your courier and orders digitally. 
            Our platform helps customers stay informed about their shipment location, status, 
            and estimated delivery time — all in one place.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mx-auto max-w-c-1390 px-4 py-16 md:px-8 2xl:px-0">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-black dark:text-white md:text-3xl">
            Why Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-lg border border-stroke bg-white p-8 text-center shadow-default transition hover:shadow-lg dark:border-strokedark dark:bg-boxdark">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FaShippingFast className="text-3xl" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-black dark:text-white">
              Simple Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Just enter your tracking ID to get instant updates
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-lg border border-stroke bg-white p-8 text-center shadow-default transition hover:shadow-lg dark:border-strokedark dark:bg-boxdark">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FaCheckCircle className="text-3xl" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-black dark:text-white">
              Reliable Updates
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Manually verified shipment status for accuracy
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-lg border border-stroke bg-white p-8 text-center shadow-default transition hover:shadow-lg dark:border-strokedark dark:bg-boxdark">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FaLock className="text-3xl" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-black dark:text-white">
              Fast & Secure
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Designed for speed, privacy, and ease of use
            </p>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="bg-gray-50 py-16 dark:bg-meta-4">
        <div className="mx-auto max-w-c-1390 px-4 text-center md:px-8 2xl:px-0">
          <h2 className="mb-6 text-2xl font-bold text-black dark:text-white md:text-3xl">
            Our Mission
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
            Our mission is to make courier tracking easy, transparent, and accessible for everyone 
            — without complex systems or unnecessary features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

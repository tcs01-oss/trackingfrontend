import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/contactmessages`, formData);

      if (response.status === 200 || response.status === 201) {
        toast.success('Message sent successfully!');
        setSuccessMessage('We will receive your message we will connect you as soon as possible.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-c-1390 px-4 py-12 md:px-8 2xl:px-0">
      
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold text-black dark:text-white md:text-4xl">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Have a question about your shipment or tracking ID? We’re here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        
        {/* Contact Form */}
        <div className="rounded-2xl border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div className="mb-5">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Your Message
              </label>
              <textarea
                rows={6}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here"
                required
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-4 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
            {successMessage && (
              <div className="mt-4 rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
                {successMessage}
              </div>
            )}
          </form>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-center space-y-8">
          
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FaEnvelope className="text-xl" />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-semibold text-black dark:text-white">
                Support Email
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                <a href="mailto:tbsdeliverypartner@gmail.com" className="hover:text-primary">
                  tbsdeliverypartner@gmail.com
                </a>
              </p>
            </div>
          </div>

         

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FaClock className="text-xl" />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-semibold text-black dark:text-white">
                Working Hours
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                24×7 Customer Support
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;

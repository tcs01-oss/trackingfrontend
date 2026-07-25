import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaCopy, FaCheckCircle, FaBoxOpen } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateTracking = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [generatedTrackingId, setGeneratedTrackingId] = useState('');
  const [createdData, setCreatedData] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGeneratedTrackingId('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API_BASE_URL}/api/tracking`, 
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
      
      if (response.data && response.data.tracking_id) {
        setGeneratedTrackingId(response.data.tracking_id);
        if (response.data.data) {
            setCreatedData(response.data.data);
        }
        toast.success(response.data.message || 'Tracking ID created successfully!');
      } else {
        toast.error('Failed to retrieve tracking ID from server.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to create tracking ID.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedTrackingId) {
      navigator.clipboard.writeText(generatedTrackingId);
      toast.success('Tracking ID copied to clipboard!');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '' });
    setGeneratedTrackingId('');
    setCreatedData(null);
    setErrors({});
  };

  return (
    <>
      <Breadcrumb pageName="Create Tracking ID" />

      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Generate New Shipment
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Generate a unique tracking ID for a new shipment and assign it to a customer.
            </p>
          </div>

          {!generatedTrackingId ? (
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Customer Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter customer full name"
                    className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input ${
                      errors.name ? 'border-meta-1' : 'border-stroke dark:border-form-strokedark'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-meta-1">{errors.name}</p>}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email Address <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter customer email address"
                    className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input ${
                      errors.email ? 'border-meta-1' : 'border-stroke dark:border-form-strokedark'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-meta-1">{errors.email}</p>}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Phone Number <span className="text-sm text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}  
                    onChange={handleChange}
                    placeholder="Enter mobile number (optional)"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Mobile number is optional and can be added later.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-70"
                >
                  {loading ? 'Creating...' : '➡️ Create Tracking ID'}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
                  <FaCheckCircle className="text-4xl" />
                </div>
              </div>
              
              <h3 className="mb-2 text-2xl font-bold text-black dark:text-white">
                Tracking ID Created Successfully!
              </h3>
              
              <div className="mb-8 text-gray-500 dark:text-gray-400">
                 <p className="mb-2">The shipment has been registered for:</p>
                 <div className="inline-block rounded bg-gray-50 p-4 text-left dark:bg-meta-4">
                    <p><strong>Name:</strong> {createdData?.name || formData.name}</p>
                    <p><strong>Email:</strong> {createdData?.email || formData.email}</p>
                    {(createdData?.phone || formData.phone) && <p><strong>Phone:</strong> {createdData?.phone || formData.phone}</p>}
                 </div>
              </div>

              <div className="mx-auto mb-8 max-w-md rounded-lg border-2 border-dashed border-primary/30 bg-gray-50 p-6 dark:bg-meta-4">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Generated Tracking ID
                </p>
                <div className="flex items-center justify-center gap-3">
                  <FaBoxOpen className="text-2xl text-primary" />
                  <span className="text-3xl font-bold text-black dark:text-white tracking-widest">
                    {generatedTrackingId}
                  </span>
                </div>
              </div>

              <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
                <button
                  onClick={copyToClipboard}
                  className="flex flex-1 items-center justify-center gap-2 rounded bg-white border border-stroke p-3 font-medium text-black hover:bg-gray-50 dark:bg-meta-4 dark:border-strokedark dark:text-white dark:hover:bg-opacity-90"
                >
                  <FaCopy /> Copy ID
                </button>
                <button
                  onClick={resetForm}
                  className="flex flex-1 items-center justify-center gap-2 rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
                >
                  Create Another
                </button>
              </div>

              <p className="mt-6 text-sm text-gray-500">
                Share this tracking ID with the customer to track their shipment.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateTracking;

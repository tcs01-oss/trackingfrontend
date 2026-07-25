import React, { useState } from 'react';
import axios from 'axios';
import { FaPhoneAlt, FaBox, FaShippingFast, FaClock, FaSearch } from 'react-icons/fa';
import CoverImage from '../../images/cover/cover-01.png'; // Using existing cover image
import Logo from '../../images/logo/logo1.png'; // Assuming logo exists here based on previous context

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper functions for date/time formatting
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
      if (!timeString) return 'N/A';
      // If it's a full ISO string
      if (timeString.includes('T')) {
        try {
          return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) { return timeString; }
      }
      // If it's HH:MM:SS
      const [hours, minutes] = timeString.split(':');
      if (hours && minutes) {
          const h = parseInt(hours, 10);
          const ampm = h >= 12 ? 'PM' : 'AM';
          const hour12 = h % 12 || 12;
          return `${hour12}:${minutes} ${ampm}`;
      }
      return timeString;
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/customer-tracking/${trackingId}`);
      setTrackingData(response.data);
    } catch (err: any) {
      console.error("Tracking Error:", err);
      if (err.response && err.response.status === 404) {
         setError('Tracking ID not found. Please check your ID and try again.');
      } else {
         setError('Currently Not getting your data or try after sometime');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full font-sans text-body">
      
      {/* Hero Section */}
      <div className="relative flex min-h-screen w-full items-center justify-center bg-gray-900">
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={CoverImage} 
            alt="Logistics Background" 
            className="h-full w-full object-cover opacity-60" 
          />
          <div className="absolute inset-0 bg-black/50 mix-blend-multiply"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-4 py-12 md:flex-row md:px-8 lg:px-12">
          
          {/* Left Side: Hero Text (Desktop) / Top (Mobile) */}
          <div className="mb-10 w-full text-center md:mb-0 md:w-1/2 md:text-left lg:w-3/5">
            <h1 className="mb-4 text-4xl font-extrabold uppercase tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
              Track Your <span className="text-orange-500">Order</span>
            </h1>
            <p className="mb-6 text-lg font-medium text-gray-200 sm:text-xl">
              Enter your tracking number to get the latest location and delivery status instantly.
            </p>
            
            {/* Minimal Features (Optional/Secondary) */}
            <div className="mt-8 hidden flex-wrap gap-6 text-sm font-semibold text-white/90 md:flex">
               <div className="flex items-center gap-2">
                 <FaBox className="text-orange-400" /> Secure Delivery
               </div>
               <div className="flex items-center gap-2">
                 <FaShippingFast className="text-orange-400" /> Real-time Updates
               </div>
               <div className="flex items-center gap-2">
                 <FaClock className="text-orange-400" /> On-time Service
               </div>
            </div>
          </div>

          {/* Right Side: Tracking Card (Desktop) / Bottom (Mobile) */}
          <div className="w-full max-w-md md:w-1/2 lg:w-2/5">
            <div className="rounded-2xl bg-orange-600 p-1 shadow-2xl backdrop-blur-sm bg-opacity-90 dark:bg-orange-700">
              <div className="rounded-xl bg-white p-6 shadow-inner dark:bg-boxdark sm:p-8">
                
                {/* Card Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20">
                       <FaSearch />
                     </div>
                     <h2 className="text-xl font-bold text-black dark:text-white">Track Shipment</h2>
                  </div>
                  {/* Optional Logo in Card */}
                  <img src={Logo} alt="Logo" className="h-8 w-auto opacity-80" />
                </div>

                <form onSubmit={handleTrack} className="flex flex-col gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your tracking number"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-gray-50 px-4 py-3 text-black outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Ex: TRK-123456789
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-black py-4 text-base font-bold text-white transition hover:bg-gray-800 disabled:bg-gray-400 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    {loading ? 'TRACKING...' : 'TRACK YOUR ORDER'}
                  </button>
                </form>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 rounded-lg bg-red-100 p-4 text-center text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {error}
                  </div>
                )}

                {/* Tracking Result */}
                {trackingData && (
                  <div className="mt-6 animate-fadeIn rounded-lg border border-stroke bg-gray-50 p-5 dark:border-strokedark dark:bg-meta-4">
                    <h3 className="mb-3 text-lg font-bold text-black dark:text-white border-b border-stroke pb-2 dark:border-strokedark">
                      Tracking Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-500 dark:text-gray-400">Status:</span>
                        <span className={`font-bold ${
                          trackingData.current_status === 'Delivered' ? 'text-green-500' : 
                          trackingData.current_status === 'Cancelled' ? 'text-red-500' : 
                          'text-orange-500'
                        }`}>
                          {trackingData.current_status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-500 dark:text-gray-400">Location:</span>
                        <span className="font-semibold text-black dark:text-white">{trackingData.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-500 dark:text-gray-400">Estimated Date:</span>
                        <span className="font-semibold text-black dark:text-white">{formatDate(trackingData.estimated_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-500 dark:text-gray-400">Estimated Time To Arrival:</span>
                        <span className="font-semibold text-black dark:text-white">{formatTime(trackingData.estimated_time)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-500 dark:text-gray-400">Receiver:</span>
                        <span className="font-semibold text-black dark:text-white">{trackingData.name}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Support Line */}
                <div className="mt-6 border-t border-stroke pt-4 text-center dark:border-strokedark">
                 
                </div>

              </div>
            </div>
            
            {/* Mobile Features (Visible only on small screens below card) */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-semibold text-white/90 md:hidden">
               <div className="flex items-center gap-2">
                 <FaBox className="text-orange-400" /> Secure
               </div>
               <div className="flex items-center gap-2">
                 <FaShippingFast className="text-orange-400" /> Fast
               </div>
               <div className="flex items-center gap-2">
                 <FaClock className="text-orange-400" /> On-time
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

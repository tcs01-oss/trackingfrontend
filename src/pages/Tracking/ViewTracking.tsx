import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaCopy, FaSearch} from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ITEMS_PER_PAGE = 15;

interface TrackingData {
  id: string | number;
  tracking_id: string;
  name: string;
  email: string;
  phone?: string;
  created_at?: string;
}

const ViewTracking = () => {
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [filteredData, setFilteredData] = useState<TrackingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTrackingData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, trackingData]);

  // Pagination Logic
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const fetchTrackingData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/api/tracking`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      // Handle response structure variations
      const data = Array.isArray(response.data) 
        ? response.data 
        : (response.data.data || []);
        
      setTrackingData(data);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      toast.error('Failed to load tracking records.');
      
      // Fallback mock data for demonstration if API fails/is empty (Optional, but helpful for UI dev)
      // Remove this in production if not desired
      if (trackingData.length === 0) {
         // Keeping empty state or could add mock data here
      }
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    if (!searchTerm.trim()) {
      setFilteredData(trackingData);
      setCurrentPage(1);
      return;
    }

    const lowerTerm = searchTerm.toLowerCase();
    const filtered = trackingData.filter((item) => 
      item.name?.toLowerCase().includes(lowerTerm) ||
      item.tracking_id?.toLowerCase().includes(lowerTerm) ||
      item.email?.toLowerCase().includes(lowerTerm) ||
      item.phone?.toLowerCase().includes(lowerTerm)
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied: ${text}`);
  };

  return (
    <>
      <Breadcrumb pageName="View All Tracking" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        
        {/* Header & Search */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Tracking Records
          </h4>
          
          <div className="relative">
            <button className="absolute left-0 top-1/2 -translate-y-1/2 pl-3">
              <FaSearch className="text-gray-500 hover:text-primary" />
            </button>
            <input
              type="text"
              placeholder="Search by ID, Name, Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-stroke bg-gray-50 py-2.5 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary sm:w-64"
            />
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Tracking ID
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Customer Name
                </th>
                <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                  Contact Email
                </th>
                <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                  Contact Phone
                </th>
               
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center"> 
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <span className="ml-2 font-medium">Loading records...</span>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No tracking records found.
                  </td>
                </tr>
              ) : (
                currentItems.map((item, key) => (
                  <tr key={key} className="border-b border-stroke dark:border-strokedark">
                    <td className="py-5 px-4 pl-9 xl:pl-11">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-black dark:text-white">
                          {item.tracking_id}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(item.tracking_id)} 
                          className="text-gray-500 hover:text-primary"
                          title="Copy Tracking ID"
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-black dark:text-white">{item.name}</p>
                    </td>
                     <td className="py-5 px-4">
                      <p className="text-black dark:text-white">{item.email}</p>
                    </td>
                    

                    <td className="py-5 px-4">
                      <p className="text-black dark:text-white">{item.phone}</p>
                    </td>
                   
                   
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4 border-t border-stroke pt-4 dark:border-strokedark">
           <div className="text-sm text-gray-600 dark:text-gray-400">
             Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
           </div>
           <div className="flex space-x-2">
             <button
               onClick={prevPage}
               disabled={currentPage === 1}
               className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-opacity-90'}`}
             >
               Previous
             </button>
             <button
               onClick={nextPage}
               disabled={currentPage === totalPages}
               className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-opacity-90'}`}
             >
               Next
             </button>
           </div>
        </div>
      </div>
    </>
  );
};

export default ViewTracking;

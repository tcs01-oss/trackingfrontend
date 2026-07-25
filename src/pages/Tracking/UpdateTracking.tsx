import React, { useState, useEffect, useRef } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaEdit, FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTrash, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import flatpickr from 'flatpickr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ITEMS_PER_PAGE = 15;

interface TrackingData {
  id: number | string;
  tracking_id: string;
  email: string;
  location: string;
  estimated_date: string;
  estimated_time: string;
  status: string;
}

const UpdateTracking = () => {
  const [trackingList, setTrackingList] = useState<TrackingData[]>([]);
  const [filteredList, setFilteredList] = useState<TrackingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState<TrackingData | null>(null);
  const [updating, setUpdating] = useState(false);
  
  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [trackingToDelete, setTrackingToDelete] = useState<TrackingData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const datePickerRef = useRef<HTMLInputElement>(null);
  const timePickerRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    location: '',
    estimated_date: '',
    estimated_time: '',
    status: 'In process',
  });

  const fetchTrackingData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/api/tracking`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      if (response.data && Array.isArray(response.data)) {
        setTrackingList(response.data);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
         setTrackingList(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch tracking data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingData();
  }, []);

  useEffect(() => {
    // Filter logic
    let result = trackingList;
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.email && item.email.toLowerCase().includes(lowerTerm)) ||
        (item.tracking_id && item.tracking_id.toLowerCase().includes(lowerTerm))
      );
    }
    setFilteredList(result);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, trackingList]);

  // Pagination Logic
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  useEffect(() => {
    if (isModalOpen) {
      // Ensure flatpickr is above the modal
      const style = document.createElement('style');
      style.innerHTML = `
        .flatpickr-calendar {
          z-index: 9999999 !important;
        }
      `;
      document.head.appendChild(style);

      const dateInstance = datePickerRef.current ? flatpickr(datePickerRef.current, {
        mode: 'single',
        monthSelectorType: 'static',
        dateFormat: 'Y-m-d',
        defaultDate: formData.estimated_date,
        prevArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8L1.4 6.8 5.4 2.8 6.8 4.2 4.2 6.8 6.8 9.4z" /></svg>',
        nextArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L5.4 6.8 1.4 2.8 0 4.2 2.6 6.8 0 9.4z" /></svg>',
        onChange: (selectedDates, dateStr) => {
          setFormData(prev => ({ ...prev, estimated_date: dateStr }));
        },
      }) : null;

      const timeInstance = timePickerRef.current ? flatpickr(timePickerRef.current, {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
        time_24hr: true,
        defaultDate: formData.estimated_time,
        prevArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8L1.4 6.8 5.4 2.8 6.8 4.2 4.2 6.8 6.8 9.4z" /></svg>',
        nextArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L5.4 6.8 1.4 2.8 0 4.2 2.6 6.8 0 9.4z" /></svg>',
        onChange: (selectedDates, dateStr) => {
           setFormData(prev => ({ ...prev, estimated_time: dateStr }));
        }
      }) : null;

      return () => {
        if (dateInstance) dateInstance.destroy();
        if (timeInstance) timeInstance.destroy();
        document.head.removeChild(style);
      };
    }
  }, [isModalOpen]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return dateString;
      return date.toISOString().split('T')[0];
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // If it's a full date string, extract time
    if (timeString.includes('T')) {
       try {
         const date = new Date(timeString);
         if (isNaN(date.getTime())) return timeString;
         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
       } catch (e) {
         return timeString;
       }
    }
    // If it's HH:MM:SS, just return HH:MM
    if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
      return timeString.substring(0, 5);
    }
    return timeString;
  };

  const openModal = (tracking: TrackingData) => {
    setSelectedTracking(tracking);
    setFormData({
      location: tracking.location || '',
      estimated_date: formatDate(tracking.estimated_date),
      estimated_time: formatTime(tracking.estimated_time),
      status: tracking.status || 'In process',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTracking(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTracking) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('authToken');
      
      // Payload for POST /api/status
      const payload = {
        tracking_record_id: selectedTracking.id,
        location: formData.location,
        estimated_date: formData.estimated_date,
        estimated_time: formData.estimated_time,
        status: formData.status
      };
      
      console.log('Sending update payload:', payload);

      await axios.post(
        `${API_BASE_URL}/api/status`,
        payload,
        {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        }
      );
      
      toast.success('Status updated successfully');
      closeModal();
      fetchTrackingData(); // Refresh list to show updated data
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  // Delete Handlers
  const openDeleteModal = (tracking: TrackingData) => {
    setTrackingToDelete(tracking);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTrackingToDelete(null);
  };

  const handleDelete = async () => {
    if (!trackingToDelete) return;
    
    setDeleting(true);
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_BASE_URL}/api/tracking/${trackingToDelete.id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      
      toast.success('Tracking record and related updates deleted successfully');
      closeDeleteModal();
      fetchTrackingData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete tracking record');
    } finally {
      setDeleting(false);
    }
  };

  const newLocal = "Cancelled";
  const newLocal1 = "Returned";
  return (
    <>
      <Breadcrumb pageName="Update Tracking Status" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        
        {/* Search Bar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:ring-primary"
              placeholder="Search by Email or Tracking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                  Email
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Location
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Est. Date
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Est. Time
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-5 text-center">Loading...</td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-5 text-center">No tracking records found</td>
                </tr>
              ) : (
                currentItems.map((item, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {item.tracking_id}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{item.email}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{item.location}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{formatDate(item.estimated_date)}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{formatTime(item.estimated_time)}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                     <p
  className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
    item.status === 'Delivered'
      ? 'bg-success text-success'
      : item.status === 'Out for delivery'
      ? 'bg-warning text-warning'
      : item.status === 'In process'
      ? 'bg-primary text-primary'
      : item.status === 'Cancelled'
      ? 'bg-danger text-danger'
      : item.status === 'Booking'
      ? 'bg-info text-info'
      : item.status === 'Returned'
      ? 'bg-success text-success'
      : 'bg-gray-100 text-gray-600'
      
  }`}
>
  {item.status}
</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button
                          onClick={() => openModal(item)}
                          className="hover:text-primary"
                          title="Update Status"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="hover:text-danger"
                          title="Delete Tracking"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4 pb-4">
           <div className="text-sm text-gray-600 dark:text-gray-400">
             Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredList.length)} of {filteredList.length} entries
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed left-0 top-0 z-999999 flex h-full w-full items-center justify-center bg-black/90 px-4 py-5">
          <div className="w-full max-w-142.5 rounded-lg bg-white py-4 px-4 text-center dark:bg-boxdark md:py-8 md:px-17.5">
             <div className="flex flex-col items-center">
               <div className="bg-red-100 p-4 rounded-full mb-4">
                 <FaExclamationTriangle className="text-red-500 text-4xl" />
               </div>
               <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                 Confirm Deletion
               </h3>
               <p className="mb-6 text-gray-600 dark:text-gray-400">
                 Are you sure you want to delete tracking ID <strong>{trackingToDelete?.tracking_id}</strong>? This action cannot be undone.
               </p>
               
               <div className="flex w-full justify-center gap-4">
                 <button
                   onClick={closeDeleteModal}
                   className="w-1/3 rounded border border-stroke bg-gray p-3 font-medium text-black transition hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:bg-meta-1"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleDelete}
                   disabled={deleting}
                   className="w-1/3 rounded border border-danger bg-danger p-3 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-70"
                 >
                   {deleting ? 'Deleting...' : 'Delete'}
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {isModalOpen && (
        <div className="fixed left-0 top-0 z-999999 flex h-full w-full items-center justify-center bg-black/90 px-4 py-5">
          <div className="w-full max-w-142.5 rounded-lg bg-white py-4 px-4 text-center dark:bg-boxdark md:py-8 md:px-17.5 max-h-[90vh] overflow-y-auto">
            <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
              Update Tracking Status
            </h3>
            <span className="mx-auto mb-6 block h-1 w-20 rounded bg-primary"></span>
            
            <form onSubmit={handleUpdate}>
              <div className="mb-5.5 text-left">
                 <label className="mb-2.5 block text-black dark:text-white">
                    Tracking ID
                 </label>
                 <input
                    type="text"
                    value={selectedTracking?.tracking_id}
                    readOnly
                    className="w-full rounded border-[1.5px] border-stroke bg-gray-100 py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-meta-4 dark:text-white"
                 />
              </div>

              <div className="mb-5.5 text-left">
                <label className="mb-2.5 block text-black dark:text-white">
                  Current Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter current location"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  <FaMapMarkerAlt className="absolute right-4 top-4 text-gray-500" />
                </div>
              </div>

              <div className="mb-5.5 text-left">
                <label className="mb-2.5 block text-black dark:text-white">
                  Status
                </label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="Booking">Booking</option>
                    <option value="In process">In Process</option>
                    <option value="Out for delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value={newLocal}>Cancelled</option>
                    <option value={newLocal1}>Returned</option>
                  </select>
                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill=""
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2 text-left">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Estimated Date
                  </label>
                  <div className="relative">
                    <input
                      ref={datePickerRef}
                      type="text"
                      name="estimated_date"
                      placeholder="YYYY-MM-DD"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
                    />
                    <FaCalendarAlt className="absolute right-4 top-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                <div className="w-full sm:w-1/2 text-left">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Estimated Time
                  </label>
                  <div className="relative">
                    <input
                      ref={timePickerRef}
                      type="text"
                      name="estimated_time"
                      placeholder="HH:MM"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
                    />
                    <FaClock className="absolute right-4 top-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="-mx-3 flex flex-wrap gap-y-4">
                <div className="w-full px-3 2xsm:w-1/2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                  >
                    Cancel
                  </button>
                </div>
                <div className="w-full px-3 2xsm:w-1/2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90 disabled:opacity-70"
                  >
                    {updating ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateTracking;
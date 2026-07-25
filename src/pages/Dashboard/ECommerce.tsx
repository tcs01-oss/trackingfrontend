import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import { FaBox, FaCheck, FaTruck, FaClipboardList, FaArrowRight, FaPlus, FaPenToSquare } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ECommerce: React.FC = () => {
  const [counts, setCounts] = useState({
    total: 0,
    delivered: 0,
    process: 0,
    booking: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('authToken') ? { Authorization: `Bearer ${localStorage.getItem('authToken')}` } : {}),
        };

        const response = await fetch(`${API_BASE_URL}/api/tracking`, { headers });
        const result = await response.json();
        
        // Handle different response structures (array or { data: [] })
        const trackingData = Array.isArray(result) ? result : (Array.isArray(result?.data) ? result.data : []);

        const total = trackingData.length;
        const delivered = trackingData.filter((item: any) => item.status === 'Delivered').length;
        const process = trackingData.filter((item: any) => ['In process', 'Out for delivery'].includes(item.status)).length;
        const booking = trackingData.filter((item: any) => item.status === 'Booking').length;

        setCounts({
          total,
          delivered,
          process,
          booking
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats 
            title="Total Shipments" 
            total={loading ? "..." : counts.total.toString()} 
            link="/admin/view-tracking"
        >
          <FaBox className="fill-primary dark:fill-white text-xl" />
        </CardDataStats>
        
        <CardDataStats 
            title="Delivered" 
            total={loading ? "..." : counts.delivered.toString()} 
            link="/admin/view-tracking"
        >
          <FaCheck className="fill-success dark:fill-white text-xl" />
        </CardDataStats>
        
        <CardDataStats 
            title="In Transit" 
            total={loading ? "..." : counts.process.toString()} 
            link="/admin/view-tracking"
        >
          <FaTruck className="fill-primary dark:fill-white text-xl" />
        </CardDataStats>

        <CardDataStats 
            title="Booking" 
            total={loading ? "..." : counts.booking.toString()} 
            link="/admin/view-tracking"
        >
          <FaClipboardList className="fill-warning dark:fill-white text-xl" />
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne 
            deliveredCount={counts.delivered} 
            processCount={counts.process} 
            bookingCount={counts.booking} 
        />
        
        <div className="col-span-12 xl:col-span-4">
            <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    Quick Actions
                </h4>
                
                <div className="flex flex-col gap-4">
                    <Link 
                        to="/admin/create-tracking"
                        className="flex items-center justify-between rounded bg-primary/5 p-4 text-primary hover:bg-primary/10 transition"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                                <FaPlus />
                            </div>
                            <span className="font-medium">Create Tracking</span>
                        </div>
                        <FaArrowRight />
                    </Link>
                    
                    <Link 
                        to="/admin/update-tracking"
                        className="flex items-center justify-between rounded bg-primary/5 p-4 text-primary hover:bg-primary/10 transition"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                                <FaPenToSquare />
                            </div>
                            <span className="font-medium">Update Status</span>
                        </div>
                        <FaArrowRight />
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default ECommerce;

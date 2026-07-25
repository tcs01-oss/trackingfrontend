import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaTrash, FaEnvelope, FaPhone, FaUser, FaClock } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at?: string;
}

const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/api/contact`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      
      const data = response.data;
      // Handle potential different response structures
      const messageList = Array.isArray(data) ? data : (data.data || []);
      setMessages(messageList);
    } catch (err) {
      console.error(err);
      setError('Network error while loading messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_BASE_URL}/api/contactmessages/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      toast.success('Message deleted successfully');
      setMessages(messages.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Error deleting message');
    }
  };

  return (
    <>
      <Breadcrumb pageName="Contact Messages" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Inbox Messages
          </h4>
        </div>

        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : error ? (
          <div className="p-4 text-center text-danger">{error}</div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No messages found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className="relative rounded-lg border border-stroke bg-gray-50 p-6 shadow-sm transition hover:shadow-md dark:border-strokedark dark:bg-meta-4"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <FaUser />
                    </div>
                    <div>
                      <h5 className="font-semibold text-black dark:text-white">
                        {msg.name}
                      </h5>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="text-gray-500 hover:text-danger"
                    title="Delete Message"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FaEnvelope className="text-xs" />
                    <span className="break-all">{msg.email}</span>
                  </div>
                  {msg.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <FaPhone className="text-xs" />
                      <span>{msg.phone}</span>
                    </div>
                  )}
                </div>

                <div className="rounded bg-white p-3 text-sm text-gray-700 dark:bg-boxdark dark:text-gray-300 border border-stroke dark:border-strokedark">
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ContactMessages;

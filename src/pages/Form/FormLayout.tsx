import { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { toast } from 'react-toastify';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FormLayout = () => {
  const [packageName, setPackageName] = useState('');
  const [price, setPrice] = useState('');
  const [adminFee, setAdminFee] = useState('');
  const [salesmanFee, setSalesmanFee] = useState('');
  const [duration, setDuration] = useState('monthly');

  const durationToDays: Record<string, number> = {
    monthly: 30,
    quarterly: 90,
    halfyearly: 180,
    yearly: 365,
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      package_name: packageName,
      jumpstart_admin: parseFloat(adminFee || '0'),
      jumpstart_salesman: parseFloat(salesmanFee || '0'),
      duration_days: durationToDays[duration] || 30,
      price: parseFloat(price || '0'),
    };
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/super-admin/packages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        toast.error('Failed to create package');
        return;
      }
      toast.success('Package successfully created');
      setPackageName('');
      setPrice('');
      setAdminFee('');
      setSalesmanFee('');
      setDuration('monthly');
    } catch {
      toast.error('Network error');
    }
  };

  return (
    <>
      <Breadcrumb pageName="Create Package" />

    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-4xl">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Optional: small header inside card */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-700">Package details</h2>
              <p className="mt-1 text-sm text-gray-500">Add package name, pricing and duration.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Package name full width */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Package Name</label>
                <input
                  type="text"
                  placeholder="Enter package name"
                  className="block w-full rounded-lg border border-gray-200 bg-white py-3 px-4 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                />
              </div>

              {/* Two-column grid for fees + duration */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Subscription Fees</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Enter price"
                      className="block w-full rounded-lg border border-gray-200 bg-white py-3 px-4 pr-14 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">₹</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Jumpstart Admin Fees</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter admin fees"
                    className="block w-full rounded-lg border border-gray-200 bg-white py-3 px-4 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                    value={adminFee}
                    onChange={(e) => setAdminFee(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Jumpstart Salesman Fees</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter salesman fees"
                    className="block w-full rounded-lg border border-gray-200 bg-white py-3 px-4 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                    value={salesmanFee}
                    onChange={(e) => setSalesmanFee(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Duration</label>
                  <select
                    className="block w-full rounded-lg border border-gray-200 bg-white py-3 px-4 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="halfyearly">Half Yearly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              {/* Features / helper area (optional) */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-sm text-gray-500">Tip: use meaningful package names to help customers pick faster.</p>
                <div className="w-full md:w-1/3">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 py-3 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                  >
                    Create Package
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default FormLayout;

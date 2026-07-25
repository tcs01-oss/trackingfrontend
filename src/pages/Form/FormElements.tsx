import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ConfirmModal';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FormElements = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [editValues, setEditValues] = useState<any>({
    price: '',
    jumpstart_admin: '',
    jumpstart_salesman: '',
    duration_days: '',
  });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<any | null>(null);

const fetchPackages = async () => {
  setLoading(true);
  setError('');

  try {
    const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/super-admin/packages`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

    if (!res.ok) throw new Error('Failed to load packages');

    const data = await res.json();
    setPackages(Array.isArray(data.data) ? data.data : []); // Access the nested data

  } catch (e: any) {
    setError('Failed to load packages');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchPackages();
  }, []);

  const daysToLabel = (days: number) => {
    if (days === 30) return 'Monthly';
    if (days === 90) return 'Quarterly';
    if (days === 180) return 'Half Yearly';
    if (days === 365) return 'Yearly';
    return `${days} days`;
  };

  const onDelete = async (pkg: any) => {
    try {
      const token = localStorage.getItem('authToken');
      const url = pkg?.id
        ? `${API_BASE_URL}/super-admin/packages/${pkg.id}`
        : `${API_BASE_URL}/super-admin/packages`;
      const init: any = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      };
      if (!pkg?.id) {
        init.body = JSON.stringify({ package_name: pkg.package_name });
      }
      const res = await fetch(url, init);
      if (!res.ok) {
        toast.error('Failed to delete package');
        return;
      }
      toast.success('Package deleted');
      fetchPackages();
    } catch {
      toast.error('Network error');
    }
  };
  const askDelete = (pkg: any) => {
    setToDelete(pkg);
    setConfirmDeleteOpen(true);
  };
  const confirmDelete = async () => {
    if (!toDelete) return;
    setConfirmDeleteOpen(false);
    await onDelete(toDelete);
    setToDelete(null);
  };
  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setToDelete(null);
  };

  const openEdit = async (pkg: any) => {
    if (pkg?.id) {
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch(`${API_BASE_URL}/super-admin/packages/${pkg.id}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const json = await res.json();
          const data = json?.data ?? json;
          setEditing(data);
          setEditValues({
            price: data.price?.toString?.() ?? '',
            jumpstart_admin: data.jumpstart_admin?.toString?.() ?? '',
            jumpstart_salesman: data.jumpstart_salesman?.toString?.() ?? '',
            duration_days: data.duration_days?.toString?.() ?? '',
          });
          return;
        }
      } catch {}
    }
    setEditing(pkg);
    setEditValues({
      price: pkg.price?.toString?.() ?? '',
      jumpstart_admin: pkg.jumpstart_admin?.toString?.() ?? '',
      jumpstart_salesman: pkg.jumpstart_salesman?.toString?.() ?? '',
      duration_days: pkg.duration_days?.toString?.() ?? '',
    });
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      const token = localStorage.getItem('authToken');
      const url = editing?.id
        ? `${API_BASE_URL}/super-admin/packages/${editing.id}`
        : `${API_BASE_URL}/super-admin/packages`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          package_name: editing.package_name,
          price: parseFloat(editValues.price || '0'),
          jumpstart_admin: parseFloat(editValues.jumpstart_admin || '0'),
          jumpstart_salesman: parseFloat(editValues.jumpstart_salesman || '0'),
          duration_days: parseInt(editValues.duration_days || '30', 10),
        }),
      });
      if (!res.ok) {
        toast.error('Failed to update package');
        return;
      }
      toast.success('Package updated');
      setEditing(null);
      fetchPackages();
    } catch {
      toast.error('Network error');
    }
  };

  return (
    <>
      <Breadcrumb pageName="Form Elements" />

      <div className="grid grid-cols-1 gap-9 xl:grid-cols-3">
        {loading && (
          <div className="rounded-sm border border-stroke bg-white p-6.5 text-center dark:border-strokedark dark:bg-boxdark">
            Loading packages...
          </div>
        )}
        {error && (
          <div className="rounded-sm border border-red-300 bg-red-50 p-4 text-red-600 dark:border-red-500 dark:bg-transparent">
            {error}
          </div>
        )}
        {!loading && !error && packages.length === 0 && (
          <div className="rounded-sm border border-stroke bg-white p-6.5 text-center dark:border-strokedark dark:bg-boxdark">
            No packages found
          </div>
        )}

        {packages.map((pkg, idx) => {
          const accents = [
            { text: 'text-rose-600', bg: 'bg-rose-600', border: 'border-rose-600' },
            { text: 'text-blue-700', bg: 'bg-blue-700', border: 'border-blue-700' },
            { text: 'text-teal-600', bg: 'bg-teal-600', border: 'border-teal-600' },
          ];
          const a = accents[idx % accents.length];
          return (
            <div
              key={pkg.id ?? pkg.package_name}
              className={`relative rounded-[36px] border border-stroke bg-white shadow-xl dark:border-strokedark dark:bg-boxdark`}
            >
              <div className="relative p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className={`text-2xl font-semibold ${a.text} tracking-wide`}>{pkg.package_name}</h3>
                  <div className={`relative ${a.bg} text-white px-3 py-1 rounded`}>₹ {Number(pkg.price).toFixed(2)}
                    <span className={`absolute right-[-12px] top-1/2 -translate-y-1/2 h-0 w-0 border-y-8 border-y-transparent border-l-8 ${a.text}`}></span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${a.text}`}>✓</span>
                    <div className="flex-1 border-b border-stroke pb-2">
                      <div className="text-black dark:text-white">Subscription Fees</div>
                      <div className="text-bodydark2">₹ {Number(pkg.price).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${a.text}`}>✓</span>
                    <div className="flex-1 border-b border-stroke pb-2">
                      <div className="text-black dark:text-white">Jumpstart Admin</div>
                      <div className="text-bodydark2">₹ {Number(pkg.jumpstart_admin).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${a.text}`}>✓</span>
                    <div className="flex-1 border-b border-stroke pb-2">
                      <div className="text-black dark:text-white">Jumpstart Salesman</div>
                      <div className="text-bodydark2">₹ {Number(pkg.jumpstart_salesman).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${a.text}`}>✓</span>
                    <div className="flex-1 border-b border-stroke pb-2">
                      <div className="text-black dark:text-white">Duration</div>
                      <div className="text-bodydark2">{daysToLabel(Number(pkg.duration_days))}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <button onClick={() => 
                    openEdit(pkg)} className={`rounded px-5 py-2 text-white ${a.bg} hover:bg-opacity-90`}>Edit</button>
                  <button onClick={() => askDelete(pkg)} className={`rounded px-5 py-2 ${a.text} border ${a.border} hover:bg-opacity-10`}>Delete</button>
                </div>
              </div>
              <div className={`absolute left-4 bottom-14 h-0 w-0 border-y-12 border-y-transparent border-l-12 ${a.text}`}></div>
              <div className="absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-[36px] bg-black/5 dark:bg-black/40"></div>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center justify-between">
              <h3 className="font-medium text-black dark:text-white">Edit {editing.package_name}</h3>
              <button onClick={() => setEditing(null)} className="text-bodydark2 hover:text-black dark:hover:text-white">✕</button>
            </div>
            <form onSubmit={submitEdit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">Subscription Fees</label>
                  <input type="number" step="0.01" value={editValues.price} onChange={(e) => setEditValues({ ...editValues, price: e.target.value })} className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
                </div>
                <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white">Jumpstart Admin</label>
                    <input type="number" step="0.01" value={editValues.jumpstart_admin} onChange={(e) => setEditValues({ ...editValues, jumpstart_admin: e.target.value })} className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
                  </div>
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white">Jumpstart Salesman</label>
                    <input type="number" step="0.01" value={editValues.jumpstart_salesman} onChange={(e) => setEditValues({ ...editValues, jumpstart_salesman: e.target.value })} className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
                  </div>
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">Duration (days)</label>
                  <input type="number" value={editValues.duration_days} onChange={(e) => setEditValues({ ...editValues, duration_days: e.target.value })} className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
                </div>
                <div className="mt-4 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setEditing(null)} className="rounded border border-stroke px-4 py-2 text-bodydark2 hover:bg-gray-100 dark:hover:bg-[#1F2937]">Cancel</button>
                  <button type="submit" className="rounded border border-primary bg-primary px-4 py-2 text-white hover:bg-opacity-90">Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmDeleteOpen}
        title="Delete Package"
        message={toDelete ? `You’re going to delete “${toDelete.package_name}”` : ''}
        confirmText="Yes, Delete!"
        cancelText="No, keep it."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default FormElements;

import { useState, useEffect } from 'react';
import api from '../utils/api';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('All Status');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rating: 0,
    status: 'Active',
    notes: ''
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/suppliers');
      setSuppliers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      rating: 0,
      status: 'Active',
      notes: ''
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/suppliers/${editingId}`, formData);
      } else {
        await api.post('/suppliers', formData);
      }
      setShowModal(false);
      resetForm();
      fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Failed to save supplier');
    }
  };

  const handleEdit = (supplier) => {
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone || '',
      rating: supplier.rating || 0,
      status: supplier.status,
      notes: supplier.notes || ''
    });
    setEditingId(supplier._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await api.delete(`/suppliers/${id}`);
        fetchSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('Failed to delete supplier');
      }
    }
  };

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = status === 'All Status' || s.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fade-in">
      {loading && suppliers.length === 0 ? (
        <div className="text-center py-10">Loading suppliers...</div>
      ) : (
        <>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search suppliers by name or email..."
                  className="w-full md:w-72 px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 sm:text-sm"
                />
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Pending</option>
                </select>
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="bg-slate-800 text-white py-2 px-4 rounded-md hover:bg-slate-900 font-semibold"
                >
                  Add Supplier
                </button>
              </div>
            </div>
          </div>

          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
              <p className="text-lg">No suppliers found.</p>
              <p className="text-sm">Click "Add Supplier" to create a new entry.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuppliers.map((supplier, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800">{supplier.name}</h4>
                      <p className="text-sm text-slate-500 mt-1">{supplier.email}</p>
                      {supplier.phone && <p className="text-sm text-slate-500">{supplier.phone}</p>}
                    </div>
                    <span className={`status-badge status-${supplier.status.toLowerCase()}`}>
                      {supplier.status}
                    </span>
                  </div>
                  {supplier.materialsSupplied && supplier.materialsSupplied.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-slate-500 mb-2">Materials Supplied:</p>
                      <div className="flex flex-wrap gap-2">
                        {supplier.materialsSupplied.map((material, mIdx) => (
                          <span key={mIdx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                            {material.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-slate-500 mr-2">Rating:</span>
                      <span className="font-semibold text-slate-800">{supplier.rating || 0}</span>
                      <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(supplier)}
                        className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(supplier._id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add/Edit Supplier Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {editingId ? 'Edit Supplier' : 'Add New Supplier'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Supplier Name</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone (Optional)</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                      <input type="number" name="rating" min="0" max="5" step="0.1" value={formData.rating} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                      <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500">
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Pending</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                    <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="3" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500"></textarea>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md font-medium">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-md font-medium">
                      {editingId ? 'Update Supplier' : 'Create Supplier'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Suppliers;


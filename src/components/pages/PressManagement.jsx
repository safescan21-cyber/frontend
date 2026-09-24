import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus, Edit, Trash2, Eye, Image, Video, FileText,
  X, Calendar, User, ChevronLeft, ChevronRight, Newspaper
} from 'lucide-react';

// ─── API base (adjust to your proxy) ─────────────────────────
const API_BASE = '/api/press';

// ─── Axios with auth token ────────────────────────────────────
const api = axios.create();
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Small delay helper ────────────────────────────────────────
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Main Component ───────────────────────────────────────────
const PressManagement = () => {
  // State
  const [presses, setPresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [filterActive, setFilterActive] = useState(null); // null, true, false

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingPress, setViewingPress] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    publishedDate: '',
    isActive: true,
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // ─── Fetch list ──────────────────────────────────────────────
  const fetchPresses = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: pagination.limit };
      if (filterActive !== null) params.active = filterActive;
      const res = await api.get(API_BASE, { params });
      setPresses(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresses();
  }, [filterActive]);

  // ─── Handlers ────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this press release?')) return;

    // Guard: confirm a token is actually present before firing the
    // request, and give it a brief moment to settle (e.g. right
    // after a login redirect where localStorage write and this
    // click could race). Avoids sending a doomed request that
    // bounces back with "Please authenticate".
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in as an admin to delete a press release.');
      return;
    }
    await wait(300);

    try {
      await api.delete(`${API_BASE}/${id}`);
      fetchPresses(pagination.page);
    } catch (err) {
      alert('Delete failed');
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', summary: '', publishedDate: '', isActive: true });
    setMediaFiles([]);
    setExistingMedia([]);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = async (id) => {
    try {
      const res = await api.get(`${API_BASE}/${id}`);
      const data = res.data.data;
      setEditingId(id);
      setFormData({
        title: data.title,
        content: data.content,
        summary: data.summary || '',
        publishedDate: data.publishedDate.split('T')[0],
        isActive: data.isActive,
      });
      setExistingMedia(data.media || []);
      setMediaFiles([]);
      setFormError('');
      setShowForm(true);
    } catch (err) {
      alert('Failed to load press release');
    }
  };

  const openView = async (id) => {
    try {
      const res = await api.get(`${API_BASE}/${id}`);
      setViewingPress(res.data.data);
      setShowView(true);
    } catch (err) {
      alert('Failed to load press release');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    setMediaFiles(Array.from(e.target.files));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    // Guard: make sure a token is present before attempting the
    // request at all, and give it a brief settle window. This
    // avoids firing the POST/PUT immediately in a state where the
    // token was just set (or is about to be) and hasn't propagated
    // yet — which previously surfaced as a false "Please
    // authenticate" even while actually logged in.
    const token = localStorage.getItem('token');
    if (!token) {
      setFormError('You need to be logged in as an admin to save a press release.');
      setFormLoading(false);
      return;
    }
    await wait(400);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    mediaFiles.forEach(file => data.append('media', file));

    try {
      if (editingId) {
        await api.put(`${API_BASE}/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post(API_BASE, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setShowForm(false);
      fetchPresses(pagination.page);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  // ─── Render helpers ──────────────────────────────────────────
  const MediaIcon = ({ type }) => {
    switch (type) {
      case 'video': return <Video size={16} className="text-purple-600" />;
      case 'document': return <FileText size={16} className="text-orange-600" />;
      default: return <Image size={16} className="text-blue-600" />;
    }
  };

  // ─── Main render ─────────────────────────────────────────────
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* ─── MASSIVE HEADER ────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 md:p-10 rounded-2xl shadow-lg border border-blue-200 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 flex items-center gap-4">
              <Newspaper size={40} className="text-blue-600" />
              Press Releases
            </h1>
            <p className="text-gray-600 mt-2 text-lg md:text-xl">
              Manage all press releases – create, edit, or remove posts.
            </p>
            <div className="mt-2 text-sm text-gray-500">
              {pagination.total} total release{pagination.total !== 1 ? 's' : ''}
            </div>
          </div>

          {/* ─── GIGANTIC BUTTON ──────────────────────────── */}
          <button
            onClick={openCreate}
            className="
              group
              bg-gradient-to-r from-blue-600 to-blue-700
              hover:from-blue-700 hover:to-blue-800
              text-white
              font-bold
              text-2xl md:text-3xl
              py-5 md:py-6
              px-10 md:px-14
              rounded-2xl
              shadow-2xl
              hover:shadow-3xl
              transition-all
              duration-300
              transform
              hover:scale-105
              active:scale-95
              flex
              items-center
              justify-center
              gap-4
              w-full lg:w-auto
              ring-4 ring-blue-300/50
              animate-pulse-once
              relative
              overflow-hidden
            "
            style={{
              boxShadow: '0 20px 40px -8px rgba(37, 99, 235, 0.4)',
            }}
          >
            <Plus size={36} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>New Press Release</span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <select
          className="border rounded-xl px-5 py-3 bg-white shadow-sm focus:ring-4 focus:ring-blue-300 text-lg"
          value={filterActive === null ? '' : filterActive ? 'true' : 'false'}
          onChange={(e) => {
            const val = e.target.value;
            setFilterActive(val === '' ? null : val === 'true');
          }}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-500 text-lg">Loading press releases...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Media</th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Published</th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {presses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-16 text-center text-gray-500 text-lg">
                      No press releases found. Click the{' '}
                      <button onClick={openCreate} className="text-blue-600 hover:underline font-bold text-xl">
                        big blue button
                      </button>{' '}
                      to create your first press release.
                    </td>
                  </tr>
                ) : (
                  presses.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition">
                      <td className="px-8 py-5 text-lg font-medium text-gray-900">{item.title}</td>
                      <td className="px-8 py-5 text-sm text-gray-500">
                        <div className="flex gap-2 flex-wrap">
                          {item.media.map((m, idx) => (
                            <MediaIcon key={idx} type={m.type} />
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-base text-gray-500">
                        {new Date(item.publishedDate).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5">
                        {item.isActive ? (
                          <span className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-bold">Active</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-full text-sm font-bold">Inactive</span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-base space-x-4">
                        <button onClick={() => openView(item._id)} className="text-blue-600 hover:text-blue-800 transition" title="View">
                          <Eye size={24} className="inline" />
                        </button>
                        <button onClick={() => openEdit(item._id)} className="text-indigo-600 hover:text-indigo-800 transition" title="Edit">
                          <Edit size={24} className="inline" />
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800 transition" title="Delete">
                          <Trash2 size={24} className="inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between mt-8 gap-4">
            <div className="text-base text-gray-700">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fetchPresses(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-6 py-3 border rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 text-base font-medium"
              >
                <ChevronLeft size={20} /> Previous
              </button>
              <button
                onClick={() => fetchPresses(pagination.page + 1)}
                disabled={pagination.page * pagination.limit >= pagination.total}
                className="px-6 py-3 border rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 text-base font-medium"
              >
                Next <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── FORM MODAL ────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-screen overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">{editingId ? 'Edit Press Release' : 'Create Press Release'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700 transition">
                <X size={32} />
              </button>
            </div>
            {formError && <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-4 text-lg">{formError}</div>}
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-gray-700">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-5 py-4 text-lg focus:ring-4 focus:ring-blue-300"
                  placeholder="Enter press release title"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700">Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  rows="8"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-5 py-4 text-lg focus:ring-4 focus:ring-blue-300"
                  placeholder="Write the full content here..."
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700">Summary</label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleFormChange}
                  rows="4"
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-5 py-4 text-lg focus:ring-4 focus:ring-blue-300"
                  placeholder="Brief summary (optional)"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700">Published Date</label>
                <input
                  type="date"
                  name="publishedDate"
                  value={formData.publishedDate}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-5 py-4 text-lg focus:ring-4 focus:ring-blue-300"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleFormChange}
                  className="h-6 w-6 text-blue-600 border-gray-300 rounded focus:ring-4 focus:ring-blue-300"
                />
                <label className="ml-3 text-base font-medium text-gray-700">Active</label>
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700">Media</label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-base text-gray-500 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 rounded-xl"
                />
                {editingId && existingMedia.length > 0 && (
                  <div className="mt-3">
                    <p className="text-base text-gray-600">Current media:</p>
                    <ul className="flex flex-wrap gap-3 mt-2">
                      {existingMedia.map((m) => (
                        <li key={m.public_id} className="bg-gray-100 px-4 py-2 rounded-xl text-base flex items-center gap-2">
                          <span>{m.caption || m.type}</span>
                          <span className="text-sm text-gray-500">({m.type})</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-amber-600 mt-2">New uploads will replace all existing media.</p>
                  </div>
                )}
              </div>
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-8 py-4 rounded-xl shadow-lg transition disabled:opacity-50 flex-1"
                >
                  {formLoading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-xl px-8 py-4 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── VIEW MODAL ────────────────────────────────────── */}
      {showView && viewingPress && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Press Release</h2>
              <button onClick={() => setShowView(false)} className="text-gray-500 hover:text-gray-700 transition">
                <X size={32} />
              </button>
            </div>
            <div className="space-y-5">
              <h1 className="text-4xl font-bold">{viewingPress.title}</h1>
              <div className="flex flex-wrap items-center gap-5 text-base text-gray-500">
                <span className="flex items-center gap-2"><Calendar size={20} /> {new Date(viewingPress.publishedDate).toLocaleDateString()}</span>
                <span className="flex items-center gap-2"><User size={20} /> {viewingPress.author?.name || 'Admin'}</span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${viewingPress.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {viewingPress.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {viewingPress.summary && (
                <div className="bg-gray-50 p-5 rounded-xl border-l-4 border-blue-400 italic text-gray-700 text-lg">
                  {viewingPress.summary}
                </div>
              )}
              <div className="prose max-w-none text-lg" dangerouslySetInnerHTML={{ __html: viewingPress.content.replace(/\n/g, '<br/>') }} />
              {viewingPress.media.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-bold text-2xl mb-4">Media</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {viewingPress.media.map((m) => (
                      <div key={m.public_id} className="border rounded-xl overflow-hidden bg-gray-50">
                        {m.type === 'image' && (
                          <img src={m.url} alt={m.caption || 'media'} className="w-full h-48 object-cover" />
                        )}
                        {m.type === 'video' && (
                          <video src={m.url} controls className="w-full h-48 object-cover" />
                        )}
                        {m.type === 'document' && (
                          <div className="p-5 flex items-center gap-3">
                            <FileText size={28} className="text-orange-600" />
                            <a href={m.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate text-lg">
                              {m.caption || 'Document'}
                            </a>
                          </div>
                        )}
                        {m.caption && <p className="text-sm text-gray-500 p-2 truncate">{m.caption}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PressManagement;
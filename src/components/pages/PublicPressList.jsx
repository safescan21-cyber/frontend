import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Image, Video, FileText } from 'lucide-react';

const PublicPressList = () => {
  const [presses, setPresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const fetchPress = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/press', {
        params: { active: true, page, limit: 10 },
      });
      setPresses(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPress();
  }, []);

  const MediaTypeIcon = ({ type }) => {
    switch (type) {
      case 'video': return <Video size={16} className="text-purple-600" />;
      case 'document': return <FileText size={16} className="text-orange-600" />;
      default: return <Image size={16} className="text-blue-600" />;
    }
  };

  if (loading) return <div className="p-6 text-center">Loading press releases...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Press Releases</h1>
      <div className="space-y-6">
        {presses.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <Link to={`/press/${item._id}`} className="block">
              <h2 className="text-xl font-semibold text-blue-600 hover:underline">{item.title}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(item.publishedDate).toLocaleDateString()}</span>
                <div className="flex gap-1">
                  {item.media.map((m, idx) => (
                    <MediaTypeIcon key={idx} type={m.type} />
                  ))}
                </div>
              </div>
              {item.summary && <p className="mt-2 text-gray-700">{item.summary}</p>}
            </Link>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => fetchPress(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}</span>
        <button
          onClick={() => fetchPress(pagination.page + 1)}
          disabled={pagination.page * pagination.limit >= pagination.total}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PublicPressList;
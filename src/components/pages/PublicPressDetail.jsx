import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, ArrowLeft, Image, Video, FileText } from 'lucide-react';

const PublicPressDetail = () => {
  const { id } = useParams();
  const [press, setPress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`/api/press/${id}`);
        setPress(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!press) return <div className="p-6 text-center text-red-500">Press release not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/press" className="inline-flex items-center text-blue-600 hover:underline mb-4">
        <ArrowLeft size={18} className="mr-1" /> Back to all releases
      </Link>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h1 className="text-3xl font-bold">{press.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1"><Calendar size={16} /> {new Date(press.publishedDate).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><User size={16} /> {press.author?.name || 'Admin'}</span>
        </div>
        {press.summary && (
          <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-400 italic text-gray-700">
            {press.summary}
          </div>
        )}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: press.content.replace(/\n/g, '<br/>') }} />
        {press.media.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">Media</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {press.media.map((m) => (
                <div key={m.public_id} className="border rounded overflow-hidden bg-gray-50">
                  {m.type === 'image' && (
                    <img src={m.url} alt={m.caption || 'media'} className="w-full h-40 object-cover" />
                  )}
                  {m.type === 'video' && (
                    <video src={m.url} controls className="w-full h-40 object-cover" />
                  )}
                  {m.type === 'document' && (
                    <div className="p-4 flex items-center gap-2">
                      <FileText size={24} className="text-orange-600" />
                      <a href={m.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                        {m.caption || 'Document'}
                      </a>
                    </div>
                  )}
                  {m.caption && <p className="text-xs text-gray-500 p-1 truncate">{m.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPressDetail;
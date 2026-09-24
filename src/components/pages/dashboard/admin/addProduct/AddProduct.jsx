import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Plus, X } from 'lucide-react';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useAddProductMutation } from '../../../../store/products/productsApi';

// ─── Predefined categories for pharmaceutical equipment ────────
const predefinedCategories = [
  { label: 'Tablet Press Machines', value: 'tablet-press' },
  { label: 'Capsule Filling Machines', value: 'capsule-filling' },
  { label: 'Blister Packaging Machines', value: 'blister-packaging' },
  { label: 'Strip Packaging Machines', value: 'strip-packaging' },
  { label: 'Powder Filling Machines', value: 'powder-filling' },
  { label: 'Liquid Filling Machines', value: 'liquid-filling' },
  { label: 'Granulation Equipment', value: 'granulation' },
  { label: 'Coating Systems', value: 'coating' },
  { label: 'Fluid Bed Dryers', value: 'fluid-bed-dryer' },
  { label: 'Milling & Sizing', value: 'milling' },
  { label: 'Mixing & Blending', value: 'mixing' },
  { label: 'Compression Tooling', value: 'tooling' },
  { label: 'Inspection & Detection', value: 'inspection' },
  { label: 'Lab Equipment', value: 'lab-equipment' },
  { label: 'Sterile Processing', value: 'sterile' },
  { label: 'HVAC & Utilities', value: 'hvac' },
  { label: 'Material Handling', value: 'material-handling' },
  { label: 'Packaging Accessories', value: 'packaging-accessories' },
  { label: 'Process Control Software', value: 'process-control' },
  { label: 'Turnkey Projects', value: 'turnkey' },
];

const colors = [
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Black', value: 'black' },
  { label: 'White', value: 'white' },
  { label: 'Silver', value: 'silver' },
  { label: 'Custom', value: 'custom' },
];

const AddProduct = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // ── Category state ──
  const [categories, setCategories] = useState(predefinedCategories);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');

  // ── Product form state ──
  const [product, setProduct] = useState({
    name: '',
    category: '',
    color: '',
    price: '',
    oldPrice: '',
    warranty: '',
    stock: '',
    readyToDispatch: false,
    description: '',
  });
  const [images, setImages] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [videos, setVideos] = useState([]);

  // ── UI toggles ──
  const [showSuccessToggle, setShowSuccessToggle] = useState(false);
  const [addedProductName, setAddedProductName] = useState('');
  const [formError, setFormError] = useState('');

  const [AddProduct, { isLoading, error: mutationError }] = useAddProductMutation();

  // ── Handlers ──
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (name === 'category') {
      if (value === 'other') {
        setShowCustomCategory(true);
      } else {
        setShowCustomCategory(false);
        setCustomCategory('');
        setCategoryError('');
      }
    }
  };

  const handleCustomCategoryChange = (e) => {
    const val = e.target.value;
    setCustomCategory(val);
    const slug = val.trim().toLowerCase().replace(/\s+/g, '-');
    if (val.trim() && categories.some(cat => cat.value === slug)) {
      setCategoryError('Category already exists.');
    } else {
      setCategoryError('');
    }
  };

  const addCustomCategory = () => {
    const trimmed = customCategory.trim();
    if (!trimmed) {
      setCategoryError('Please enter a category name.');
      return;
    }
    const slug = trimmed.toLowerCase().replace(/\s+/g, '-');
    if (categories.some(cat => cat.value === slug)) {
      setCategoryError('Category already exists.');
      return;
    }
    const newCat = { label: trimmed, value: slug };
    setCategories((prev) => [...prev, newCat]);
    setProduct((prev) => ({ ...prev, category: slug }));
    setShowCustomCategory(false);
    setCustomCategory('');
    setCategoryError('');
  };

  // ── Specification handlers ──
  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  // ── Video handlers ──
  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Replace with your real upload endpoint
    const uploadVideo = async (file) => {
      const formData = new FormData();
      formData.append('video', file);
      const res = await fetch('/api/upload/video', { method: 'POST', body: formData });
      const data = await res.json();
      return data.url; // expects { url: 'https://...' }
    };

    try {
      const uploadedUrls = await Promise.all(files.map(uploadVideo));
      setVideos((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error('Video upload failed:', err);
      showError('Failed to upload video(s).');
    }
    e.target.value = '';
  };

  const removeVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  // ── Error toast helper ──
  const showError = (msg) => {
    setFormError(msg);
    setTimeout(() => setFormError(''), 3000);
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showError('You are not logged in. Please log in first.');
      return;
    }
    if (!user._id) {
      showError('User ID is missing. Please log out and log in again.');
      return;
    }
    if (user.role !== 'admin') {
      showError('You do not have admin privileges to add a product.');
      return;
    }

    if (!product.name || !product.category || !product.price || !product.description || !product.color) {
      showError('Please fill in all required fields.');
      return;
    }
    if (images.length === 0) {
      showError('Please upload at least one product image.');
      return;
    }

    try {
      const cleanSpecs = specifications.filter(s => s.key.trim() !== '' || s.value.trim() !== '');

      const payload = {
        ...product,
        price: Number(product.price),
        oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
        warranty: product.warranty ? Number(product.warranty) : undefined,
        stock: product.stock ? Number(product.stock) : undefined,
        images,
        videos,
        author: user._id,
        specifications: cleanSpecs,
      };

      await AddProduct(payload).unwrap();

      setAddedProductName(product.name);
      setShowSuccessToggle(true);

      // Reset form
      setProduct({
        name: '',
        category: '',
        color: '',
        price: '',
        oldPrice: '',
        warranty: '',
        stock: '',
        readyToDispatch: false,
        description: '',
      });
      setImages([]);
      setVideos([]);
      setSpecifications([]);
      setCustomCategory('');
      setShowCustomCategory(false);
      setCategoryError('');

      setTimeout(() => {
        setShowSuccessToggle(false);
        navigate('/shop');
      }, 2200);

    } catch (err) {
      console.error('Failed to submit product:', err);
      showError(err?.data?.message || 'An unexpected error occurred.');
    }
  };

  // ── Category options ──
  const categoryOptions = [
    ...categories.map(cat => ({ label: cat.label, value: cat.value })),
    { label: '➕ Add new category...', value: 'other' },
  ];

  // ── Render ──
  return (
    <div className="container mx-auto mt-8 relative">
      {/* Success Toggle & Error Toast (unchanged) */}
      {showSuccessToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 shadow-2xl transform animate-scale-up">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-4 animate-bounce">
                <CheckCircle size={48} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Product Added! ✓</h2>
              <p className="text-white/90 text-lg">"{addedProductName}" has been added successfully.</p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {formError && (
        <div className="fixed top-5 right-5 z-50 animate-slide-in-right">
          <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <AlertCircle size={24} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">{formError}</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ── Basic fields ── */}
        <TextInput
          label="Product Name"
          name="name"
          placeholder="Ex: High-Speed Tablet Press"
          value={product.name}
          onChange={handleChange}
        />

        <div>
          <SelectInput
            label="Category"
            name="category"
            value={product.category}
            onChange={handleChange}
            options={categoryOptions}
          />
          {showCustomCategory && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Enter new category name"
                value={customCategory}
                onChange={handleCustomCategoryChange}
                className="flex-1 min-w-[200px] border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addCustomCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
              {categoryError && <p className="text-red-500 text-xs w-full mt-1">{categoryError}</p>}
            </div>
          )}
        </div>

        <SelectInput
          label="Color"
          name="color"
          value={product.color}
          onChange={handleChange}
          options={colors}
        />

        <TextInput
          label="Price (₹)"
          name="price"
          type="number"
          placeholder="50000"
          value={product.price}
          onChange={handleChange}
        />
        <TextInput
          label="Original Price (₹) – for discount"
          name="oldPrice"
          type="number"
          placeholder="60000"
          value={product.oldPrice}
          onChange={handleChange}
        />

        <TextInput
          label="Stock Quantity"
          name="stock"
          type="number"
          placeholder="10"
          value={product.stock}
          onChange={handleChange}
        />
        <TextInput
          label="Warranty (months)"
          name="warranty"
          type="number"
          placeholder="24"
          value={product.warranty}
          onChange={handleChange}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="readyToDispatch"
            id="readyToDispatch"
            checked={product.readyToDispatch}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="readyToDispatch" className="text-sm font-medium text-gray-700">
            Ready to Dispatch (available for immediate shipping)
          </label>
        </div>

        {/* Images */}
        <UploadImage name="images" setImages={setImages} />

        {/* ── Videos ── */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Videos <span className="text-xs text-gray-400">(optional, MP4/WebM/AVI)</span>
          </label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoUpload}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {videos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {videos.map((url, idx) => (
                <div key={idx} className="relative w-32 h-24 rounded overflow-hidden border border-gray-300">
                  <video src={url} className="w-full h-full object-cover" controls />
                  <button
                    type="button"
                    onClick={() => removeVideo(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1">Upload one or more videos. Preview thumbnails shown.</p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            className="add-product-InputCSS"
            value={product.description}
            placeholder="Describe the machine, its features, and applications"
            onChange={handleChange}
          />
        </div>

        {/* ── Specifications ── */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Technical Specifications <span className="text-xs text-gray-400">(optional key–value pairs)</span>
            </label>
            <button
              type="button"
              onClick={addSpecification}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <Plus size={16} /> Add Specification
            </button>
          </div>

          {specifications.length === 0 && (
            <p className="text-xs text-gray-400 mt-1">No specifications added yet.</p>
          )}

          <div className="mt-2 space-y-2">
            {specifications.map((spec, index) => (
              <div key={index} className="flex flex-wrap items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                <input
                  type="text"
                  placeholder="Key (e.g. Capacity)"
                  value={spec.key}
                  onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                  className="flex-1 min-w-[120px] border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 500kg/h)"
                  value={spec.value}
                  onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                  className="flex-1 min-w-[120px] border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <button type="submit" className="add-product-btn" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Product'}
          </button>
        </div>

        {mutationError && (
          <div className="text-red-600 text-sm mt-2">
            {mutationError?.data?.message || 'Something went wrong. Please try again.'}
          </div>
        )}
      </form>

      {/* Animations (unchanged) */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-up {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-up { animation: scale-up 0.4s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default AddProduct;
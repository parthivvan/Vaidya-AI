import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Upload, CheckCircle, Package, DollarSign, FileText, Tag, Image as ImageIcon } from 'lucide-react';

const AdminUpload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vitamins',
    price: '',
    stock: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle Text Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // Show preview immediately
    }
  };

  // Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error("Please select an image!");
    
    setLoading(true);
    const toastId = toast.loading("Uploading to Cloudinary...");

    // 1. Prepare FormData (Required for Files)
    const data = new FormData();
    data.append("image", imageFile); // The file
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("description", formData.description);

    try {
      // 2. Send to Backend
      const res = await fetch("http://localhost:5001/api/medicines/add", {
        method: "POST",
        body: data, // No Headers needed (Browser sets multipart/form-data automatically)
      });

      if (res.ok) {
        toast.success("Product Live in Store!", { id: toastId });
        navigate('/pharmacy'); // Go check it out
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Upload Failed", { id: toastId });
      }
    } catch (err) {
      toast.error("Server Error", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-slate-100 p-8">
        
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
            <Package className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* LEFT: Image Upload */}
          <div className="col-span-full md:col-span-1">
            <label className="block text-sm font-bold text-slate-700 mb-2">Product Image</label>
            <div className={`relative border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center transition-all ${preview ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400'}`}>
              
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-xl p-2" />
              ) : (
                <div className="text-center p-4">
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 font-medium">Click to Upload</p>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP</p>
                </div>
              )}
              
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* RIGHT: Details */}
          <div className="col-span-full md:col-span-1 space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Product Name</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input name="name" onChange={handleChange} required className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="e.g. Vitamin C" />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                <div className="relative">
                    <Tag className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <select name="category" onChange={handleChange} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none">
                        <option>Vitamins</option>
                        <option>Pain Relief</option>
                        <option>Skincare</option>
                        <option>First Aid</option>
                        <option>Devices</option>
                        <option>Supplements</option>
                        <option>Antibiotics</option>
                        <option>Heart Health</option>
                        <option>Cold & Flu</option>
                        <option>Diabetes</option>
                        <option>Hygiene</option>
                        
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price ($)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input name="price" type="number" step="0.01" onChange={handleChange} required className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg" placeholder="0.00" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Stock</label>
                    <input name="stock" type="number" onChange={handleChange} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg" placeholder="Qty" />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                <textarea name="description" onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" rows="3" placeholder="Short description..."></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-full mt-4">
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
                {loading ? 'Uploading...' : <><CheckCircle className="w-5 h-5" /> Publish Product</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminUpload;
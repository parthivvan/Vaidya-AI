import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  ArrowLeft, Star, ShoppingCart, Truck, ShieldCheck, 
  Activity, Check, Plus, Minus 
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Fetch single medicine
    const fetchProduct = async () => {
      try {
        // We assume you have a route like /api/medicines/:id
        // If not, we can filter from the full list for now
        const res = await fetch(`http://localhost:5001/api/medicines/${id}`);
        const data = await res.json();
        setMedicine(data);
      } catch (err) {
        console.error("Error loading product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Add logic to add 'quantity' times if your cart supports it
    // For now, we just add 1 item multiple times or update context
    for(let i=0; i<quantity; i++) {
        addToCart(medicine);
    }
    toast.success(`Added ${quantity} ${medicine.name} to Cart`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!medicine) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-[#f6f6f8] font-sans py-10 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-[#5747e6] mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Pharmacy
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Image */}
          <div className="bg-white rounded-3xl p-10 flex items-center justify-center shadow-sm border border-gray-100 h-fit">
             <img 
               src={medicine.imageUrl} 
               alt={medicine.name} 
               className="w-full max-w-xs object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500" 
             />
          </div>

          {/* Right: Details */}
          <div className="flex flex-col gap-6">
             <div>
                <span className="inline-block px-3 py-1 bg-[#5747e6]/10 text-[#5747e6] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                  {medicine.category}
                </span>
                <h1 className="text-4xl font-bold text-[#100e1b] mb-2 font-display">{medicine.name}</h1>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                   <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold text-slate-700">{medicine.rating || 4.8}</span>
                   </div>
                   <span>•</span>
                   <span>120 Reviews</span>
                   <span>•</span>
                   <span className="text-emerald-600 font-bold">In Stock</span>
                </div>
             </div>

             <div className="text-3xl font-bold text-[#100e1b]">
                ₹{medicine.price}
             </div>

             <div className="prose prose-slate text-slate-500 leading-relaxed">
                <h3 className="text-[#100e1b] font-bold text-lg mb-2">Description</h3>
                <p>{medicine.description || "No description available."}</p>
             </div>

             {/* Features Grid */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                   <Truck className="w-5 h-5 text-[#5747e6]" />
                   <span className="text-sm font-bold text-slate-700">Free Delivery</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                   <ShieldCheck className="w-5 h-5 text-[#5747e6]" />
                   <span className="text-sm font-bold text-slate-700">Medical Grade</span>
                </div>
             </div>

             {/* Actions */}
             <div className="mt-6 flex flex-col sm:flex-row gap-4">
                {/* Quantity Counter */}
                <div className="flex items-center bg-white border border-gray-200 rounded-xl px-2">
                   <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-[#5747e6]"><Minus className="w-4 h-4"/></button>
                   <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                   <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-[#5747e6]"><Plus className="w-4 h-4"/></button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#100e1b] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                   <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
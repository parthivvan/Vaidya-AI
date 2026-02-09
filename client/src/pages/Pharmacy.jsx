import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, Calendar, Search, Plus, 
  ShoppingCart, Pill, LogOut, Check, Star, 
  Sparkles, Package, Info, FlaskConical 
} from 'lucide-react';

const Pharmacy = () => {
  const { user, logout } = useAuth();
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();
  
  // --- STATE ---
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // --- FETCH MEDICINES ---
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      // 1. Fetch ALL medicines (we will filter in frontend for speed/reliability)
      let url = `http://localhost:5001/api/medicines`; 
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (Array.isArray(data)) {
          setMedicines(data);
      }
    } catch (err) {
      console.error("Shop Error:", err);
      toast.error("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  // --- FETCH ORDERS ---
  const fetchOrders = async () => {
      if(!user) return;
      try {
          const id = user.id || user._id;
          const res = await fetch(`http://localhost:5001/api/orders/user/${id}`);
          const data = await res.json();
          if(Array.isArray(data)) setOrders(data);
      } catch(err) {
          console.error("Order Fetch Error", err);
      }
  };

  useEffect(() => {
    fetchMedicines();
    fetchOrders(); 
  }, [user]);

  // --- CLIENT SIDE FILTERING LOGIC 🧠 ---
  const filteredMedicines = medicines.filter((med) => {
      // 1. Filter by Category
      const categoryMatch = category === 'All' || med.category === category;
      
      // 2. Filter by Search Term (Name or Description)
      const searchLower = searchTerm.toLowerCase();
      const searchMatch = med.name.toLowerCase().includes(searchLower) || 
                          (med.description && med.description.toLowerCase().includes(searchLower));

      return categoryMatch && searchMatch;
  });

  // --- CHECKOUT ---
  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Cart is empty!");

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const toastId = toast.loading("Processing Payment...");

    try {
        const res = await fetch("http://localhost:5001/api/orders/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                patientId: user.id || user._id,
                items: cart.map(item => ({
                    medicineId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: 1
                })),
                totalAmount: total
            })
        });

        if (res.ok) {
            toast.success("Order Placed Successfully!", { id: toastId });
            // Clear cart logic here if you have a clearCart function, otherwise reload
            setTimeout(() => window.location.reload(), 1000);
        } else {
            toast.error("Order Failed", { id: toastId });
        }
    } catch (err) {
        toast.error("Server Error", { id: toastId });
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f6f6f8] text-[#100e1b] font-sans overflow-hidden">
        {/* INJECT FONTS */}
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
            .font-display { font-family: 'Space Grotesk', sans-serif; }
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #e9e8f3; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #5747e6; }
        `}</style>

        {/* SIDEBAR */}
        <aside className="w-20 lg:w-72 flex-shrink-0 flex flex-col justify-between bg-white border-r border-gray-100 transition-all duration-300 z-20">
            <div className="flex flex-col h-full p-4 lg:p-6">
                <div className="flex items-center gap-4 mb-10 pl-2">
                    <div className="bg-[#5747e6]/10 p-2 rounded-xl"><Pill className="text-[#5747e6] w-6 h-6" /></div>
                    <div className="hidden lg:flex flex-col">
                        <h1 className="text-[#100e1b] text-lg font-bold leading-tight font-display">Health Hive</h1>
                        <p className="text-[#575095] text-xs font-medium">Pharmacy V2</p>
                    </div>
                </div>

                <nav className="flex flex-col gap-2 flex-1 font-display">
                    <a href="/dashboard" className="flex items-center gap-4 px-4 py-3 text-[#575095] hover:bg-gray-50 rounded-xl transition-colors group">
                        <LayoutDashboard className="w-5 h-5 group-hover:text-[#5747e6] transition-colors" />
                        <span className="hidden lg:block text-sm font-medium">Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center gap-4 px-4 py-3 bg-[#5747e6]/10 text-[#5747e6] rounded-xl transition-colors">
                        <Pill className="w-5 h-5 fill-current" />
                        <span className="hidden lg:block text-sm font-bold">Medicines</span>
                    </a>
                    <a href="/dashboard#booking" className="flex items-center gap-4 px-4 py-3 text-[#575095] hover:bg-gray-50 rounded-xl transition-colors group">
                        <Calendar className="w-5 h-5 group-hover:text-[#5747e6] transition-colors" />
                        <span className="hidden lg:block text-sm font-medium">Consultations</span>
                    </a>
                    <a href="/lab-tests" className="flex items-center gap-4 px-4 py-3 text-[#575095] hover:bg-gray-50 rounded-xl transition-colors group">
                        <FlaskConical className="w-5 h-5 group-hover:text-[#5747e6] transition-colors" />
                        <span className="hidden lg:block text-sm font-medium">Lab Tests</span>
                    </a>
                    <button onClick={logout} className="flex items-center gap-4 px-4 py-3 text-[#575095] hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors group mt-auto">
                        <LogOut className="w-5 h-5" />
                        <span className="hidden lg:block text-sm font-medium">Logout</span>
                    </button>
                </nav>

                <button onClick={handleCheckout} className="hidden lg:flex w-full items-center justify-center gap-2 bg-[#5747e6] hover:bg-[#4638b9] text-white py-3 rounded-xl font-bold shadow-lg shadow-[#5747e6]/30 transition-all mt-4">
                    <Check className="w-5 h-5" /> Checkout ({cart.length})
                </button>
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col relative overflow-hidden font-display">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-5 lg:px-10 lg:py-6 bg-[#f6f6f8]/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex flex-col">
                    <h2 className="text-[#100e1b] text-xl lg:text-2xl font-bold leading-tight">Pharmacy Store</h2>
                    <p className="text-[#575095] text-sm hidden sm:block">Find your medicines & supplements</p>
                </div>
                <div className="flex items-center gap-4 lg:gap-6">
                    <div className="hidden md:flex items-center bg-white rounded-full px-4 h-12 w-64 lg:w-80 shadow-sm border border-gray-100 focus-within:ring-2 focus-within:ring-[#5747e6]/50 transition-all">
                        <Search className="text-gray-400 w-5 h-5" />
                        <input 
                          className="bg-transparent border-none focus:ring-0 text-[#100e1b] text-sm w-full placeholder:text-gray-400 ml-2" 
                          placeholder="Search medicines..." 
                          type="text" 
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                    <button onClick={() => navigate('/cart')} className="relative p-2 text-[#100e1b] hover:bg-white rounded-full transition-colors group">
                        <ShoppingCart className="w-6 h-6 group-hover:text-[#5747e6]" />
                        {cart.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#f6f6f8]"></span>}
                    </button>
                    <div className="w-10 h-10 rounded-full bg-[#5747e6] text-white flex items-center justify-center font-bold border-2 border-white shadow-sm">{user?.fullName?.charAt(0)}</div>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-10 lg:px-10">
                <div className="max-w-7xl mx-auto flex flex-col gap-8 pt-4">
                    
                    {/* Hero Section */}
                    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#e0e7ff] via-[#eef2ff] to-[#f5f3ff] p-8 lg:p-12 shadow-sm border border-white/50">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5747e6]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex flex-col gap-4 max-w-xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm w-fit border border-white/20">
                                    <Sparkles className="w-4 h-4 text-[#5747e6]" />
                                    <span className="text-xs font-bold text-[#5747e6] uppercase tracking-wide">Trusted Pharmacy</span>
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-bold text-[#100e1b] tracking-tight">Essential Vitamins <br/> <span className="text-[#5747e6]">Daily Refill</span></h2>
                                <p className="text-[#575095] text-lg max-w-md">Get 20% off on your first recurring order of vitamins and daily supplements.</p>
                            </div>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {['All', 'Pain Relief', 'Vitamins', 'Skincare', 'First Aid', 'Antibiotics'].map(cat => (
                                <button 
                                  key={cat} 
                                  onClick={() => setCategory(cat)} 
                                  className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                                    category === cat 
                                      ? 'bg-[#100e1b] text-white border-[#100e1b]' 
                                      : 'bg-white border-gray-200 text-gray-500 hover:border-[#5747e6] hover:text-[#5747e6]'
                                  }`}
                                >
                                  {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* MEDICINE GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                        {loading ? [1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100"></div>) : 
                            filteredMedicines.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-gray-400">
                                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50"/>
                                    <p>No medicines found for "{category}"</p>
                                </div>
                            ) :
                            filteredMedicines.map((med) => (
                                <div 
                                    key={med._id} 
                                    onClick={() => navigate(`/product/${med._id}`)}
                                    className="group relative flex flex-col bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-xl transition-all duration-300 overflow-hidden border border-transparent hover:border-[#5747e6] hover:-translate-y-1 cursor-pointer"
                                >
                                    {/* Image Section */}
                                    <div className="relative h-48 w-full bg-gray-50 flex items-center justify-center overflow-hidden p-6">
                                        <div className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /><span className="text-xs font-bold text-[#100e1b]">{med.rating || 4.8}</span></div>
                                        <img src={med.imageUrl} alt={med.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                    
                                    {/* Details Section */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="text-[10px] font-bold text-[#5747e6] uppercase mb-1 tracking-wider">{med.category}</div>
                                        <h4 className="text-lg font-bold text-[#100e1b] mb-1 leading-snug truncate">{med.name}</h4>
                                        
                                        {/* 🟢 NEW: Description Logic */}
                                        <p className="text-xs text-gray-500 mb-4 line-clamp-2 h-8 leading-relaxed">
                                            {med.description || "No description available for this product."}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="text-xl font-bold text-[#100e1b]">₹{med.price}</span>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(med);
                                                }}
                                                className="size-10 flex items-center justify-center bg-[#5747e6] text-white rounded-full hover:bg-[#4638b9] hover:scale-105 transition-all shadow-lg shadow-[#5747e6]/30 group/btn"
                                            >
                                                <Plus className="w-5 h-5 transition-transform group-hover/btn:rotate-90" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {/* Order History */}
                    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#100e1b]">Recent Orders</h3>
                            <button onClick={fetchOrders} className="text-[#5747e6] text-sm font-bold hover:underline">Refresh</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="pb-3 text-xs uppercase tracking-wider text-[#575095] font-semibold pl-2">Order ID</th>
                                        <th className="pb-3 text-xs uppercase tracking-wider text-[#575095] font-semibold">Items</th>
                                        <th className="pb-3 text-xs uppercase tracking-wider text-[#575095] font-semibold">Date</th>
                                        <th className="pb-3 text-xs uppercase tracking-wider text-[#575095] font-semibold">Status</th>
                                        <th className="pb-3 text-xs uppercase tracking-wider text-[#575095] font-semibold text-right pr-2">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {orders.length === 0 ? (
                                        <tr><td colSpan="5" className="py-6 text-center text-gray-400">No orders found. Buy something above!</td></tr>
                                    ) : (
                                        orders.map(order => (
                                            <tr key={order._id} className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                                                <td className="py-4 pl-2 font-medium text-[#100e1b]">#{order._id.slice(-6)}</td>
                                                <td className="py-4 text-[#575095]">
                                                    <div className="flex items-center gap-2">
                                                        <Package className="w-4 h-4 text-gray-400" />
                                                        {order.items[0]?.name} {order.items.length > 1 && <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">+{order.items.length - 1} more</span>}
                                                    </div>
                                                </td>
                                                <td className="py-4 text-[#575095]">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td className="py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right pr-2 font-bold text-[#100e1b]">₹{order.totalAmount.toFixed(2)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    </div>
  );
};

export default Pharmacy;
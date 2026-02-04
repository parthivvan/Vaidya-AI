import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, Calendar, Search, Plus, 
  ShoppingCart, Bell, ChevronLeft, ChevronRight, 
  Star, Activity, LogOut, History as HistoryIcon, 
  Pill, FileText, Settings, Sparkles, Tag, Package, Check
} from 'lucide-react';

const Pharmacy = () => {
  const { user, logout } = useAuth();
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();
  
  // --- STATE ---
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]); // 👈 NEW: Store Order History
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // --- FETCH DATA ---
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5001/api/medicines?search=${searchTerm}`;
      if (category !== 'All') url += `&category=${category}`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) setMedicines(data);
    } catch (err) {
      console.error("Shop Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 👈 NEW: Fetch Orders
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
    fetchOrders(); // Load orders on mount
  }, [category, searchTerm, user]);

  // --- ACTIONS ---
  // 👈 NEW: Checkout Function
  const handleCheckout = async () => {
    if (cart.length === 0) {
        toast.error("Cart is empty!");
        return;
    }

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
            setCart([]); // Clear cart
            fetchOrders(); // Refresh table immediately
        } else {
            toast.error("Order Failed", { id: toastId });
        }
    } catch (err) {
        toast.error("Server Error", { id: toastId });
    }
  };

  // Seed Function (Dev Only)
  const seedDatabase = async () => {
    const dummyData = [
      { name: "Vitamin C-1000", category: "Vitamins", price: 12.99, stock: 50, description: "Immune Support, 60 Tabs", imageUrl: "https://placehold.co/400x400/eef2ff/5747e6?text=Vit+C" },
      { name: "Aspirin Complex", category: "Pain Relief", price: 14.99, stock: 100, description: "Fast relief, 20 Sachets", discountPrice: 18.50, imageUrl: "https://placehold.co/400x400/fef2f2/ef4444?text=Aspirin" },
      { name: "Hyaluronic Serum", category: "Skincare", price: 34.00, stock: 20, description: "Hydrating Boost, 30ml", imageUrl: "https://placehold.co/400x400/f0f9ff/0ea5e9?text=Serum" },
      { name: "Probiotic Multi", category: "Vitamins", price: 28.50, stock: 40, description: "Gut health support", imageUrl: "https://placehold.co/400x400/f0fdf4/22c55e?text=Probiotic" },
    ];
    const toastId = toast.loading("Restocking shelves...");
    for (const med of dummyData) {
        await fetch("http://localhost:5001/api/medicines/seed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(med)
        });
    }
    toast.success("Shop Restocked!", { id: toastId });
    fetchMedicines();
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
                        <input className="bg-transparent border-none focus:ring-0 text-[#100e1b] text-sm w-full placeholder:text-gray-400 ml-2" placeholder="Search medicines..." type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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

                    {/* Filter & Headline */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {['All', 'Pain Relief', 'Vitamins', 'Skincare', 'First Aid'].map(cat => (
                                <button key={cat} onClick={() => setCategory(cat)} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${category === cat ? 'bg-[#100e1b] text-white border-[#100e1b]' : 'bg-white border-gray-200 text-gray-500 hover:border-[#5747e6] hover:text-[#5747e6]'}`}>{cat}</button>
                            ))}
                        </div>
                        {medicines.length === 0 && <button onClick={seedDatabase} className="text-xs font-bold text-[#5747e6] underline">(Dev) Fill Database</button>}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                        {loading ? [1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100"></div>) : 
                            medicines.map((med) => (
                                <div key={med._id} className="group relative flex flex-col bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-xl transition-all duration-300 overflow-hidden border border-transparent hover:-translate-y-1">
                                    <div className="relative h-48 w-full bg-gray-50 flex items-center justify-center overflow-hidden p-6">
                                        <div className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /><span className="text-xs font-bold text-[#100e1b]">{med.rating || 4.8}</span></div>
                                        {med.discountPrice && <div className="absolute top-3 left-3 z-10 bg-rose-500 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-sm">SALE</div>}
                                        <img src={med.imageUrl} alt={med.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="text-[10px] font-bold text-[#5747e6] uppercase mb-1 tracking-wider">{med.category}</div>
                                        <h4 className="text-lg font-bold text-[#100e1b] mb-1 leading-snug truncate">{med.name}</h4>
                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="text-xl font-bold text-[#100e1b]">${med.price}</span>
                                            <button onClick={() => addToCart(med)} className="size-12 flex items-center justify-center bg-[#5747e6] text-white rounded-full hover:bg-[#4638b9] hover:scale-105 transition-all shadow-lg shadow-[#5747e6]/30 group/btn">
                                                <Plus className="w-6 h-6 transition-transform group-hover/btn:rotate-90" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {/* 🟢 NEW: REAL ORDER HISTORY TABLE */}
                    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100">
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
                                                <td className="py-4 text-right pr-2 font-bold text-[#100e1b]">${order.totalAmount.toFixed(2)}</td>
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
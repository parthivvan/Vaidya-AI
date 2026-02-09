import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // 👈 Needed for User ID
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Upload, CloudLightning, CheckCircle, 
  Home, Building2, Plus, Loader2, FileText,
  Microscope, ShoppingBag, Clock, Calendar, X
} from 'lucide-react';
import toast from 'react-hot-toast';

const LabTests = () => {
  const { addToCart, cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // --- STATE ---
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Location & Filters
  const [location, setLocation] = useState(localStorage.getItem('mediFlow_location') || '');
  const [showLocationModal, setShowLocationModal] = useState(!localStorage.getItem('mediFlow_location'));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // AI
  const [aiStatus, setAiStatus] = useState('idle');

  // 🟢 NEW: Booking Modal State
  const [selectedTest, setSelectedTest] = useState(null); // Which test is being booked?
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  // --- 1. FETCH REAL DATA ---
  useEffect(() => {
    const fetchLabs = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/lab-tests");
            const data = await res.json();
            if(Array.isArray(data)) setLabTests(data);
        } catch(err) {
            console.error(err);
            toast.error("Failed to load lab tests");
        } finally {
            setLoading(false);
        }
    };
    fetchLabs();
  }, []);

  // --- 2. LOCATION LOGIC (Syncs to Admin) ---
  const saveLocationToBackend = async (loc) => {
      if(!user?.id) return;
      try {
          await fetch(`http://localhost:5001/api/users/${user.id}/location`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ location: loc })
          });
          console.log("📍 Location synced to Super Admin");
      } catch(err) {
          console.error("Location Sync Error", err);
      }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return toast.error("Not supported");
    
    const toastId = toast.loading("Locating...");
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Reverse Geocoding
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await res.json();
                const city = data.address.city || data.address.town || "Unknown City";
                const detectedLoc = `${city}, ${data.address.state}`;
                
                // Save
                setLocation(detectedLoc);
                localStorage.setItem('mediFlow_location', detectedLoc);
                setShowLocationModal(false);
                saveLocationToBackend(detectedLoc); // 👈 SYNC TO DB
                
                toast.success(`Location set: ${detectedLoc}`, { id: toastId });
            } catch (err) {
                toast.error("Could not determine city", { id: toastId });
            }
        },
        () => toast.error("Permission denied", { id: toastId })
    );
  };

  // --- 3. BOOKING LOGIC ---
  const openBookingModal = (test) => {
      setSelectedTest(test);
      setBookingDate(new Date().toISOString().split('T')[0]); // Default today
  };

  const confirmBooking = () => {
      if(!bookingTime) return toast.error("Please select a time slot");
      
      // Add metadata to cart item
      addToCart({
          ...selectedTest,
          bookingDate,
          bookingTime,
          isLabTest: true // Flag to identify in cart
      });
      
      toast.success("Test booked & added to Cart!");
      setSelectedTest(null); // Close modal
  };

  // Filter Logic
  const filteredTests = labTests.filter(test => {
      // If we don't have a 'type' field in DB yet, assume 'home' for demo
      const testType = test.type || 'home'; 
      const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || testType === filterType;
      return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#f6f6f8] font-sans relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      {/* 🟢 SLOT BOOKING MODAL */}
      {selectedTest && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative">
                  <button onClick={() => setSelectedTest(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"><X className="w-5 h-5"/></button>
                  
                  <h3 className="text-xl font-bold font-display mb-1">{selectedTest.name}</h3>
                  <p className="text-sm text-slate-500 mb-6">Schedule your sample collection</p>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-slate-700 uppercase block mb-2">Select Date</label>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                              <Calendar className="w-5 h-5 text-[#5747e6]" />
                              <input 
                                type="date" 
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="bg-transparent border-none outline-none text-sm font-bold w-full"
                              />
                          </div>
                      </div>

                      <div>
                          <label className="text-xs font-bold text-slate-700 uppercase block mb-2">Select Time</label>
                          <div className="grid grid-cols-3 gap-2">
                              {["08:00 AM", "10:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"].map(slot => (
                                  <button 
                                    key={slot}
                                    onClick={() => setBookingTime(slot)}
                                    className={`text-xs py-2 rounded-lg font-bold border transition-all ${
                                        bookingTime === slot 
                                        ? 'bg-[#5747e6] text-white border-[#5747e6]' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-[#5747e6]'
                                    }`}
                                  >
                                      {slot}
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-4">
                          <div className="flex justify-between items-center mb-4">
                             <span className="text-sm text-slate-500">Total Price</span>
                             <span className="text-xl font-bold text-[#5747e6]">₹{selectedTest.price}</span>
                          </div>
                          <button onClick={confirmBooking} className="w-full py-3 bg-[#5747e6] text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                              Confirm Slot
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* 📍 LOCATION MODAL (Same as before) */}
      {showLocationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-[#5747e6] mb-6 mx-auto">
                      <MapPin className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 font-display">Locate Nearby Labs</h2>
                  <p className="text-slate-500 mb-6 text-sm">We need your location to show tests available for Home Collection.</p>
                  <button onClick={handleDetectLocation} className="w-full py-3.5 bg-[#5747e6] text-white rounded-xl font-bold flex items-center justify-center gap-2 mb-4">
                      <MapPin className="w-5 h-5" /> Use Current Location
                  </button>
                  <button onClick={() => setShowLocationModal(false)} className="text-slate-400 text-sm font-bold hover:text-slate-600">Skip for now</button>
              </div>
          </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5747e6]/10 rounded-xl flex items-center justify-center text-[#5747e6]">
                  <Microscope className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">MediFlow Diagnostics</h1>
          </div>
          <div className="flex items-center gap-4">
               <button onClick={() => setShowLocationModal(true)} className="hidden md:flex items-center gap-2 text-sm font-bold text-[#5747e6] bg-[#5747e6]/5 px-4 py-2 rounded-full">
                  <MapPin className="w-4 h-4" /> {location || "Select Location"}
               </button>
               <button onClick={() => navigate('/cart')} className="relative p-2 text-slate-600 hover:text-[#5747e6] transition-colors">
                  <ShoppingBag className="w-6 h-6" />
                  {cart.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
               </button>
          </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-6 lg:p-8 flex flex-col gap-10">
          
          {/* HERO */}
          <section className="relative rounded-3xl bg-gradient-to-r from-[#e0e7ff] to-[#e0f2fe] p-10 overflow-hidden">
              <div className="relative z-10 max-w-xl">
                  <h2 className="text-4xl font-bold text-slate-900 mb-4 font-display">Diagnostics, <span className="text-[#5747e6]">Simplified.</span></h2>
                  
                  {/* Search */}
                  <div className="bg-white p-2 rounded-2xl shadow-xl shadow-indigo-100/50 flex items-center">
                      <Search className="w-5 h-5 text-slate-400 ml-4" />
                      <input 
                        type="text" 
                        placeholder="Search for tests..." 
                        className="w-full p-3 bg-transparent border-none outline-none font-medium text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
              </div>
          </section>

          {/* AI SECTION (Preserved) */}
          <section className="bg-white rounded-3xl p-1 shadow-sm border border-slate-200">
              <div className="bg-gradient-to-r from-[#5747e6] to-blue-600 rounded-[20px] p-8 text-white">
                  <div className="flex items-center gap-2 mb-2">
                      <CloudLightning className="text-yellow-300 w-6 h-6" />
                      <h3 className="text-2xl font-bold font-display">AI Prescription Analysis</h3>
                  </div>
                  <p className="text-indigo-100 mb-6">Upload your doctor's prescription. Our AI will analyze it.</p>
                  
                   {/* Simple Upload UI for now */}
                  <label className="border-2 border-dashed border-white/40 bg-white/10 rounded-xl p-6 text-center cursor-pointer hover:bg-white/20 transition-all block">
                      <input type="file" className="hidden" onChange={() => toast.success("AI Analysis Feature Coming Soon!")} />
                      <div className="flex items-center justify-center gap-3">
                          <Upload className="w-6 h-6" />
                          <span className="font-bold">Upload Prescription</span>
                      </div>
                  </label>
              </div>
          </section>

          {/* TEST GRID */}
          <section>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-slate-900 font-display">Available Tests</h2>
                  {/* Filter Tabs */}
                  <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                      {['all', 'home', 'lab'].map(type => (
                          <button 
                            key={type}
                            onClick={() => setFilterType(type)} 
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${filterType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                          >
                            {type}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? <div className="col-span-3 text-center py-10">Loading tests...</div> : 
                  filteredTests.map(test => (
                      <div key={test._id} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-xl transition-all flex flex-col group">
                          
                          <div className="flex justify-between items-start mb-4">
                              <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 ${test.type === 'lab' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                                  {test.type === 'lab' ? <Building2 className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                                  {test.type === 'lab' ? "Center Visit" : "Home Visit"}
                              </div>
                              <span className="text-xs font-bold text-slate-400 line-through">₹{test.price + 200}</span>
                          </div>

                          <h4 className="text-lg font-bold text-slate-900 mb-1 font-display">{test.name}</h4>
                          <p className="text-slate-500 text-xs mb-4 line-clamp-2">{test.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-50 text-slate-500 text-[10px] font-bold border border-slate-100">
                                  <Clock className="w-3 h-3" /> {test.turnaroundTime} Report
                              </span>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                              <span className="text-xl font-bold text-[#5747e6]">₹{test.price}</span>
                              <button 
                                onClick={() => openBookingModal(test)} // 👈 OPEN MODAL
                                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-[#5747e6] hover:text-white flex items-center justify-center transition-all"
                              >
                                  <Plus className="w-5 h-5" />
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          </section>
      </div>
    </div>
  );
};

export default LabTests;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; 
import { 
  LayoutDashboard, Calendar, Video, FileText, Settings, 
  Plus, Clock, Loader2, LogOut, History as HistoryIcon,
  Search, Bell, Menu, Download, Heart, Activity, Scale,
  CalendarDays, Stethoscope, ChevronDown, Star, AlertTriangle, X, Pill
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // --- STATE ---
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctors, setDoctors] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(null); 
  const [bookedSlotsMap, setBookedSlotsMap] = useState({});

  // 🔴 NEW: State to track WHICH appointment is being cancelled
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  // --- SECURITY ---
  useEffect(() => {
    if (user?.role === 'doctor') navigate("/doctor-dashboard");
  }, [user, navigate]);

  const getUserId = () => {
    if (!user) return null;
    return user.id || user._id; 
  };

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      const userId = getUserId();
      try {
        const docRes = await fetch("http://localhost:5001/api/doctors");
        const docData = await docRes.json();
        if (Array.isArray(docData)) setDoctors(docData);

        if(userId) {
            const apptRes = await fetch(`http://localhost:5001/api/appointments/patient/${userId}`);
            const apptData = await apptRes.json();
            if (Array.isArray(apptData)) setMyAppointments(apptData);
        }
      } catch (error) {
        console.error("Network Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Fetch Availability when Date Changes
  useEffect(() => {
    const fetchAvailability = async () => {
        if (doctors.length === 0) return;
        const newBookedMap = {};

        await Promise.all(doctors.map(async (doc) => {
            try {
                const res = await fetch(`http://localhost:5001/api/appointments/booked-slots?doctorId=${doc._id}&date=${selectedDate}`);
                const takenSlots = await res.json();
                if (Array.isArray(takenSlots)) newBookedMap[doc._id] = takenSlots;
            } catch (err) { console.error(err); }
        }));
        setBookedSlotsMap(newBookedMap);
    };
    fetchAvailability();
  }, [selectedDate, doctors]);

  // --- ACTIONS ---

  // 1. Book Appointment
  const handleBook = async (doctorId, timeSlot) => {
    const userId = getUserId();
    if (!userId) { toast.error("Please login again"); return; }

    setBookingLoading(timeSlot); 
    const toastId = toast.loading("Booking...");

    try {
        const res = await fetch("http://localhost:5001/api/appointments/book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                patientId: userId, 
                doctorId: doctorId,
                date: selectedDate, 
                timeSlot: timeSlot
            })
        });
        
        const data = await res.json();
        
        if(res.ok) {
            toast.success("Confirmed!", { id: toastId });
            setTimeout(() => window.location.reload(), 1000); 
        } else {
            toast.error(data.message || "Booked!", { id: toastId });
            setBookingLoading(null);
        }
    } catch (err) {
        toast.error("Error connecting", { id: toastId });
        setBookingLoading(null);
    }
  };

  // 2. Confirm Cancellation (Called by Modal)
  const confirmCancellation = async () => {
      if(!appointmentToCancel) return; // Guard clause
      
      const toastId = toast.loading("Cancelling...");
      try {
          const res = await fetch(`http://localhost:5001/api/appointments/cancel/${appointmentToCancel}`, {
              method: "PUT"
          });
          
          if(res.ok) {
              toast.success("Appointment Cancelled", { id: toastId });
              setShowCancelModal(false);
              setAppointmentToCancel(null);
              setTimeout(() => window.location.reload(), 1000);
          } else {
              toast.error("Failed to cancel", { id: toastId });
          }
      } catch(err) {
          toast.error("Server Error", { id: toastId });
      }
  };

  // 🔴 LOGIC UPDATE: Get ALL future appointments, not just the first one
  const upcomingAppointments = myAppointments
    .filter(a => new Date(a.date) >= new Date().setHours(0,0,0,0) && a.status !== 'cancelled')
    .sort((a,b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="flex h-screen bg-[#f6f6f8] text-slate-900 font-sans overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Noto+Sans:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
      `}</style>
      
      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-72 h-full bg-white border-r border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="size-10 rounded-xl bg-[#5747e6] flex items-center justify-center text-white shadow-lg shadow-[#5747e6]/30">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight font-display">MediFlow AI</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1 font-display">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#5747e6] text-white shadow-md shadow-[#5747e6]/25 transition-all">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </a>
          <a href="#booking" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-[#5747e6] transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Book Appointment</span>
          </a>
          <a href="/health-hive" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-[#5747e6] transition-colors">
            <Pill className="w-5 h-5" />
            <span className="font-medium">Health Hive</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-[#5747e6] transition-colors">
            <HistoryIcon className="w-5 h-5" />
            <span className="font-medium">History</span>
          </a>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-[#5747e6] font-bold text-lg border border-slate-200">
              {user?.fullName?.charAt(0)}
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-slate-900 line-clamp-1">{user?.fullName}</p>
              <p className="text-xs text-slate-500">#{getUserId()?.slice(-5)}</p>
            </div>
            <button onClick={() => { logout(); navigate("/"); }} className="ml-auto text-slate-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 h-full overflow-y-auto bg-[#f6f6f8]">
        <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-6 lg:px-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
           <div className="flex items-center gap-4 w-full max-w-md">
             <div className="relative w-full">
               <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
               <input className="block w-full pl-10 pr-3 py-2 border-none rounded-xl bg-slate-100 focus:ring-2 focus:ring-[#5747e6] focus:bg-white transition-all text-sm placeholder-slate-400" placeholder="Search..." type="text"/>
             </div>
           </div>
           <button className="size-10 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
           </button>
        </header>

        <div className="max-w-6xl mx-auto p-6 md:p-10 flex flex-col gap-10">
          
          {/* Welcome */}
          <section className="flex flex-col gap-6">
            <header className="flex flex-wrap justify-between items-end gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-display">Good morning, {user?.fullName?.split(' ')[0]}</h2>
                <p className="text-slate-500 text-lg">Here is your health summary.</p>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Download Report
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-rose-500"><Heart className="w-5 h-5"/><span className="text-sm font-bold text-slate-500 uppercase">Heart Rate</span></div>
                  <div className="flex items-end gap-2"><span className="text-3xl font-bold font-display">--</span><span className="text-sm text-slate-500 mb-1">bpm</span></div>
               </div>
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-blue-500"><Activity className="w-5 h-5"/><span className="text-sm font-bold text-slate-500 uppercase">BP</span></div>
                  <div className="flex items-end gap-2"><span className="text-3xl font-bold font-display">--/--</span><span className="text-sm text-slate-500 mb-1">mmHg</span></div>
               </div>
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-indigo-500"><Scale className="w-5 h-5"/><span className="text-sm font-bold text-slate-500 uppercase">Weight</span></div>
                  <div className="flex items-end gap-2"><span className="text-3xl font-bold font-display">--</span><span className="text-sm text-slate-500 mb-1">kg</span></div>
               </div>
            </div>
          </section>

          {/* 🔴 UPCOMING APPOINTMENTS LIST (MAPPED) */}
          <section className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-slate-900 font-display">
                Upcoming Appointments ({upcomingAppointments.length})
            </h3>
            
            {upcomingAppointments.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {upcomingAppointments.map((appt) => (
                        <div key={appt._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch gap-6">
                            <div className="flex-shrink-0 flex flex-col items-center justify-center bg-[#5747e6]/10 rounded-lg w-24 h-24 border border-[#5747e6]/20">
                                <span className="text-[#5747e6] font-bold text-lg uppercase font-display">{new Date(appt.date).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-[#5747e6] font-black text-3xl font-display">{new Date(appt.date).getDate()}</span>
                            </div>
                            <div className="flex-grow flex flex-col justify-center gap-1">
                                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
                                    <Clock className="w-4 h-4" /> {appt.timeSlot} • Video Consultation
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 font-display">{appt.doctorId?.name}</h4>
                                <p className="text-slate-500">{appt.doctorId?.specialization}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <button onClick={() => window.open(appt.meetingLink, "_blank")} className="w-full sm:w-auto bg-[#5747e6] hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-[#5747e6]/30 flex gap-2 items-center justify-center">
                                    <Video className="w-5 h-5" /> Join Call
                                </button>
                                {/* 🔴 Set ID to Cancel */}
                                <button 
                                    onClick={() => {
                                        setAppointmentToCancel(appt._id); // Save specific ID
                                        setShowCancelModal(true);
                                    }} 
                                    className="w-full sm:w-auto bg-white border border-red-200 text-red-500 hover:bg-red-50 font-medium py-2.5 px-6 rounded-lg transition-all flex gap-2 items-center justify-center"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-8 rounded-xl border border-dashed border-slate-200 text-center text-slate-500">
                    No upcoming appointments.
                </div>
            )}
          </section>

          {/* Booking */}
          <section className="flex flex-col gap-6 pt-6 border-t border-slate-200" id="booking">
            <div className="flex flex-wrap items-center justify-between gap-4">
               <div>
                  <h3 className="text-xl font-bold text-slate-900 font-display">Book an Appointment</h3>
                  <p className="text-sm text-slate-500">Select a specialist and available time slot</p>
               </div>
               <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                  <CalendarDays className="w-5 h-5 text-slate-400 ml-2" />
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="text-sm font-bold text-slate-900 bg-transparent outline-none cursor-pointer" />
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {doctors.map(doc => {
                 const availableSlots = (doc.availability && doc.availability.length > 0) ? doc.availability : ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"];
                 const takenSlots = bookedSlotsMap[doc._id] || [];

                 return (
                   <div key={doc._id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all">
                      <div className="p-6 border-b border-slate-100 flex gap-4">
                         <div className="size-16 rounded-xl bg-slate-100 flex items-center justify-center text-2xl font-bold text-[#5747e6]">{doc.userId?.fullName?.charAt(0)}</div>
                         <div>
                            <h4 className="text-lg font-bold text-slate-900 font-display">{doc.name}</h4>
                            <p className="text-[#5747e6] text-sm font-medium">{doc.specialization}</p>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> <span className="font-bold text-slate-700">4.9</span> (120+ reviews)</div>
                         </div>
                      </div>
                      <div className="p-6 bg-slate-50/50 flex-1">
                         <p className="text-xs font-bold text-slate-400 uppercase mb-3">Available Slots</p>
                         <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                           {availableSlots.map((time, i) => {
                              const isBooked = takenSlots.some(t => t.trim().toLowerCase() === time.trim().toLowerCase());
                              return (
                                <button 
                                  key={i} 
                                  onClick={() => !isBooked && handleBook(doc._id, time)}
                                  disabled={isBooked || bookingLoading !== null}
                                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                                    isBooked 
                                      ? "bg-red-500 text-white border-red-500 cursor-not-allowed opacity-100" 
                                      : bookingLoading === time 
                                          ? "bg-[#5747e6] text-white border-[#5747e6]" 
                                          : "bg-white border-slate-200 text-slate-600 hover:border-[#5747e6] hover:text-[#5747e6]"
                                  }`}
                                >
                                   {bookingLoading === time && <Loader2 className="w-3 h-3 animate-spin"/>}
                                   {isBooked ? "Booked" : time}
                                </button>
                              )
                           })}
                         </div>
                      </div>
                   </div>
                 )
              })}
            </div>
          </section>
          <footer className="mt-auto py-6 text-center text-slate-400 text-sm">© 2026 MediFlow AI Inc.</footer>
        </div>
      </main>

      {/* 🔴 CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 flex flex-col items-center text-center gap-4">
                 <div className="size-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <AlertTriangle className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Cancel Appointment?</h3>
                    <p className="text-sm text-slate-500">The slot will be freed for other patients.</p>
                 </div>
              </div>
              <div className="p-4 bg-slate-50 flex gap-3">
                 <button onClick={() => { setShowCancelModal(false); setAppointmentToCancel(null); }} className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-100 transition-colors">
                    Keep It
                 </button>
                 <button onClick={confirmCancellation} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
                    Yes, Cancel
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
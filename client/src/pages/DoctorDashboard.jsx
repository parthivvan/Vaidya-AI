import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, Calendar, FlaskConical, Folder, 
  MessageSquare, Settings, Bell, Search, Upload, AlertTriangle, 
  FileText, CheckCircle, History, Grid, List, Activity, Clock, 
  Users, Video, MoreVertical, X, CheckSquare, XCircle
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('schedule'); // Default to Schedule
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🛡️ SECURITY BOUNCER
  useEffect(() => {
    if (user && user.role !== 'doctor') navigate("/dashboard");
  }, [user, navigate]);

  // Fetch Schedule
  const fetchSchedule = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`http://localhost:5001/api/appointments/doctor/${user.id}`); 
        if(res.ok) setAppointments(await res.json());
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    if (user?.role === 'doctor') fetchSchedule();
  }, [user]);

  // Logout Handler
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#f6f6f8] font-sans text-[#100e1b] overflow-hidden">
      {/* INJECT FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d3d1e6; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #5747e6; }
      `}</style>

      {/* 🟢 SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col py-6 px-4 hidden md:flex z-20 shadow-sm">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 bg-[#5747e6]/10 rounded-xl flex items-center justify-center text-[#5747e6]">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight font-display">MediFlow AI</h2>
        </div>

        <nav className="flex flex-col gap-2 font-display">
          <SidebarItem icon={LayoutDashboard} label="Overview" onClick={() => setActiveTab('overview')} active={activeTab === 'overview'} />
          <SidebarItem icon={Calendar} label="My Schedule" onClick={() => setActiveTab('schedule')} active={activeTab === 'schedule'} />
          <SidebarItem icon={FlaskConical} label="Smart Lab Analysis" onClick={() => setActiveTab('research')} active={activeTab === 'research'} isSpecial />
          <SidebarItem icon={Folder} label="Patient Records" onClick={() => {}} />
          <SidebarItem icon={MessageSquare} label="Consultations" onClick={() => {}} />
        </nav>

        <div className="mt-auto">
          <div className="bg-gradient-to-br from-[#5747e6]/10 to-[#5747e6]/5 p-4 rounded-xl mb-4 border border-[#5747e6]/10">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-[#5747e6]" />
              <p className="text-xs font-bold text-[#5747e6] font-display">AI Insights Ready</p>
            </div>
            <p className="text-xs text-[#575095] mb-3">3 new patient matches found based on recent lab uploads.</p>
            <button className="w-full bg-white text-[#5747e6] text-xs font-bold py-2 rounded-lg shadow-sm hover:shadow-md transition-all">View Insights</button>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#575095] hover:bg-red-50 hover:text-red-600 transition-all w-full font-display">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* 🔵 MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center bg-[#f6f6f8] rounded-xl px-4 py-2.5 w-96">
                <Search className="w-5 h-5 text-[#575095]" />
                <input type="text" placeholder="Search patients..." className="bg-transparent border-none outline-none text-sm ml-3 w-full placeholder-[#575095]/50 font-display" />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-[#575095] hover:bg-[#f6f6f8] rounded-full transition-colors">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="text-right hidden xl:block font-display">
                        <p className="text-sm font-bold text-[#100e1b] leading-tight">Dr. {user?.fullName}</p>
                        <p className="text-xs text-[#575095] font-medium">Specialist</p>
                    </div>
                    <div className="w-10 h-10 bg-[#5747e6] rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-[#5747e6]/20">
                        {user?.fullName?.charAt(0) || "D"}
                    </div>
                </div>
            </div>
        </header>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 font-display">
            <div className="max-w-7xl mx-auto pb-12">
                
                {/* PAGE HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[#5747e6]/10 text-[#5747e6] px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                                {activeTab === 'research' ? 'Active Case' : 'Dashboard'}
                            </span>
                            <span className="text-[#575095] text-sm">Last updated: Just now</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#100e1b] tracking-tight">
                            {activeTab === 'research' ? 'Case Research & Analysis' : 'My Schedule & Queue'}
                        </h1>
                        <p className="text-[#575095] mt-2 text-lg">
                            {activeTab === 'research' ? 'AI-powered cross-referencing.' : `You have ${appointments.filter(a => a.status === 'pending').length} pending patients.`}
                        </p>
                    </div>
                    
                    <div className="flex bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
                         <TabButton label="My Schedule" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} icon={Calendar} />
                         <TabButton label="Smart Lab Analysis" active={activeTab === 'research'} onClick={() => setActiveTab('research')} icon={FlaskConical} />
                    </div>
                </div>

                {/* 🔀 CONDITIONAL CONTENT */}
                {activeTab === 'research' ? (
                    <LabResearchView />
                ) : (
                    <ScheduleView appointments={appointments} loading={loading} refresh={fetchSchedule} />
                )}

            </div>
        </div>
      </main>
    </div>
  );
};

// --- 🧩 SUB-COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, active, isSpecial, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group w-full ${
            active ? 'bg-[#f6f6f8] text-[#100e1b]' : 'text-[#575095] hover:bg-[#f6f6f8]'
        } ${isSpecial && !active ? 'bg-[#5747e6]/5 text-[#5747e6]' : ''}`}
    >
        <Icon className={`w-5 h-5 ${active || isSpecial ? 'text-[#5747e6]' : 'group-hover:text-[#5747e6] transition-colors'}`} />
        <span className={`text-sm font-medium ${active ? 'font-bold' : ''}`}>{label}</span>
    </button>
);

const TabButton = ({ label, active, onClick, icon: Icon }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            active ? 'bg-[#100e1b] text-white shadow-lg' : 'text-[#575095] hover:bg-gray-50'
        }`}
    >
        <Icon className="w-4 h-4" /> {label}
    </button>
);

// --- 📅 SCHEDULE VIEW ---
const ScheduleView = ({ appointments, loading, refresh }) => {
    
    // Action Handler
    const handleStatusChange = async (id, status) => {
        const toastId = toast.loading("Updating...");
        try {
            // NOTE: You'll need to create this route on backend if not exists, 
            // OR reuse the 'cancel' route logic for generic updates.
            // For now, we reuse the cancel route for cancellation.
            let url = `http://localhost:5001/api/appointments/cancel/${id}`;
            
            // If you implement a generic update route later:
            // url = `http://localhost:5001/api/appointments/update/${id}`
            
            const res = await fetch(url, { method: "PUT" });
            if (res.ok) {
                toast.success(`Marked as ${status}`, { id: toastId });
                refresh(); // Reload data
            } else {
                toast.error("Failed to update", { id: toastId });
            }
        } catch (error) {
            toast.error("Server error", { id: toastId });
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={Users} label="Total Patients" value={appointments.length} color="text-blue-600" bg="bg-blue-50" />
                <StatCard icon={Clock} label="Pending" value={appointments.filter(a => a.status === 'pending').length} color="text-amber-600" bg="bg-amber-50" />
                <StatCard icon={CheckCircle} label="Completed" value={appointments.filter(a => a.status === 'confirmed' || a.status === 'completed').length} color="text-emerald-600" bg="bg-emerald-50" />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-2px_rgba(87,71,230,0.08)] overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-[#100e1b]">Upcoming Appointments</h3>
                    <div className="flex gap-2 text-xs font-bold">
                        <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded">● Pending</span>
                        <span className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded">● Cancelled</span>
                    </div>
                </div>
                <div className="divide-y divide-gray-50">
                    {loading ? (
                        <div className="p-12 text-center text-[#575095] animate-pulse">Loading schedule...</div>
                    ) : appointments.length === 0 ? (
                        <div className="p-12 text-center text-[#575095]">No appointments found.</div>
                    ) : (
                        appointments.map(appt => {
                            const isCancelled = appt.status === 'cancelled';
                            return (
                                <div key={appt._id} className={`p-6 transition-colors flex flex-col md:flex-row md:items-center gap-6 group ${isCancelled ? 'bg-gray-50 opacity-60' : 'hover:bg-[#f6f6f8]'}`}>
                                    
                                    {/* Time Box */}
                                    <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl font-display ${isCancelled ? 'bg-gray-200 text-gray-500' : 'bg-[#5747e6]/5 text-[#5747e6]'}`}>
                                        <span className="text-lg font-bold">{appt.timeSlot.split(' ')[0]}</span>
                                        <span className="text-[10px] uppercase font-bold tracking-wider">{appt.timeSlot.split(' ')[1] || 'AM'}</span>
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-[#100e1b] flex items-center gap-2">
                                            {appt.patientId?.fullName || "Unknown Patient"}
                                            {isCancelled && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase">Cancelled</span>}
                                        </h4>
                                        <p className="text-sm text-[#575095] flex items-center gap-2 mt-1">
                                            <FileText className="w-3 h-3" /> Reason: {appt.reason || "General Consultation"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">ID: #{appt._id.slice(-5)}</p>
                                    </div>

                                    {/* Actions */}
                                    {!isCancelled && (
                                        <div className="flex items-center gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleStatusChange(appt._id, 'cancelled')}
                                                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Cancel Appointment">
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                            
                                            <button 
                                                onClick={() => window.open(appt.meetingLink, "_blank")}
                                                className="flex items-center gap-2 px-4 py-2 bg-[#5747e6] text-white rounded-lg font-bold text-sm shadow-lg shadow-[#5747e6]/20 hover:bg-[#4638b9] transition-all"
                                            >
                                                <Video className="w-4 h-4" /> Start Call
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bg} ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-[#575095] text-xs font-bold uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-[#100e1b] font-display">{value}</p>
        </div>
    </div>
);

// --- 🧠 RESEARCH VIEW (Unchanged) ---
const LabResearchView = () => {
    // ... (Keep your existing LabResearchView code here exactly as it was)
    // For brevity, I am assuming you will keep the same code block you provided for this component.
    return (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
            Lab Research Component Placeholder
        </div>
    )
};

export default DoctorDashboard;
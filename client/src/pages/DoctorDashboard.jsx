import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, Calendar, FlaskConical, Folder, 
  MessageSquare, Settings, Bell, Search, Activity, 
  Clock, Users, Video, XCircle, FileText, Eye, CheckCircle
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

  // 1. Fetch Schedule (Appointments)
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

  // 2. 🕵️‍♂️ SPY FUNCTION (Tracks when you view a report)
  const trackFileAccess = async (patientName, reportName) => {
      const toastId = toast.loading("Decrypting Secure File...");
      try {
          await fetch("http://localhost:5001/api/admin/log-access", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  doctorId: user.id, 
                  patientId: "65d4c8f9a2b3c4d5e6f7a8b9", // Dummy ID for demo reports
                  details: `Opened report: ${reportName} for ${patientName}`
              })
          });
          toast.success("Access Authorized & Logged", { id: toastId });
      } catch (err) {
          console.error("Spy failed:", err);
          toast.error("Access Error", { id: toastId });
      }
  };

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
          <SidebarItem icon={LayoutDashboard} label="Overview" onClick={() => setActiveTab('schedule')} active={activeTab === 'schedule'} />
          <SidebarItem icon={FlaskConical} label="Smart Lab Analysis" onClick={() => setActiveTab('research')} active={activeTab === 'research'} isSpecial />
          <SidebarItem icon={Folder} label="Patient Records" onClick={() => {}} />
          <SidebarItem icon={MessageSquare} label="Consultations" onClick={() => {}} />
        </nav>

        <div className="mt-auto">
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
                <div className="text-right hidden xl:block font-display">
                    <p className="text-sm font-bold text-[#100e1b] leading-tight">Dr. {user?.fullName}</p>
                    <p className="text-xs text-[#575095] font-medium">Specialist</p>
                </div>
                <div className="w-10 h-10 bg-[#5747e6] rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-[#5747e6]/20">
                    {user?.fullName?.charAt(0) || "D"}
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
                                {activeTab === 'research' ? 'AI Analysis Mode' : 'Dashboard'}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#100e1b] tracking-tight">
                            {activeTab === 'research' ? 'Smart Lab Reports' : 'My Schedule & Queue'}
                        </h1>
                    </div>
                </div>

                {/* 🔀 CONDITIONAL CONTENT */}
                {activeTab === 'research' ? (
                    <LabResearchView onViewReport={trackFileAccess} />
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
            active ? 'bg-[#f6f6f8] text-[#100e1b] font-bold' : 'text-[#575095] hover:bg-[#f6f6f8]'
        } ${isSpecial && !active ? 'bg-[#5747e6]/5 text-[#5747e6]' : ''}`}
    >
        <Icon className={`w-5 h-5 ${active || isSpecial ? 'text-[#5747e6]' : 'group-hover:text-[#5747e6] transition-colors'}`} />
        <span className={`text-sm font-medium ${active ? 'font-bold' : ''}`}>{label}</span>
    </button>
);

// --- 📅 SCHEDULE VIEW (With Stats + Cancel Logic) ---
const ScheduleView = ({ appointments, loading, refresh }) => {
    
    // Cancel Handler
    const handleStatusChange = async (id, status) => {
        const toastId = toast.loading("Updating...");
        try {
            // Reusing the cancel route we created
            let url = `http://localhost:5001/api/appointments/cancel/${id}`;
            const res = await fetch(url, { method: "PUT" });
            
            if (res.ok) {
                toast.success(`Appointment Cancelled`, { id: toastId });
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
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={Users} label="Total Patients" value={appointments.length} color="text-blue-600" bg="bg-blue-50" />
                <StatCard icon={Clock} label="Pending" value={appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length} color="text-amber-600" bg="bg-amber-50" />
                <StatCard icon={CheckCircle} label="Completed" value={appointments.filter(a => a.status === 'completed').length} color="text-emerald-600" bg="bg-emerald-50" />
            </div>

            {/* Appointment List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-2px_rgba(87,71,230,0.08)] overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-[#100e1b]">Upcoming Appointments</h3>
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
                                    </div>

                                    {/* Actions */}
                                    {!isCancelled && (
                                        <div className="flex items-center gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleStatusChange(appt._id, 'cancelled')}
                                                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2" title="Cancel Appointment">
                                                <XCircle className="w-5 h-5" /> <span className="text-sm font-bold md:hidden">Cancel</span>
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

// --- 🧪 LAB RESEARCH VIEW (Spy Feature) ---
const LabResearchView = ({ onViewReport }) => {
    // Dummy Data for Demo
    const reports = [
        { id: 1, patient: "John Doe", test: "Complete Blood Count (CBC)", date: "Feb 18, 2026", status: "Critical", file: "cbc_report.pdf" },
        { id: 2, patient: "Sarah Smith", test: "Lipid Profile", date: "Feb 17, 2026", status: "Normal", file: "lipid_scan.pdf" },
    ];

    return (
        <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-3 text-indigo-700 mb-4">
                <Activity className="w-5 h-5" />
                <span className="text-sm font-bold">Secure Access Mode: All file interactions are logged for compliance.</span>
             </div>

            {reports.map((report) => (
                <div key={report.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            report.status === 'Critical' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'
                        }`}>
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">{report.test}</h3>
                            <p className="text-slate-500 text-sm">Patient: <span className="font-bold text-slate-700">{report.patient}</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            report.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                            {report.status}
                        </span>

                        <button 
                            onClick={() => {
                                window.open("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "_blank");
                                onViewReport(report.patient, report.test); // 🚨 FIRE SPY LOG
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-[#5747e6] text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            <Eye className="w-4 h-4" /> View Report
                        </button>
                    </div>
                </div>
            ))}
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

export default DoctorDashboard;
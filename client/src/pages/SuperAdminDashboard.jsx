import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, LayoutDashboard, Eye, ShoppingCart, Calendar, 
  Activity, Settings, LogOut, Search, Bell, Users, 
  Server, AlertTriangle, CheckCircle, Clock, FileText, MapPin 
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('logs');
  
  // Data State
  const [logs, setLogs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [usersList, setUsersList] = useState([]); // 🟢 NEW: Users State
  const [loading, setLoading] = useState(true);

  // Stats Calculation
  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  const securityEvents = logs.length;

  // --- SECURITY CHECK ---
  useEffect(() => {
    if (user && user.role !== 'superadmin') {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // 🟢 UPDATED: Now fetching Users as well
        const [logsRes, ordersRes, apptRes, usersRes] = await Promise.all([
          fetch("http://localhost:5001/api/admin/logs"),
          fetch("http://localhost:5001/api/admin/all-orders"),
          fetch("http://localhost:5001/api/admin/all-appointments"),
          fetch("http://localhost:5001/api/users") 
        ]);

        if (logsRes.ok) setLogs(await logsRes.json());
        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (apptRes.ok) setAppointments(await apptRes.json());
        if (usersRes.ok) setUsersList(await usersRes.json()); // Store users
      } catch (error) {
        console.error("Admin Load Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-display">
      <div className="flex flex-col items-center gap-2">
        <Shield className="w-10 h-10 animate-pulse text-[#5747e6]" />
        <p>Decrypting Admin Protocols...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] text-[#0f172a] font-sans overflow-hidden">
      
      {/* 1. SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col z-20 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 rounded-xl bg-[#5747e6]/10 flex items-center justify-center text-[#5747e6]">
                <Shield className="w-6 h-6" />
             </div>
             <div>
               <h1 className="text-lg font-bold font-display leading-tight">MediFlow AI</h1>
               <div className="flex items-center gap-1.5 mt-1 bg-red-50 w-fit px-2 py-0.5 rounded-full border border-red-100">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">God Mode</span>
               </div>
             </div>
          </div>

          <nav className="space-y-1 font-medium">
            <SidebarItem icon={Eye} label="Spy Log (Audit)" active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
            <SidebarItem icon={Users} label="Active Users (Map)" active={activeTab === 'users'} onClick={() => setActiveTab('users')} /> {/* 🟢 NEW ITEM */}
            <SidebarItem icon={ShoppingCart} label="Global Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
            <SidebarItem icon={Calendar} label="Master Schedule" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
            <div className="pt-4 mt-4 border-t border-slate-100">
               <SidebarItem icon={Settings} label="System Settings" />
            </div>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
           <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-3 text-slate-500 hover:text-red-500 transition-colors text-sm font-bold w-full p-2 hover:bg-red-50 rounded-lg">
             <LogOut className="w-4 h-4" /> Log Out
           </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
           <div className="flex items-center gap-3 text-slate-800">
              <Activity className="w-5 h-5 text-[#5747e6]" />
              <h2 className="font-bold font-display text-lg">System Overview</h2>
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-xs font-bold text-emerald-700 uppercase">Systems Operational</span>
              </div>
              <div className="w-px h-6 bg-slate-200"></div>
              <div className="flex items-center gap-3">
                 <span className="text-sm font-bold text-slate-600">Super Admin</span>
                 <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold">A</div>
              </div>
           </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
           <div className="max-w-7xl mx-auto space-y-8">
              
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <StatCard icon={Users} label="Total Users" value={usersList.length} trend="+12%" />
                 <StatCard icon={Activity} label="Total Revenue" value={`₹${totalRevenue}`} trend="+5%" trendColor="text-emerald-600" />
                 <StatCard icon={Shield} label="Security Events" value={securityEvents} trend="Active" trendColor="text-blue-600" />
                 <StatCard icon={Server} label="Server Load" value="42%" trend="Stable" trendColor="text-emerald-600" />
              </div>

              {/* 3. DYNAMIC CONTENT AREA */}
              
              {/* --- VIEW: SPY LOG --- */}
              {activeTab === 'logs' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <Eye className="w-4 h-4 text-[#5747e6]" /> The Spy Log
                    </h3>
                    <div className="flex gap-2">
                       <span className="text-xs font-bold text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded">Live Feed</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold tracking-wider">
                        <tr>
                           <th className="px-6 py-4 border-b border-slate-200">Timestamp</th>
                           <th className="px-6 py-4 border-b border-slate-200">Doctor</th>
                           <th className="px-6 py-4 border-b border-slate-200">Action</th>
                           <th className="px-6 py-4 border-b border-slate-200">Details</th>
                           <th className="px-6 py-4 border-b border-slate-200">Target Patient</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {logs.map(log => (
                          <tr key={log._id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-3 font-mono text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                            <td className="px-6 py-3 font-bold text-slate-700 flex items-center gap-2">
                               <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">Dr</div>
                               {log.doctorId?.name || "Unknown"}
                            </td>
                            <td className="px-6 py-3">
                               <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                                  <Eye className="w-3 h-3" /> {log.action}
                               </span>
                            </td>
                            <td className="px-6 py-3 text-slate-600">{log.details}</td>
                            <td className="px-6 py-3 text-slate-500">{log.patientId?.fullName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {logs.length === 0 && <div className="p-8 text-center text-slate-400">No security events recorded yet.</div>}
                  </div>
                </div>
              )}

              {/* --- 🟢 NEW VIEW: ACTIVE USERS & LOCATIONS --- */}
              {activeTab === 'users' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <Users className="w-4 h-4 text-[#5747e6]" /> Active Users Map
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold tracking-wider">
                        <tr>
                           <th className="px-6 py-4 border-b border-slate-200">User Name</th>
                           <th className="px-6 py-4 border-b border-slate-200">Email</th>
                           <th className="px-6 py-4 border-b border-slate-200">Role</th>
                           <th className="px-6 py-4 border-b border-slate-200">Last Known Location</th>
                           <th className="px-6 py-4 border-b border-slate-200">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {usersList.map(u => (
                          <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-3 font-bold text-slate-700">{u.fullName}</td>
                            <td className="px-6 py-3 text-slate-500">{u.email}</td>
                            <td className="px-6 py-3">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                    u.role === 'admin' ? 'bg-red-100 text-red-600' :
                                    u.role === 'doctor' ? 'bg-indigo-100 text-indigo-600' :
                                    'bg-slate-100 text-slate-600'
                                }`}>
                                    {u.role}
                                </span>
                            </td>
                            <td className="px-6 py-3">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                    u.location && u.location !== 'Unknown' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                    : 'bg-slate-50 text-slate-400 border-slate-100'
                                }`}>
                                   <MapPin className="w-3 h-3" /> {u.location || "Unknown"}
                                </span>
                            </td>
                            <td className="px-6 py-3">
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Active
                                </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* --- VIEW: ORDERS --- */}
              {activeTab === 'orders' && (
                 <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                       <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-[#5747e6]" /> Global Orders Feed
                       </h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                       {orders.map(order => (
                          <div key={order._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[#5747e6]/10 flex items-center justify-center text-[#5747e6]">
                                   <ShoppingBagIcon />
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-slate-800">Order #{order._id.slice(-6)}</p>
                                   <p className="text-xs text-slate-500">Customer: {order.user?.fullName}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-sm font-bold text-slate-900">₹{order.totalAmount}</p>
                                <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase mt-1">Paid</span>
                             </div>
                          </div>
                       ))}
                       {orders.length === 0 && <div className="p-8 text-center text-slate-400">No orders placed yet.</div>}
                    </div>
                 </div>
              )}

              {/* --- VIEW: APPOINTMENTS --- */}
              {activeTab === 'appointments' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {appointments.map(appt => (
                       <div key={appt._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                          <div className="flex justify-between items-start mb-4">
                             <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wide">
                                <Clock className="w-3 h-3" /> {appt.date} • {appt.timeSlot}
                             </div>
                             <div className={`w-2 h-2 rounded-full ${appt.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                          </div>
                          
                          <div className="space-y-3">
                             <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Patient</p>
                                <p className="font-bold text-slate-900">{appt.patientId?.fullName || "Unknown"}</p>
                             </div>
                             <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Doctor</p>
                                <p className="font-bold text-[#5747e6]">{appt.doctorId?.name || "Unknown Dr"}</p>
                             </div>
                             <div className="pt-3 border-t border-slate-50 mt-3">
                                <p className="text-xs text-slate-500 italic">"{appt.reason}"</p>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              )}

           </div>
        </div>
      </main>
    </div>
  );
};

// --- SUB COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
       active 
        ? 'bg-[#5747e6]/10 text-[#5747e6] font-bold' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
     <Icon className={`w-5 h-5 ${active ? 'text-[#5747e6]' : 'text-slate-400'}`} />
     {label}
  </button>
);

const StatCard = ({ icon: Icon, label, value, trend, trendColor = "text-emerald-600" }) => (
   <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1 relative overflow-hidden">
      <div className="absolute top-4 right-4 p-2 bg-slate-50 rounded-lg text-slate-400">
         <Icon className="w-5 h-5" />
      </div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
         <p className="text-slate-900 text-3xl font-bold font-display">{value}</p>
         <span className={`${trendColor} text-xs font-bold bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100`}>{trend}</span>
      </div>
   </div>
);

// Simple Shopping Bag Icon Component for the order list
const ShoppingBagIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);

export default SuperAdminDashboard;
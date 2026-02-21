import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
   Shield, LayoutDashboard, Eye, ShoppingCart, Calendar,
   Activity, Settings, LogOut, Search, Bell, Users,
   Server, AlertTriangle, CheckCircle, Clock, FileText, MapPin,
   Stethoscope, Upload, Loader2, Pill, FlaskConical // 🟢 ADDED FlaskConical
} from 'lucide-react';
import toast from 'react-hot-toast';

const SuperAdminDashboard = () => {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState('logs');

   // Data State
   const [logs, setLogs] = useState([]);
   const [orders, setOrders] = useState([]);
   const [appointments, setAppointments] = useState([]);
   const [usersList, setUsersList] = useState([]);
   const [doctors, setDoctors] = useState([]);
   const [prescriptions, setPrescriptions] = useState([]);
   const [labAppointments, setLabAppointments] = useState([]); // 🟢 NEW: Lab Appointments State
   const [uploadingId, setUploadingId] = useState(null);
   const [loading, setLoading] = useState(true);

   // Stats Calculation
   const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
   const securityEvents = logs.length;
   const onlineUsers = usersList.filter(u => u.isOnline).length;

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
            // 🟢 Added the lab-appointments fetch to the Promise.all
            const [logsRes, ordersRes, apptRes, usersRes, docsRes, rxRes, labRes] = await Promise.all([
               fetch("http://localhost:5001/api/admin/logs"),
               fetch("http://localhost:5001/api/admin/all-orders"),
               fetch("http://localhost:5001/api/admin/all-appointments"),
               fetch("http://localhost:5001/api/users"),
               fetch("http://localhost:5001/api/doctors"),
               fetch("http://localhost:5001/api/prescriptions/all"),
               fetch("http://localhost:5001/api/admin/all-lab-appointments") // 🟢 FETCH LAB DATA
            ]);

            if (logsRes.ok) setLogs(await logsRes.json());
            if (ordersRes.ok) setOrders(await ordersRes.json());
            if (apptRes.ok) setAppointments(await apptRes.json());
            if (usersRes.ok) setUsersList(await usersRes.json());
            if (docsRes.ok) setDoctors(await docsRes.json());
            if (rxRes.ok) setPrescriptions(await rxRes.json());
            if (labRes.ok) setLabAppointments(await labRes.json()); // 🟢 SET LAB DATA
         } catch (error) {
            console.error("Admin Load Error:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchAdminData();
      const interval = setInterval(fetchAdminData, 30000);
      return () => clearInterval(interval);
   }, []);

   const handleImageUpload = async (doctorId, e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploadingId(doctorId);
      const toastId = toast.loading("Uploading image to Cloudinary...");
      const formData = new FormData();
      formData.append("image", file);

      try {
         const res = await fetch(`http://localhost:5001/api/doctors/${doctorId}/image`, {
            method: "PUT",
            body: formData,
         });
         const data = await res.json();
         if (res.ok) {
            toast.success("Profile picture updated!", { id: toastId });
            setDoctors(prev => prev.map(doc => doc._id === doctorId ? { ...doc, image: data.doctor.image } : doc));
         } else toast.error(data.message || "Upload failed", { id: toastId });
      } catch (err) { toast.error("Server Error", { id: toastId }); } finally { setUploadingId(null); }
   };

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
         {/* SIDEBAR */}
         <aside className="w-72 bg-white border-r border-slate-200 flex flex-col z-20 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="p-6">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-[#5747e6]/10 flex items-center justify-center text-[#5747e6]"><Shield className="w-6 h-6" /></div>
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
                  <SidebarItem icon={Users} label={`Users Map (${onlineUsers} Online)`} active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                  <SidebarItem icon={Stethoscope} label="Manage Doctors" active={activeTab === 'doctors'} onClick={() => setActiveTab('doctors')} />
                  <SidebarItem icon={FileText} label="E-Prescriptions" active={activeTab === 'prescriptions'} onClick={() => setActiveTab('prescriptions')} />
                  <SidebarItem icon={ShoppingCart} label="Global Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                  <SidebarItem icon={Calendar} label="Master Schedule" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />

                  {/* 🟢 NEW LAB SCHEDULE NAVIGATION BUTTON */}
                  <SidebarItem icon={FlaskConical} label="Lab Schedule" active={activeTab === 'lab_schedule'} onClick={() => setActiveTab('lab_schedule')} />
               </nav>
            </div>
            <div className="mt-auto p-6 border-t border-slate-100">
               <button onClick={logout} className="flex items-center gap-3 text-slate-500 hover:text-red-500 transition-colors text-sm font-bold w-full p-2 hover:bg-red-50 rounded-lg">
                  <LogOut className="w-4 h-4" /> Log Out
               </button>
            </div>
         </aside>

         {/* MAIN CONTENT */}
         <main className="flex-1 flex flex-col h-full overflow-hidden relative">
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
               </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
               <div className="max-w-7xl mx-auto space-y-8">

                  {/* Metrics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     <StatCard icon={Users} label="Total Users" value={usersList.length} trend={`${onlineUsers} Active Now`} />
                     <StatCard icon={Activity} label="Total Revenue" value={`₹${totalRevenue}`} trend="+5%" trendColor="text-emerald-600" />
                     <StatCard icon={FlaskConical} label="Lab Bookings" value={labAppointments.length} trend="Total Scheduled" trendColor="text-indigo-600" />
                     <StatCard icon={Shield} label="Security Events" value={securityEvents} trend="Active" trendColor="text-blue-600" />
                  </div>

                  {/* --- EXISTING VIEWS --- */}
                  {activeTab === 'users' && ( /* ... Users View ... */
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                           <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users className="w-4 h-4 text-[#5747e6]" /> Global Users Status</h3>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold border-b border-slate-200">
                                 <tr><th className="px-6 py-4">User Name</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Status</th></tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-sm">
                                 {usersList.map(u => (
                                    <tr key={u._id} className="hover:bg-slate-50">
                                       <td className="px-6 py-3 font-bold text-slate-700">{u.fullName}</td>
                                       <td className="px-6 py-3 text-slate-500">{u.email}</td>
                                       <td className="px-6 py-3"><span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{u.role}</span></td>
                                       <td className="px-6 py-3">
                                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${u.isOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
                                             <div className={`w-2 h-2 rounded-full ${u.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                             {u.isOnline ? 'Online Now' : 'Offline'}
                                          </span>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  )}

                  {activeTab === 'prescriptions' && ( /* ... Prescriptions View ... */
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                           <h3 className="font-bold text-slate-800 flex items-center gap-2"><FileText className="w-4 h-4 text-[#5747e6]" /> E-Prescription Audit Log</h3>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold border-b border-slate-200">
                                 <tr>
                                    <th className="px-6 py-4">Date Issued</th><th className="px-6 py-4">Doctor</th><th className="px-6 py-4">Patient</th><th className="px-6 py-4">Diagnosis</th><th className="px-6 py-4">Drugs</th><th className="px-6 py-4 text-right">Verification</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-sm">
                                 {prescriptions.map(rx => (
                                    <tr key={rx._id} className="hover:bg-slate-50">
                                       <td className="px-6 py-4 text-slate-500 text-xs font-mono">{new Date(rx.createdAt).toLocaleDateString()}</td>
                                       <td className="px-6 py-4 font-bold text-[#5747e6]">Dr. {rx.doctorId?.name || "Unknown"}</td>
                                       <td className="px-6 py-4 font-bold text-slate-700">{rx.patientId?.fullName || "Unknown"}</td>
                                       <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate">{rx.diagnosis || "General"}</td>
                                       <td className="px-6 py-4">
                                          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-bold border border-indigo-100">
                                             <Pill className="w-3 h-3" /> {rx.medicines?.length || 0} items
                                          </span>
                                       </td>
                                       <td className="px-6 py-4 text-right">
                                          <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded border border-slate-200">{rx._id.slice(-6).toUpperCase()}</span>
                                       </td>
                                    </tr>
                                 ))}
                                 {prescriptions.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-slate-400">No prescriptions issued yet.</td></tr>}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  )}

                  {activeTab === 'logs' && ( /* ... Logs View ... */
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                           <h3 className="font-bold text-slate-800 flex items-center gap-2"><Eye className="w-4 h-4 text-[#5747e6]" /> The Spy Log</h3>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left border-collapse">
                              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold tracking-wider">
                                 <tr><th className="px-6 py-4 border-b border-slate-200">Timestamp</th><th className="px-6 py-4 border-b border-slate-200">Doctor</th><th className="px-6 py-4 border-b border-slate-200">Action</th><th className="px-6 py-4 border-b border-slate-200">Details</th><th className="px-6 py-4 border-b border-slate-200">Target Patient</th></tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-sm">
                                 {logs.map(log => (
                                    <tr key={log._id} className="hover:bg-slate-50 transition-colors group">
                                       <td className="px-6 py-3 font-mono text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                                       <td className="px-6 py-3 font-bold text-slate-700 flex items-center gap-2">Dr. {log.doctorId?.name || "Unknown"}</td>
                                       <td className="px-6 py-3"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100"><Eye className="w-3 h-3" /> {log.action}</span></td>
                                       <td className="px-6 py-3 text-slate-600">{log.details}</td>
                                       <td className="px-6 py-3 text-slate-500">{log.patientId?.fullName}</td>
                                    </tr>
                                 ))}
                                 {logs.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-400">No security events recorded yet.</td></tr>}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  )}

                  {activeTab === 'doctors' && ( /* ... Doctors View ... */
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                           <h3 className="font-bold text-slate-800 flex items-center gap-2"><Stethoscope className="w-4 h-4 text-[#5747e6]" /> Manage Doctor Profiles</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {doctors.map(doc => {
                              const docName = doc.name || doc.userId?.fullName || "Unknown Doctor";
                              return (
                                 <div key={doc._id} className="border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow relative">
                                    <div className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-sm overflow-hidden mb-4 relative">
                                       <img src={doc.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${docName}`} alt={docName} className="w-full h-full object-cover" />
                                       {uploadingId === doc._id && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="w-6 h-6 text-white animate-spin" /></div>}
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-lg">Dr. {docName}</h4>
                                    <p className="text-sm text-[#5747e6] font-medium mb-1">{doc.specialization}</p>
                                    <p className="text-xs text-slate-500 mb-6">Exp: {doc.experience} Yrs • Fee: ₹{doc.consultationFee}</p>
                                    <label className={`w-full py-2.5 rounded-xl text-sm font-bold border-2 border-dashed flex items-center justify-center gap-2 cursor-pointer transition-colors ${doc.image ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' : 'border-slate-300 text-slate-600 hover:border-[#5747e6] hover:text-[#5747e6]'}`}>
                                       <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(doc._id, e)} disabled={uploadingId === doc._id} />
                                       <Upload className="w-4 h-4" />
                                       {doc.image ? "Update Picture" : "Upload Picture"}
                                    </label>
                                 </div>
                              )
                           })}
                        </div>
                     </div>
                  )}

                  {activeTab === 'orders' && ( /* ... Orders View ... */
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                           <h3 className="font-bold text-slate-800 flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-[#5747e6]" /> Global Orders Feed</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                           {orders.map(order => (
                              <div key={order._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#5747e6]/10 flex items-center justify-center text-[#5747e6]">
                                       <ShoppingCart className="w-5 h-5" />
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-slate-800">Order #{order._id.slice(-6)}</p>
                                       <p className="text-xs text-slate-500">Customer: {order.user?.fullName || "Patient"}</p>
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

                  {activeTab === 'appointments' && ( /* ... Appointments View ... */
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {appointments.map(appt => (
                           <div key={appt._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                              <div className="flex justify-between items-start mb-4">
                                 <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wide">
                                    <Clock className="w-3 h-3" /> {appt.date} • {appt.timeSlot}
                                 </div>
                                 <div className={`w-2 h-2 rounded-full ${appt.status === 'confirmed' || appt.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
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
                        {appointments.length === 0 && <div className="col-span-full p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200">No appointments scheduled yet.</div>}
                     </div>
                  )}

                  {/* 🟢 NEW VIEW: LAB SCHEDULE (Tailored to your Schema) */}
                  {activeTab === 'lab_schedule' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="col-span-full mb-2 flex items-center justify-between">
                           <h3 className="font-bold text-slate-800 flex items-center gap-2">
                              <FlaskConical className="w-5 h-5 text-[#5747e6]" /> Diagnostic Lab Schedule
                           </h3>
                           <span className="text-xs font-bold bg-[#5747e6]/10 text-[#5747e6] px-3 py-1 rounded-full border border-[#5747e6]/20">
                              {labAppointments.length} Total Bookings
                           </span>
                        </div>

                        {labAppointments.map(lab => {
                           // Dynamic styling based on the reportStatus field you created!
                           const isReportReady = lab.reportStatus === 'Generated' || lab.reportStatus === 'Completed';

                           return (
                              <div key={lab._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col h-full">
                                 {/* Decorative side accent */}
                                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-purple-500"></div>

                                 <div className="flex justify-between items-start mb-4 pl-2">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wide">
                                       <Clock className="w-3 h-3" /> {lab.date || "TBA"} • {lab.timeSlot || "TBA"}
                                    </div>
                                    <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${lab.status === 'completed' || lab.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                       {lab.status || "Pending"}
                                    </div>
                                 </div>

                                 <div className="space-y-4 pl-2 flex-grow">
                                    <div>
                                       <p className="text-xs text-slate-400 font-bold uppercase">Patient</p>
                                       <p className="font-bold text-slate-900">{lab.patientId?.fullName || "Unknown Patient"}</p>
                                    </div>
                                    <div>
                                       <p className="text-xs text-slate-400 font-bold uppercase">Test Required</p>
                                       <p className="font-bold text-[#5747e6] flex items-center gap-1.5 mt-0.5">
                                          <Activity className="w-4 h-4" />
                                          {/* Displays the Test Name if populated, else shows the ID/Default */}
                                          {lab.labTestId?.name || lab.labTestId || "Diagnostic Test"}
                                       </p>
                                    </div>
                                 </div>

                                 {/* 🟢 Report Status Footer matching your schema */}
                                 <div className="mt-4 pt-3 border-t border-slate-50 pl-2 flex items-center justify-between">
                                    <span className="text-xs text-slate-500 font-bold uppercase">Report Status:</span>
                                    <span className={`text-xs font-bold flex items-center gap-1 ${isReportReady ? 'text-emerald-600' : 'text-slate-400'}`}>
                                       {isReportReady ? <CheckCircle className="w-3 h-3" /> : <Loader2 className="w-3 h-3 animate-spin" />}
                                       {lab.reportStatus || "Pending Analysis"}
                                    </span>
                                 </div>
                              </div>
                           )
                        })}

                        {labAppointments.length === 0 && (
                           <div className="col-span-full p-12 flex flex-col items-center justify-center text-center text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed">
                              <FlaskConical className="w-12 h-12 mb-3 text-slate-300" />
                              <p className="font-medium text-slate-500">No lab tests scheduled.</p>
                              <p className="text-sm mt-1">When patients book diagnostics, they will appear here.</p>
                           </div>
                        )}
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
   <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${active ? 'bg-[#5747e6]/10 text-[#5747e6] font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
      <Icon className={`w-5 h-5 ${active ? 'text-[#5747e6]' : 'text-slate-400'}`} />{label}
   </button>
);
const StatCard = ({ icon: Icon, label, value, trend, trendColor = "text-emerald-600" }) => (
   <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1 relative overflow-hidden">
      <div className="absolute top-4 right-4 p-2 bg-slate-50 rounded-lg text-slate-400"><Icon className="w-5 h-5" /></div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
         <p className="text-slate-900 text-3xl font-bold font-display">{value}</p>
         <span className={`${trendColor} text-xs font-bold bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100`}>{trend}</span>
      </div>
   </div>
);

export default SuperAdminDashboard;
import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Activity, MapPin, Phone, ShieldCheck, AlertTriangle, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { QRCodeSVG } from 'qrcode.react'; // 🟢 NEW QR CODE LIBRARY
import { useNavigate } from 'react-router-dom'; // 🟢 THIS IS THE MISSING PIECE!

const PrescriptionViewer = ({ isOpen, onClose, appointmentId }) => {
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !appointmentId) return;
        const fetchRx = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:5001/api/prescriptions/appointment/${appointmentId}`);
                if (res.ok) setPrescription(await res.json());
            } catch (e) { toast.error("Error loading Rx"); } finally { setLoading(false); }
        };
        fetchRx();
    }, [isOpen, appointmentId]);

    const navigate = useNavigate(); // 🟢 ADD THIS

    // 🛒 MAGIC CART FUNCTION
    const handleMagicCart = async () => {
        const toastId = toast.loading("Scanning Health Hive Pharmacy...");

        try {
            const res = await fetch(`http://localhost:5001/api/prescriptions/appointment/${appointmentId}/magic-cart`, {
                method: "POST"
            });

            const data = await res.json();

            if (res.ok) {
                if (data.foundCount === 0) {
                    toast.error("None of these medicines are currently in stock.", { id: toastId });
                    return;
                }

                toast.success(`Found ${data.foundCount} of ${data.totalCount} medicines!`, { id: toastId });

                // Save the matched products to LocalStorage so the Pharmacy page can grab them
                // (If you use Redux/Context for your cart, you can dispatch it here instead!)
                const existingCart = JSON.parse(localStorage.getItem('vaidya_cart')) || [];

                // Add new items (preventing exact duplicates based on ID)
                const newCart = [...existingCart];
                data.matchedProducts.forEach(product => {
                    if (!newCart.find(item => item._id === product._id)) {
                        newCart.push({ ...product, quantity: 1 }); // Default to 1 pack
                    }
                });

                localStorage.setItem('vaidya_cart', JSON.stringify(newCart));

                // 🟢 LEAVE A SECRET NOTE FOR THE PHARMACY PAGE
                sessionStorage.setItem('autofill_success', 'true');

                // Close modal and force a hard redirect to the ACTUAL store page
                onClose();
                window.location.href = '/pharmacy';

            } else {
                toast.error(data.message || "Failed to scan pharmacy", { id: toastId });
            }
        } catch (error) {
            toast.error("Server Error", { id: toastId });
        }
    };

    const downloadPDF = async () => {
        const element = document.getElementById('prescription-content');
        if (!element) return;
        const toastId = toast.loading("Generating Secure PDF...");
        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Vaidya_Rx_${prescription.patientId?.fullName}.pdf`);
            toast.success("Downloaded!", { id: toastId });
        } catch (e) { toast.error("PDF Failed", { id: toastId }); }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#e2e8f0] rounded-2xl shadow-2xl w-full max-w-4xl my-8 flex flex-col max-h-[90vh]">

                {/* Toolbar */}
                <div className="flex items-center justify-between p-4 bg-slate-800 text-white rounded-t-2xl shrink-0">
                    <div className="flex items-center gap-2 font-display font-bold"><ShieldCheck className="w-5 h-5 text-emerald-400" /> Secure Medical Record</div>
                    <div className="flex gap-3">
                        {/* 🟢 THE MAGIC CART BUTTON */}
                        {prescription?.medicines?.length > 0 && (
                            <button
                                onClick={handleMagicCart}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex gap-2 items-center shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105"
                            >
                                <ShoppingCart className="w-4 h-4" /> Auto-Fill Cart
                            </button>
                        )}
                        <button onClick={downloadPDF} className="bg-[#5747e6] hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-bold flex gap-2 items-center"><Download className="w-4 h-4" /> Print / PDF</button>
                        <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
                    {loading ? <div className="text-slate-500 animate-pulse mt-20">Decrypting Document...</div> : prescription && (

                        /* 📄 HOSPITAL PDF DOCUMENT */
                        <div id="prescription-content" className="bg-white p-10 shadow-xl w-[210mm] min-h-[297mm] text-slate-900 font-sans relative border-t-8 border-[#5747e6]">

                            {/* Header */}
                            <header className="flex justify-between items-start border-b-2 border-slate-100 pb-6 mb-6">
                                <div>
                                    <h1 className="text-3xl font-black font-display text-[#100e1b] flex items-center gap-2">
                                        <Activity className="w-8 h-8 text-[#5747e6]" /> Vaidya AI
                                    </h1>
                                    <p className="text-slate-500 text-sm mt-1">NPI: {prescription.verification?.hospitalRegNumber || "HOSP-0000"} | Reg: ISO 9001:2015</p>
                                </div>
                                <div className="text-right text-xs text-slate-500">
                                    <p>123 Health Ave, Medical City, NY 10001</p>
                                    <p>Phone: +1 (800) 555-0199 | www.vaidya.ai</p>
                                    <p className="font-bold text-slate-800 mt-2">Date: {new Date(prescription.createdAt).toLocaleDateString()}</p>
                                </div>
                            </header>

                            {/* Patient & Vitals Row */}
                            <div className="mb-6 flex gap-4">
                                <div className="flex-1 border border-slate-200 rounded-lg p-4 bg-slate-50">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Patient Information</p>
                                    <h3 className="font-bold text-lg text-slate-900">{prescription.patientId?.fullName}</h3>
                                    <p className="text-xs text-slate-500">ID: {prescription.patientId?._id?.slice(-8).toUpperCase()}</p>
                                </div>
                                {prescription.vitals && (
                                    <div className="flex-[2] border border-slate-200 rounded-lg p-4 flex justify-between items-center bg-white">
                                        <div className="text-center"><p className="text-[10px] text-slate-400 uppercase font-bold">BP</p><p className="font-bold text-sm">{prescription.vitals.bp || '-'}</p></div>
                                        <div className="text-center"><p className="text-[10px] text-slate-400 uppercase font-bold">Pulse</p><p className="font-bold text-sm">{prescription.vitals.pulse || '-'}</p></div>
                                        <div className="text-center"><p className="text-[10px] text-slate-400 uppercase font-bold">Temp</p><p className="font-bold text-sm">{prescription.vitals.temp || '-'}</p></div>
                                        <div className="text-center"><p className="text-[10px] text-slate-400 uppercase font-bold">Weight</p><p className="font-bold text-sm">{prescription.vitals.weight || '-'}</p></div>
                                    </div>
                                )}
                            </div>

                            {/* Allergies Warning */}
                            {prescription.allergies && prescription.allergies !== "None Known" && (
                                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2 text-sm font-bold">
                                    <AlertTriangle className="w-5 h-5" /> ALLERGIES: {prescription.allergies}
                                </div>
                            )}

                            {/* Diagnosis */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-1 border-b border-slate-100 pb-1">Primary Diagnosis</h4>
                                <p className="text-sm font-bold text-slate-800">{prescription.diagnosis}</p>
                            </div>

                            {/* Medications Table */}
                            <div className="mb-10 min-h-[250px]">
                                <h2 className="text-5xl font-black font-serif italic text-slate-900 mb-6">Rx</h2>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="py-2 px-3 text-[10px] uppercase font-bold text-slate-500 border border-slate-200 rounded-tl-lg">Medicine & Strength</th>
                                            <th className="py-2 px-3 text-[10px] uppercase font-bold text-slate-500 border border-slate-200">Route</th>
                                            <th className="py-2 px-3 text-[10px] uppercase font-bold text-slate-500 border border-slate-200">Frequency</th>
                                            <th className="py-2 px-3 text-[10px] uppercase font-bold text-slate-500 border border-slate-200">Days</th>
                                            <th className="py-2 px-3 text-[10px] uppercase font-bold text-slate-500 border border-slate-200 rounded-tr-lg">Instructions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prescription.medicines?.map((med, idx) => (
                                            <tr key={idx} className="border-b border-slate-200">
                                                <td className="py-3 px-3">
                                                    <p className="font-bold text-sm text-slate-900">{med.name}</p>
                                                    <p className="text-xs text-slate-500">{med.strengthForm || med.dosage /* Fallback for old Rx */}</p>
                                                </td>
                                                <td className="py-3 px-3 text-sm text-slate-700">{med.route || 'Oral'}</td>
                                                <td className="py-3 px-3 text-sm font-bold text-slate-700">{med.frequency || med.dosage}</td>
                                                <td className="py-3 px-3 text-sm text-slate-700">{med.days || med.duration}</td>
                                                <td className="py-3 px-3 text-xs text-slate-600 italic">{med.instructions || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Follow Up & Doctor Verification Block */}
                            <div className="mt-auto border-t-2 border-slate-800 pt-6 flex justify-between items-end">

                                {/* 🟢 QR CODE & METADATA */}
                                <div className="flex items-center gap-4">
                                    <div className="p-1 border-2 border-slate-200 rounded bg-white">
                                        <QRCodeSVG
                                            value={`https://vaidya.ai/verify/${prescription.verification?.signatureHash || prescription._id}`}
                                            size={64}
                                            level="L"
                                        />
                                    </div>
                                    <div className="text-[9px] text-slate-400 font-mono leading-tight">
                                        <p className="text-slate-600 font-bold mb-1 uppercase font-sans">Document Security Hash</p>
                                        <p>TS: {new Date(prescription.createdAt).toISOString()}</p>
                                        <p>DOC: {prescription.doctorId?._id}</p>
                                        <p>PAT: {prescription.patientId?._id}</p>
                                        <p className="break-all max-w-[150px]">SIG: {prescription.verification?.signatureHash || "UNVERIFIED"}</p>
                                    </div>
                                </div>

                                {/* SIGNATURE & LICENSE */}
                                <div className="text-center">
                                    {prescription.signature && <img src={prescription.signature} alt="Sign" className="h-16 mx-auto mix-blend-multiply mb-1" />}
                                    <div className="border-t border-slate-300 pt-1 px-4">
                                        <p className="font-bold text-slate-900 text-sm">Dr. {prescription.doctorId?.name}</p>
                                        <p className="text-[10px] text-slate-500 uppercase">{prescription.doctorId?.specialization}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Lic: {prescription.verification?.licenseNumber || "MED-5932-TX"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Hidden Footer string for SuperAdmin scraping */}
                            <div className="absolute bottom-2 left-10 text-[6px] text-transparent select-all">
                                {`[VAIDYA-META]-${prescription._id}-${prescription.doctorId?._id}-${Date.now()}`}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrescriptionViewer;
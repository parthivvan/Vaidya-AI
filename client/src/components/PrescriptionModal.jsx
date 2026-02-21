import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { X, Plus, Trash2, PenTool, CheckCircle, Activity, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PrescriptionModal = ({ isOpen, onClose, appointment, onSuccess }) => {
    const sigCanvas = useRef({});
    const [loading, setLoading] = useState(false);

    // Clinical State
    const [vitals, setVitals] = useState({ bp: '', temp: '', pulse: '', weight: '' });
    const [allergies, setAllergies] = useState('None Known');
    const [medicalHistory, setMedicalHistory] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [advice, setAdvice] = useState('');

    // Upgraded Medicines State
    const [medicines, setMedicines] = useState([
        { name: '', strengthForm: '', frequency: '', days: '', route: 'Oral', instructions: '' }
    ]);

    const handleMedicineChange = (index, field, value) => {
        const newMeds = [...medicines];
        newMeds[index][field] = value;
        setMedicines(newMeds);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (sigCanvas.current.isEmpty()) return toast.error("Please provide a signature!");
        if (!diagnosis) return toast.error("Diagnosis is required!");

        const signatureImage = sigCanvas.current.getCanvas().toDataURL('image/png');
        setLoading(true);
        const toastId = toast.loading("Encrypting & Generating E-Prescription...");

        try {
            const payload = {
                appointmentId: appointment._id,
                doctorId: appointment.doctorId._id || appointment.doctorId,
                patientId: appointment.patientId._id || appointment.patientId,
                vitals, allergies, medicalHistory, symptoms, diagnosis, advice, followUpDate,
                medicines: medicines.filter(m => m.name.trim() !== ''),
                signature: signatureImage,
                // Mocking License Data for Demo (In real app, pull from Doctor Profile)
                verification: { licenseNumber: "MED-5932-TX", hospitalRegNumber: "REG-2026-991" }
            };

            const res = await fetch("http://localhost:5001/api/prescriptions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success("Prescription Sent!", { id: toastId });
                onSuccess(); onClose();
            } else {
                toast.error("Failed to issue prescription", { id: toastId });
            }
        } catch (error) {
            toast.error("Server Error", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !appointment) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto py-10">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-auto relative">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 font-display flex items-center gap-2">
                            <PenTool className="w-5 h-5 text-[#5747e6]" /> Write Clinical Prescription
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Patient: <span className="font-bold text-slate-700">{appointment.patientId?.fullName}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><X className="w-6 h-6" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8 h-[70vh] overflow-y-auto">

                    {/* Section 1: Vitals & History */}
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-500" /> Patient Vitals & History</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <input type="text" placeholder="BP (e.g. 120/80)" className="p-2.5 border rounded-lg text-sm" value={vitals.bp} onChange={e => setVitals({ ...vitals, bp: e.target.value })} />
                            <input type="text" placeholder="Temp (°F)" className="p-2.5 border rounded-lg text-sm" value={vitals.temp} onChange={e => setVitals({ ...vitals, temp: e.target.value })} />
                            <input type="text" placeholder="Pulse (bpm)" className="p-2.5 border rounded-lg text-sm" value={vitals.pulse} onChange={e => setVitals({ ...vitals, pulse: e.target.value })} />
                            <input type="text" placeholder="Weight (kg)" className="p-2.5 border rounded-lg text-sm" value={vitals.weight} onChange={e => setVitals({ ...vitals, weight: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Allergies (Default: None Known)" className="p-2.5 border border-red-200 bg-red-50 rounded-lg text-sm" value={allergies} onChange={e => setAllergies(e.target.value)} />
                            <input type="text" placeholder="Previous Medical History" className="p-2.5 border rounded-lg text-sm" value={medicalHistory} onChange={e => setMedicalHistory(e.target.value)} />
                        </div>
                    </div>

                    {/* Section 2: Clinical Diagnosis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Symptoms</label><textarea rows="2" className="w-full p-3 bg-slate-50 border rounded-xl text-sm" value={symptoms} onChange={e => setSymptoms(e.target.value)} /></div>
                        <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Diagnosis <span className="text-red-500">*</span></label><textarea rows="2" required className="w-full p-3 bg-slate-50 border rounded-xl text-sm" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} /></div>
                    </div>

                    {/* Section 3: Upgraded Medicines Table */}
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 overflow-x-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-indigo-900">Rx Medications</h3>
                            <button type="button" onClick={() => setMedicines([...medicines, { name: '', strengthForm: '', frequency: '', days: '', route: 'Oral', instructions: '' }])} className="text-xs font-bold text-[#5747e6] bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1"><Plus className="w-3 h-3" /> Add Drug</button>
                        </div>
                        <div className="space-y-3 min-w-[700px]">
                            {medicines.map((med, index) => (
                                <div key={index} className="flex gap-2 items-start bg-white p-3 rounded-lg border border-indigo-50 shadow-sm">
                                    <input type="text" placeholder="Drug Name" className="w-1/4 p-2 bg-slate-50 border rounded-lg text-sm" value={med.name} onChange={e => handleMedicineChange(index, 'name', e.target.value)} />
                                    <input type="text" placeholder="Strength/Form (e.g. 500mg Tab)" className="w-1/5 p-2 bg-slate-50 border rounded-lg text-sm" value={med.strengthForm} onChange={e => handleMedicineChange(index, 'strengthForm', e.target.value)} />
                                    <input type="text" placeholder="Freq (1-0-1)" className="w-24 p-2 bg-slate-50 border rounded-lg text-sm" value={med.frequency} onChange={e => handleMedicineChange(index, 'frequency', e.target.value)} />
                                    <input type="text" placeholder="Days" className="w-20 p-2 bg-slate-50 border rounded-lg text-sm" value={med.days} onChange={e => handleMedicineChange(index, 'days', e.target.value)} />
                                    <select className="p-2 bg-slate-50 border rounded-lg text-sm outline-none text-slate-600" value={med.route} onChange={e => handleMedicineChange(index, 'route', e.target.value)}>
                                        <option>Oral</option><option>IV</option><option>Topical</option><option>Drops</option>
                                    </select>
                                    <input type="text" placeholder="Instructions" className="flex-1 p-2 bg-slate-50 border rounded-lg text-sm" value={med.instructions} onChange={e => handleMedicineChange(index, 'instructions', e.target.value)} />
                                    <button type="button" onClick={() => setMedicines(medicines.filter((_, i) => i !== index))} className="p-2 text-slate-400 hover:text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 4: Follow Up & Signature */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Advice</label><input type="text" className="w-full p-3 bg-slate-50 border rounded-xl text-sm" value={advice} onChange={e => setAdvice(e.target.value)} /></div>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Follow-up Date</label><input type="date" className="w-full p-3 bg-slate-50 border rounded-xl text-sm" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} min={new Date().toISOString().split("T")[0]} /></div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2"><label className="block text-xs font-bold text-slate-500 uppercase">Signature <span className="text-red-500">*</span></label><button type="button" onClick={() => sigCanvas.current.clear()} className="text-xs text-red-400">Clear</button></div>
                            <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 relative cursor-crosshair">
                                <SignatureCanvas ref={sigCanvas} penColor="#0f172a" canvasProps={{ className: 'w-full h-32' }} />
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 font-medium text-slate-600 hover:bg-slate-200 rounded-xl">Cancel</button>
                    <button onClick={handleSubmit} disabled={loading} className="px-6 py-2.5 bg-[#5747e6] text-white font-bold rounded-xl flex items-center gap-2">{loading ? "Encrypting..." : <><CheckCircle className="w-4 h-4" /> Issue Secured Rx</>}</button>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionModal;
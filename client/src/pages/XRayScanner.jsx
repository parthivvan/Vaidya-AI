import React, { useState, useRef } from 'react';
import {
    Activity, Search, ChevronRight, Upload,
    ZoomIn, ZoomOut, SunMedium, AlertTriangle, CheckCircle,
    User, Image as ImageIcon, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

// 🟢 FIXED: Added { patient } as a prop here so the component knows who we are scanning!
const XRayScanner = ({ patient }) => {
    // --- STATE ---
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    // --- HANDLERS ---
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            return toast.error("Please upload a valid image file (JPEG/PNG)");
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setAiResult(null);
    };

    const analyzeXRay = async () => {
        if (!selectedFile) return toast.error("Please select an X-Ray first.");

        setIsAnalyzing(true);
        const toastId = toast.loading("Connecting to Python AI Core...");

        const formData = new FormData();
        formData.append("xray", selectedFile);

        try {
            const res = await fetch("http://localhost:5001/api/vision/analyze", {
                method: "POST",
                body: formData,
            });

            const responseData = await res.json();

            if (res.ok) {
                toast.success("Analysis Complete", { id: toastId });
                setAiResult(responseData.data);
            } else {
                toast.error(responseData.message || "Analysis Failed", { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to reach AI Server", { id: toastId });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const finalizeReport = async () => {
        if (!aiResult) return;
        setIsSaving(true);
        const toastId = toast.loading("Saving securely to Vaidya Database...");

        try {
            const res = await fetch("http://localhost:5001/api/vision/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prediction: aiResult.prediction,
                    confidence: aiResult.confidence,
                    patientId: patient?._id || null // 🟢 FIXED: Now saves the patient ID to MongoDB!
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Report Finalized!", { id: toastId });
                console.log("💾 Saved Report DB Record:", data.report);
                resetScanner(); // Automatically clear scanner after successful save
            } else {
                toast.error(data.message, { id: toastId });
            }
        } catch (error) {
            toast.error("Database connection error.", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const resetScanner = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setAiResult(null);
    };

    // --- DYNAMIC UI HELPERS ---
    const isNormal = aiResult?.prediction?.toUpperCase() === "NORMAL";
    const confidencePercentage = aiResult ? (aiResult.confidence * 100).toFixed(1) : 0;

    return (
        <div className="w-full flex flex-col font-sans">
            <div className="flex justify-end mb-4">
                <div className="flex items-center gap-3">
                    {previewUrl && (
                        <button onClick={resetScanner} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                            Clear Scanner
                        </button>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#5747e6] rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                        <Upload className="w-4 h-4" />
                        {previewUrl ? 'Change X-Ray' : 'Upload X-Ray'}
                    </button>
                </div>
            </div>

            {/* SPLIT VIEW LAYOUT */}
            <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[500px]">

                {/* LEFT PANEL: VISUAL SCANNER */}
                <section className="flex-1 relative group overflow-hidden bg-slate-900 rounded-3xl shadow-xl shadow-indigo-900/10 border border-slate-800 flex flex-col min-h-[400px]">
                    <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start">
                        <div className="bg-black/40 backdrop-blur-md rounded-lg px-3 py-1.5 flex items-center gap-2 border border-white/10 text-white/80">
                            <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-amber-400 animate-pulse' : aiResult ? 'bg-emerald-400' : 'bg-slate-400'}`}></div>
                            <span className="text-xs font-bold tracking-wide uppercase">
                                {isAnalyzing ? 'Analyzing...' : aiResult ? 'Analysis Complete' : 'Awaiting Image'}
                            </span>
                        </div>
                        {previewUrl && (
                            <div className="flex flex-col gap-2">
                                <button className="w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-white/10 transition-colors"><ZoomIn className="w-5 h-5" /></button>
                                <button className="w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-white/10 transition-colors"><ZoomOut className="w-5 h-5" /></button>
                                <button className="w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-white/10 transition-colors"><SunMedium className="w-5 h-5" /></button>
                            </div>
                        )}
                    </div>

                    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
                        {previewUrl ? (
                            <>
                                <img src={previewUrl} alt="X-Ray Scan" className="w-full h-full object-contain opacity-80 mix-blend-screen p-4" />
                                {isAnalyzing && (
                                    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                                        <div className="absolute left-0 right-0 h-1 bg-[#5747e6]/80 shadow-[0_0_20px_rgba(87,71,230,0.8)] animate-scan">
                                            <div className="absolute top-0 right-0 -mt-2 text-[#5747e6] text-[10px] font-mono px-2 bg-[#5747e6]/10 backdrop-blur-sm border border-[#5747e6]/30 rounded-l font-bold">
                                                SCANNING...
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                                    <ImageIcon className="w-10 h-10 text-slate-500" />
                                </div>
                                <p className="text-slate-400 font-medium">No X-Ray Selected</p>
                                <p className="text-slate-600 text-sm mt-1">Upload a DICOM, JPEG, or PNG to begin analysis.</p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                        <div className="absolute inset-0 border-[1px] border-white/5 m-8 rounded-2xl pointer-events-none"></div>
                    </div>
                </section>

                {/* RIGHT PANEL: CLINICAL RESULTS */}
                <section className="lg:w-[400px] xl:w-[480px] w-full flex flex-col gap-6">
                    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex-1 flex flex-col gap-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">AI Findings</h2>
                                <p className="text-slate-500 text-sm mt-1 font-medium">Vaidya Vision Core</p>
                            </div>
                            {aiResult && (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${isNormal ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    {isNormal ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                    {isNormal ? 'Clear Scan' : 'Abnormality Detected'}
                                </span>
                            )}
                        </div>

                        {previewUrl && !aiResult && !isAnalyzing && (
                            <button onClick={analyzeXRay} className="w-full py-4 bg-gradient-to-r from-[#5747e6] to-indigo-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-200 transition-all flex justify-center items-center gap-2">
                                <Activity className="w-5 h-5" /> Run PyTorch Diagnostics
                            </button>
                        )}

                        {isAnalyzing && (
                            <div className="flex flex-col items-center justify-center p-10 text-slate-500 gap-4 bg-white/50 rounded-2xl border border-slate-100">
                                <Loader2 className="w-10 h-10 animate-spin text-[#5747e6]" />
                                <p className="font-bold text-sm">Processing Neural Network Tensors...</p>
                            </div>
                        )}

                        {aiResult && (
                            <>
                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Prediction</span>
                                        <span className={`text-2xl font-bold font-display ${isNormal ? 'text-emerald-600' : 'text-red-600'}`}>{confidencePercentage}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ${isNormal ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${confidencePercentage}%` }}></div>
                                    </div>
                                    <p className="text-xs font-bold text-slate-700 mt-4 flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-200 uppercase tracking-wide">
                                        {isNormal ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
                                        {aiResult.prediction}
                                    </p>
                                </div>

                                <div className="mt-auto bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <p className="text-xs text-amber-700 font-medium flex gap-2">
                                        <Activity className="w-4 h-4 flex-shrink-0" />
                                        {aiResult.disclaimer}
                                    </p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                                    <button
                                        onClick={resetScanner}
                                        className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-[#5747e6] bg-[#5747e6]/10 rounded-xl hover:bg-[#5747e6]/20 transition-colors">
                                        Discard
                                    </button>
                                    <button
                                        onClick={finalizeReport}
                                        disabled={isSaving}
                                        className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-[#5747e6] rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50">
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                        {isSaving ? 'Saving...' : 'Finalize Report'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* 🟢 DYNAMIC PATIENT CONTEXT PANEL */}
                    <div className={`rounded-2xl p-5 border shadow-sm flex items-center gap-4 ${patient ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-slate-200'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${patient ? 'bg-[#5747e6] text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <User className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            {patient ? (
                                <>
                                    <h3 className="text-sm font-bold text-slate-900">{patient.fullName || patient.name || "Unknown Patient"}</h3>
                                    <p className="text-xs text-[#5747e6] font-bold mt-0.5">ID: {patient._id ? patient._id.substring(0, 8).toUpperCase() : "N/A"}</p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-sm font-bold text-slate-900">Patient Data Unlinked</h3>
                                    <p className="text-xs text-slate-500">Scan will be saved anonymously.</p>
                                </>
                            )}
                        </div>
                    </div>

                </section>
            </div>
        </div>
    );
};

export default XRayScanner;
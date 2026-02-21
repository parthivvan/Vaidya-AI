import React from 'react';
import { Activity, ShieldCheck, Loader2 } from 'lucide-react';

const AuthLoader = ({ message = "Verifying Secure Credentials..." }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#100e1b]/90 backdrop-blur-md font-sans">

            {/* Background Glowing Orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#5747e6]/20 blur-[100px] rounded-full"></div>

            <div className="relative z-10 flex flex-col items-center">

                {/* Animated Icon Container */}
                <div className="relative mb-8">
                    {/* Outer spinning ring */}
                    <div className="absolute inset-0 border-t-2 border-l-2 border-[#5747e6] rounded-full w-24 h-24 -ml-4 -mt-4 animate-[spin_3s_linear_infinite] opacity-50"></div>
                    {/* Inner pulsing ring */}
                    <div className="absolute inset-0 border-b-2 border-r-2 border-emerald-400 rounded-full w-20 h-20 -ml-2 -mt-2 animate-[spin_2s_linear_infinite_reverse] opacity-50"></div>

                    {/* Center Logo/Icon */}
                    <div className="w-16 h-16 bg-[#171527] rounded-2xl border border-gray-800 shadow-[0_0_30px_rgba(87,71,230,0.3)] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#5747e6]/20 to-transparent"></div>
                        <Activity className="w-8 h-8 text-[#5747e6] animate-pulse relative z-10" />
                    </div>
                </div>

                {/* Text Details */}
                <h2 className="text-2xl font-bold text-white font-display mb-2 tracking-tight flex items-center gap-2">
                    MediFlow <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5747e6] to-purple-400">AI</span>
                </h2>

                <div className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                    <Loader2 className="w-4 h-4 animate-spin text-[#5747e6]" />
                    <span className="animate-pulse">{message}</span>
                </div>

                {/* Fake Progress Bar for UI feel */}
                <div className="w-48 h-1 bg-gray-800 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#5747e6] to-emerald-400 w-1/2 rounded-full animate-[pulse_1.5s_ease-in-out_infinite] relative">
                        <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-[translateX_1s_linear_infinite]"></div>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-2 text-xs text-emerald-500 font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" /> End-to-End Encrypted
                </div>

            </div>
        </div>
    );
};

export default AuthLoader;
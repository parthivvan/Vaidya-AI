import React from 'react';
import { motion } from 'framer-motion';
import {
    Stethoscope, Brain, ShieldCheck, Layers,
    Mail, Share2, Code2, Lock, MessageSquare,
    Shield, Network, Droplets
} from 'lucide-react';

const CreativeFooter = () => {
    // Framer Motion Variants for Staggered Scroll Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", bounce: 0.4, duration: 0.8 }
        }
    };

    return (
        <div className="text-slate-900 font-sans overflow-x-hidden bg-gradient-to-b from-indigo-50 to-white min-h-screen flex flex-col justify-between relative">

            {/* 🌟 Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-300/20 blur-[100px]"></div>
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-200/20 blur-[100px]"></div>
            </div>

            <section className="relative py-20 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto flex flex-col justify-center flex-1 z-10">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 text-center mb-20 max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest">
                        The Minds Behind MediFlow
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight font-display">
                        Architects of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Intelligent Care</span>
                    </h2>
                    <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
                        Combining deep medical expertise with cutting-edge AI to deliver the future of healthcare diagnostics.
                    </p>
                </motion.div>

                {/* 👨‍💻 Team Cards Grid (Scroll Triggered) */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {/* Card 1: Medical Officer */}
                    <motion.div variants={cardVariants} className="bg-white/65 backdrop-blur-lg border border-white/80 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_12px_40px_0_rgba(79,70,229,0.15)] hover:-translate-y-2 hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative mb-6 transform transition-transform duration-300 group-hover:scale-105">
                            <div className="w-32 h-32 rounded-full p-1 bg-white shadow-sm ring-1 ring-indigo-50">
                                <img alt="Mahesh Parimalla" className="w-full h-full rounded-full object-cover" src="https://ui-avatars.com/api/?name=Mahesh+Parimalla&background=e0e7ff&color=4f46e5&size=128" />
                            </div>
                            <div className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-600">
                                <Layers className="w-4 h-4" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">Mahesh Parimalla</h3>
                        <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-4">Front End Developer</span>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 opacity-80">Architecting immersive user experiences with cutting-edge React patterns and pixel-perfect design.</p>
                        <div className="mt-auto flex space-x-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            <button className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"><Mail className="w-4 h-4" /></button>
                            <button className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"><Share2 className="w-4 h-4" /></button>
                        </div>
                    </motion.div>

                    {/* Card 2: Lead Architect */}
                    <motion.div variants={cardVariants} className="bg-white/65 backdrop-blur-lg border border-white/80 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_12px_40px_0_rgba(79,70,229,0.15)] hover:-translate-y-2 hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative mb-6 transform transition-transform duration-300 group-hover:scale-105">
                            <div className="w-32 h-32 rounded-full p-1 bg-white shadow-sm ring-1 ring-indigo-50 relative">
                                <img alt="Solomon Pattapu" className="w-full h-full rounded-full object-cover" src="https://ui-avatars.com/api/?name=Solomon+Pattapu&background=4f46e5&color=ffffff&size=128" />
                                {/* Online Dot */}
                                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full"><div className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div></div>
                            </div>
                            <div className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-600 z-10">
                                <Brain className="w-4 h-4" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">Solomon Pattapu</h3>
                        <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-4">AI Developer</span>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 opacity-80">Developing intelligent diagnostic models and ensuring seamless integration of AI diagnostics.</p>
                        <div className="mt-auto flex space-x-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            <button className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"><Code2 className="w-4 h-4" /></button>
                            <button className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"><Mail className="w-4 h-4" /></button>
                        </div>
                    </motion.div>

                    {/* Card 3: Security */}
                    <motion.div variants={cardVariants} className="bg-white/65 backdrop-blur-lg border border-white/80 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_12px_40px_0_rgba(79,70,229,0.15)] hover:-translate-y-2 hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative mb-6 transform transition-transform duration-300 group-hover:scale-105">
                            <div className="w-32 h-32 rounded-full p-1 bg-white shadow-sm ring-1 ring-indigo-50">
                                <img alt="Ram Charan" className="w-full h-full rounded-full object-cover" src="https://ui-avatars.com/api/?name=Ram+Charan&background=e0e7ff&color=4f46e5&size=128" />
                            </div>
                            <div className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-600">
                                <Code2 className="w-4 h-4" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">Ram Charan</h3>
                        <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-4">Backend Developer</span>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 opacity-80">Architecting robust, scalable server infrastructure and secure API ecosystems.</p>
                        <div className="mt-auto flex space-x-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            <button className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"><Mail className="w-4 h-4" /></button>
                            <button className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"><Lock className="w-4 h-4" /></button>
                        </div>
                    </motion.div>

                    {/* Card 4: Product */}
                    <motion.div variants={cardVariants} className="bg-white/65 backdrop-blur-lg border border-white/80 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_12px_40px_0_rgba(79,70,229,0.15)] hover:-translate-y-2 hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative mb-6 transform transition-transform duration-300 group-hover:scale-105">
                            <div className="w-32 h-32 rounded-full p-1 bg-white shadow-sm ring-1 ring-indigo-50">
                                <img alt="Lakshmi Putra" className="w-full h-full rounded-full object-cover" src="https://ui-avatars.com/api/?name=Lakshmi+Putra&background=e0e7ff&color=4f46e5&size=128" />
                            </div>
                            <div className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-600">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">Lakshmi Putra</h3>
                        <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-4">QA & DevOps Lead</span>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 opacity-80">Ensuring product excellence through rigorous testing, detailed documentation, and source control mastery.</p>
                        <div className="mt-auto flex space-x-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            <button className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"><Mail className="w-4 h-4" /></button>
                            <button className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /></button>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Badges Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="relative z-10 mt-20 flex justify-center w-full"
                >
                    <div className="inline-flex flex-wrap justify-center items-center gap-6 px-8 py-4 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-sm">
                        <div className="flex items-center space-x-2"><Shield className="w-4 h-4 text-indigo-600" /><span className="text-xs font-bold text-slate-600 uppercase tracking-wide">HIPAA Compliant</span></div>
                        <div className="w-px h-4 bg-indigo-200 hidden sm:block"></div>
                        <div className="flex items-center space-x-2"><ShieldCheck className="w-4 h-4 text-indigo-600" /><span className="text-xs font-bold text-slate-600 uppercase tracking-wide">SOC2 Certified</span></div>
                        <div className="w-px h-4 bg-indigo-200 hidden sm:block"></div>
                        <div className="flex items-center space-x-2"><Network className="w-4 h-4 text-indigo-600" /><span className="text-xs font-bold text-slate-600 uppercase tracking-wide">End-to-End Encryption</span></div>
                    </div>
                </motion.div>

            </section>

            {/* Bottom Legal Footer */}
            <footer className="border-t border-indigo-100 bg-white/80 backdrop-blur-sm relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                            <Droplets className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold text-slate-900 tracking-tight">MediFlow AI</span>
                    </div>
                    <div className="flex space-x-8 text-sm text-slate-600 font-medium">
                        <a className="hover:text-indigo-600 transition-colors" href="#">Privacy</a>
                        <a className="hover:text-indigo-600 transition-colors" href="#">Terms</a>
                        <a className="hover:text-indigo-600 transition-colors" href="#">Support</a>
                    </div>
                    <div className="mt-4 md:mt-0 text-xs text-slate-400 font-medium">
                        © {new Date().getFullYear()} MediFlow AI Inc.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CreativeFooter;
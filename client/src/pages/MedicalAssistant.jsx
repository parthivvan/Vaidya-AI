import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Upload, 
  FileText, 
  Bot, 
  User, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  BrainCircuit,
  Stethoscope
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function MedicalAssistant() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isAsking]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a PDF file first!");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Assuming the backend is running on localhost:8000 based on previous context
      const response = await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data) {
        toast.success("Medical report processed successfully!");
        setChatHistory(prev => [...prev, {
          role: 'system',
          content: `Report "${file.name}" uploaded and analyzed. You can now ask questions about it.`
        }]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(error.response?.data?.detail || "Failed to upload report. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQuestion = question.trim();
    setQuestion("");
    
    // Add user question to chat
    setChatHistory(prev => [...prev, { role: "user", content: userQuestion }]);
    setIsAsking(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/query", { 
        question: userQuestion 
      });

      if (response.data) {
        setChatHistory(prev => [
          ...prev, 
          { 
            role: "ai", 
            content: response.data.answer || response.data.response, // adjusting based on potential backend response structure
            route: response.data.route_taken 
          }
        ]);
      }
    } catch (error) {
      console.error("Query failed:", error);
      toast.error(error.response?.data?.detail || "Failed to get an answer. Please check if the report is uploaded.");
      setChatHistory(prev => [...prev, { 
        role: "error", 
        content: "I encountered an error trying to answer that. Please ensure you've uploaded a report first." 
      }]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BrainCircuit className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">MediFlow AI Assistant</h1>
              <p className="text-gray-500 text-sm">Upload your medical reports and ask questions</p>
            </div>
          </div>

          {/* Upload Section */}
          <form onSubmit={handleFileUpload} className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
            <label className="cursor-pointer">
              <input 
                type="file" 
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${file ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-200 text-gray-600'}`}>
                {file ? <FileText className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                <span className="text-sm font-medium truncate max-w-[150px]">
                  {file ? file.name : "Select PDF Report"}
                </span>
              </div>
            </label>
            <button 
              type="submit" 
              disabled={!file || isUploading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isUploading ? "Analyzing..." : "Analyze"}
            </button>
          </form>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden min-h-[500px]">
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-4">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-600">No messages yet</h3>
                  <p className="text-sm">Upload a medical report to start analyzing your health data.</p>
                </div>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "user" ? "bg-blue-600" : 
                      msg.role === "system" ? "bg-green-600" :
                      msg.role === "error" ? "bg-red-500" : "bg-teal-600"
                    }`}>
                      {msg.role === "user" ? <User className="w-5 h-5 text-white" /> : 
                       msg.role === "system" ? <CheckCircle2 className="w-5 h-5 text-white" /> :
                       msg.role === "error" ? <AlertCircle className="w-5 h-5 text-white" /> :
                       <Bot className="w-5 h-5 text-white" />}
                    </div>

                    {/* Message Bubble */}
                    <div className={`p-4 rounded-2xl shadow-sm ${
                      msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : 
                      msg.role === "system" ? "bg-green-50 text-green-800 border border-green-100" :
                      msg.role === "error" ? "bg-red-50 text-red-800 border border-red-100" :
                      "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                    }`}>
                      {msg.role === "ai" && (
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-100 uppercase tracking-wider">
                            {msg.route || "General"} Analysis
                          </span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            {isAsking && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleAskQuestion} className="flex gap-3 relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about your lab report, symptoms, or general health..."
                disabled={isAsking}
                className="flex-1 p-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              />
              <button 
                type="submit" 
                disabled={!question.trim() || isAsking}
                className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                {isAsking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

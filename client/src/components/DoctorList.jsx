import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const DoctorList = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSlot, setBookingSlot] = useState("");
  
  // Booked Slots State
  const [bookedSlots, setBookedSlots] = useState([]); 
  const [loadingSlots, setLoadingSlots] = useState(false);

  // 1. Fetch Doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/doctors");
        const data = await res.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // 2. Fetch Booked Slots (With Debug Log)
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDoctor || !bookingDate) return;

      setLoadingSlots(true);
      try {
        console.log(`Checking slots for: ${bookingDate}`); // DEBUG
        const res = await fetch(
          `http://localhost:5001/api/appointments/booked-slots?doctorId=${selectedDoctor._id}&date=${bookingDate}`
        );
        const takenSlots = await res.json();
        
        console.log("🔥 Booked Slots from DB:", takenSlots); // DEBUG
        setBookedSlots(takenSlots);
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [bookingDate, selectedDoctor]);

  // Handle Book
  const handleBook = async (e) => {
    e.preventDefault();
    if (!bookingDate || !bookingSlot) return toast.error("Please select date and time");

    try {
      const res = await fetch("http://localhost:5001/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: user.id,
          doctorId: selectedDoctor._id,
          date: bookingDate,
          timeSlot: bookingSlot,
          reason: "General Checkup"
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Appointment Confirmed!");
        setSelectedDoctor(null);
        setBookingDate("");
        setBookingSlot("");
        setBookedSlots([]); 
      } else {
        toast.error(data.message || "Booking Failed");
      }
    } catch (error) {
      toast.error("Server Error");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <>
      {/* Doctor List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div key={doc._id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold text-xl">
                 {doc.userId?.fullName?.charAt(0)}
               </div>
               <div>
                 <h3 className="font-bold text-slate-900">{doc.userId?.fullName}</h3>
                 <p className="text-sm text-primary">{doc.specialization}</p>
               </div>
            </div>
            <div className="text-sm text-slate-600 mb-6 space-y-1">
               <p>Experience: {doc.experience} Years</p>
               <p>Fee: ${doc.consultationFee}</p>
            </div>
            <button 
              onClick={() => setSelectedDoctor(doc)}
              className="w-full py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">Book with Dr. {selectedDoctor.userId?.fullName}</h3>
            
            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Date</label>
                <input 
                  type="date" 
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-2 border rounded-lg"
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Time Slot</label>
                
                

                {loadingSlots ? (
                  <p className="text-xs text-slate-400">Checking availability...</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {selectedDoctor.availableSlots.map(slot => {
                      const isTaken = bookedSlots.includes(slot);
                      
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isTaken}
                          onClick={() => setBookingSlot(slot)}
                          className={`
                            text-sm py-2 px-1 rounded border font-medium transition-all duration-200
                            ${isTaken 
                              ? "bg-red-100 border-red-200 text-red-400 cursor-not-allowed opacity-60 line-through" // 🔴 FORCED RED
                              : bookingSlot === slot 
                                ? "bg-primary text-white border-primary shadow-md transform scale-105" // 🔵 SELECTED
                                : "bg-white border-slate-200 hover:border-primary text-slate-600 hover:bg-indigo-50" // ⚪ NORMAL
                            }
                          `}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => {
                    setSelectedDoctor(null);
                    setBookedSlots([]);
                    setBookingDate("");
                  }}
                  className="flex-1 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!bookingSlot}
                  className="flex-1 py-2 bg-primary text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorList;
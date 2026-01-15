import React, { useState, useEffect } from "react";
import { Calendar, Clock, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../libs/axios";

const AppointmentModal = ({ isOpen, onClose, doctor, user }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  const { _id: doctorId } = doctor;
  const userToken = localStorage.getItem("usertoken");

  // Fetch doctor's schedule when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDoctorSchedule();
    }
  }, [isOpen]);

  const fetchDoctorSchedule = async () => {
    setIsFetchingSlots(true);
    try {
      const response = await axiosInstance.get(
        `/api/v1/getSchedule/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      console.log("Schedule Response:", response.data);

      if (
        response.data?.status === "Success" &&
        Array.isArray(response.data.data)
      ) {
        // Filter enabled days and their slots
        const availableDays = response.data.data.filter(
          (schedule) => schedule.enabled && schedule.slots?.length > 0
        );
        setAvailableSlots(availableDays);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast.error("Failed to fetch available slots");
    } finally {
      setIsFetchingSlots(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !selectedDate) {
      toast.error("Please select both a date and time slot");
      return;
    }

    setIsLoading(true);
    try {
      const formattedDate = selectedDate;
      const startDateTime = selectedSlot.start;
      const endDateTime = selectedSlot.end;

      console.log("Submitting appointment data:", {
        doctorId,
        date: formattedDate,
        startTime: startDateTime,
        endTime: endDateTime,
      });

      const response = await axiosInstance.post(
        "/api/v1/appoint/book",
        {
          doctorId,
          date: formattedDate,
          startTime: startDateTime,
          endTime: endDateTime,
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      if (response.data?.appointment) {
        // Only close and show success if we got an appointment back
        toast.success("Appointment Request Raised Successfully!");
        onClose();
      } else {
        toast.error("Something went wrong while booking");
      }
    } catch (error) {
      console.error("Booking error:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 backdrop-blur-md bg-white/30 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Book Appointment
            </h2>
            <p className="text-sm text-gray-500 mt-1">with Dr. {doctor.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Available Slots Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Available Time Slots
            </h3>

            {isFetchingSlots ? (
              <div className="text-center py-4">
                <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-gray-500">Loading available slots...</p>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2">
                {availableSlots.map((schedule) => (
                  <div key={schedule.day} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      {schedule.day}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {schedule.slots.map((slot, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            setSelectedSlot({ ...slot, day: schedule.day })
                          }
                          className={`p-3 rounded-lg text-sm font-medium transition-all cursor-pointer hover:scale-[1.02] ${
                            selectedSlot &&
                            selectedSlot.start === slot.start &&
                            selectedSlot.end === slot.end &&
                            selectedSlot.day === schedule.day
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {slot.start} - {slot.end}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No slots available</p>
              </div>
            )}
          </div>

          {/* Date Selection - Only shown when a slot is selected */}
          {selectedSlot && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Select Date
              </h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !selectedSlot || !selectedDate}
            className={`w-full flex items-center justify-center cursor-pointer gap-2 px-4 py-3 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
              isLoading || !selectedSlot || !selectedDate
                ? "opacity-75 cursor-not-allowed"
                : "transform hover:-translate-y-0.5"
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Booking...</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AppointmentModal;

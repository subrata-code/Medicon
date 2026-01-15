// src/components/AppointmentsSection.jsx
import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  MessageSquare,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
} from "lucide-react";
import axiosInstance from "../libs/axios";
import toast from "react-hot-toast";
import Image from "./Image";
import ReviewModal from "./ReviewModal";

const AppointmentsSection = ({ userToken }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (userToken) {
      getAppointments();
    }
  }, [userToken]);

  const getAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/appointments", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        withCredentials: true,
      });

      if (response.data?.data) {
        setAppointments(response.data.data);
      } else {
        toast.error("No appointments found!");
      }
    } catch (error) {
      toast.error("Something went wrong in loading appointments!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppointmentUpdate = (updatedAppointment) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app._id === updatedAppointment._id ? updatedAppointment : app
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredAppointments = appointments
    .filter((appointment) => {
      const matchesSearch =
        appointment.doctorId.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.doctorId.specialization
          .join(", ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || appointment.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleRefresh = () => {
    try {
      getAppointments();
      toast.success("Refreshed appointments");
    } catch (error) {
      toast.error("Failed to refresh! Try Later");
    }
  };

  const handleReviewClick = (doctor, appointment) => {
    setSelectedDoctor(doctor);
    setSelectedAppointment(appointment);
    setShowReviewModal(true);
  };

  const handleReviewSubmit = () => {
    setShowReviewModal(false);
    getAppointments(); // Refresh appointments after review
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
          <h2 className="text-xl font-semibold">Your Appointments</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="w-full cursor-pointer sm:w-auto p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`text-gray-600 ${isLoading ? "animate-spin" : ""}`}
                size={20}
              />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className="relative mb-2 h-24 w-24 rounded-full border-4 border-blue-600 shadow-lg overflow-hidden bg-white group-hover:border-blue-100 transition-colors duration-300">
                  <Image
                    pic={appointment.doctorId.profilepic}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    {appointment.doctorId.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {appointment.doctorId.specialization.join(", ")}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {new Date(appointment.date).toLocaleDateString()}
                    </span>
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {appointment.startTime} - {appointment.endTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2 mt-4 sm:mt-0">
                <div
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {getStatusIcon(appointment.status)}
                  <span className="text-sm font-medium capitalize">
                    {appointment.status}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {appointment.type === "Video Call" && (
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <Video className="w-5 h-5 text-blue-500" />
                    </button>
                  )}
                  {appointment.status === "confirmed" &&
                    !appointment.review && (
                      <button
                        onClick={() =>
                          handleReviewClick(appointment.doctorId, appointment)
                        }
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        <Star className="w-5 h-5" />
                        <span>Leave a Review</span>
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No appointments found</p>
          </div>
        )}
      </div>

      {showReviewModal && selectedDoctor && selectedAppointment && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          doctor={selectedDoctor}
          appointmentId={selectedAppointment._id}
          onReviewSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default AppointmentsSection;
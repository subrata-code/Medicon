import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Video,
} from "lucide-react";
import axiosInstance from "../libs/axios";
import { toast } from "react-hot-toast";

const AppointmentList = ({ doctorId, Token }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (doctorId && Token) {
      getAppointments();
    }
  }, [doctorId, Token]);

  const getAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/v1/get-appointments-doctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      setAppointments(response.data.appointments);
      console.log("Appointments API : ", response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleVideocall = async (appointmentId, doctorId, userId) => {
    try {
      // console.log("Appointment Id: ", appointmentId);
      // console.log("Doctor Id: ", doctorId);
      const response = await axiosInstance.post("/api/v1/video-call/request", {
        appointmentId,
        doctorId,
      });

      if (response.data) {
        toast.success("VideoCall link send to email successfully");
        navigate(`/videocall/${appointmentId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Problem generating appointment link");
    }
  };

  const handleRefresh = () => {
    try {
      getAppointments();
      toast.success("Refreshed Upcoming Appointments");
    } catch (error) {
      toast.error("Failed to refresh! Try Later");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Your Appointments
        </h2>
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

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Patient Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" />
                      <h3 className="font-medium text-gray-800">
                        {appointment.userId?.name}
                      </h3>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {getStatusIcon(appointment.status)}
                      <span className="capitalize">{appointment.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{appointment.userId?.phonenumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{appointment.userId?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="flex flex-row-reverse gap-2 text-sm">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(appointment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        {appointment.startTime} - {appointment.endTime}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleVideocall(
                        appointment._id,
                        appointment.doctorId,
                        appointment.userId
                      )
                    }
                    className="bg-blue-100 p-2 rounded-lg cursor-pointer border-none hover:bg-blue-200"
                  >
                    <span className="text-blue-500">
                      <Video className="w-6 h-6" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No appointments found</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;

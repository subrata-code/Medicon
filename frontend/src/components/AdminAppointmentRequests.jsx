// src/components/AdminAppointmentRequests.jsx
import React, { useState, useEffect } from "react";
import { axiosInstance } from "../libs/axios";
import { toast } from "react-hot-toast";

const AdminAppointmentRequests = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const admintoken = localStorage.getItem("admintoken");

  useEffect(() => {
    if (admintoken) {
      fetchAppointments();
    }
  }, [admintoken]);

  const updateAppointmentStatus = async (appointmentId, status) => {
    setUpdating(true);
    try {
      const response = await axiosInstance.post(
        `/api/v1/appointments/${appointmentId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${admintoken}`,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Appointment status updated successfully");
        fetchAppointments();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update appointment status");
    } finally {
      setUpdating(false);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/get-all-appointments", {
        headers: {
          Authorization: `Bearer ${admintoken}`,
        },
      });
      setAppointments(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Pending Appointments
        </h1>

        {appointments.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-lg text-gray-600">
              No pending appointments found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="pr-3">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {appointment.userId?.name}
                      </h3>
                      <p className="text-sm mb-2 text-gray-500">
                        {appointment.userId?.email}
                      </p>
                      <span
                        className={`px-1 py-1 rounded-sm  text-sm font-medium whitespace-nowrap ${
                          appointment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 block mb-1">
                          Doctor:
                        </span>
                        <p className="text-gray-900 font-medium">
                          {appointment.doctorId?.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">
                          Specialization:
                        </span>
                        <p className="text-gray-900 font-medium truncate">
                          {appointment.doctorId?.specialization}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">Date:</span>
                        <p className="text-gray-900 font-medium">
                          {new Date(appointment.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">Time:</span>
                        <p className="text-gray-900 font-medium">
                          {appointment.startTime} - {appointment.endTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() =>
                        updateAppointmentStatus(appointment._id, "confirmed")
                      }
                      disabled={updating}
                      className="flex-1 cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50"
                    >
                      {updating ? "Updating..." : "Confirm"}
                    </button>
                    <button
                      onClick={() =>
                        updateAppointmentStatus(appointment._id, "cancelled")
                      }
                      disabled={updating}
                      className="flex-1 cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50"
                    >
                      {updating ? "Updating..." : "Cancel"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointmentRequests;

// src/pages/AdminDashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminDoctorVerification from "../components/AdminDoctorVerification";
import AdminAppointmentRequests from "../components/AdminAppointmentRequests";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/loginDashboard");
    }
  }, [navigate]);

  const handleClearDemoData = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("demoDataUpdated"));
    navigate("/loginDashboard");
  };

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-500 mb-6">
          Admin Dashboard
        </h1>
        <div className="mb-4">
          <button
            onClick={handleClearDemoData}
            className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Clear Demo Data
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doctor Verification Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-500 mb-4">
              Doctor Verification
            </h2>
            <AdminDoctorVerification />
          </div>

          {/* Appointment Requests Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-500 mb-4">
              Appointment Requests
            </h2>
            <AdminAppointmentRequests />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

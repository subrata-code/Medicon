// src/components/AdminDoctorVerification.jsx
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Image from "./Image";

const AdminDoctorVerification = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPending = useCallback(() => {
    const pending = JSON.parse(localStorage.getItem("doctorRequests")) || [];
    setDoctors(pending);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPending();
    const id = setInterval(() => {
      loadPending();
    }, 2500);
    return () => clearInterval(id);
  }, [loadPending]);

  useEffect(() => {
    const onUpdate = () => loadPending();
    window.addEventListener("demoDataUpdated", onUpdate);
    return () => window.removeEventListener("demoDataUpdated", onUpdate);
  }, [loadPending]);

  const handleApprove = (doctor) => {
    const requests = JSON.parse(localStorage.getItem("doctorRequests")) || [];
    const nextRequests = requests.filter((d) => d.id !== doctor.id);
    const approved = JSON.parse(localStorage.getItem("approvedDoctors")) || [];
    const approvedEntry = {
      ...doctor,
      status: "approved",
      profilepic:
        doctor.profilepic ||
        "https://randomuser.me/api/portraits/men/32.jpg",
    };
    approved.push(approvedEntry);
    localStorage.setItem("doctorRequests", JSON.stringify(nextRequests));
    localStorage.setItem("approvedDoctors", JSON.stringify(approved));
    loadPending();
    window.dispatchEvent(new Event("demoDataUpdated"));
    alert("Approved Successfully");
    toast.success("Doctor approved");
  };

  const handleReject = (doctorId) => {
    const requests = JSON.parse(localStorage.getItem("doctorRequests")) || [];
    const nextRequests = requests.filter((d) => d.id !== doctorId);
    localStorage.setItem("doctorRequests", JSON.stringify(nextRequests));
    loadPending();
    window.dispatchEvent(new Event("demoDataUpdated"));
    toast.success("Request removed");
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="space-y-4">
      {doctors.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No pending doctor requests.
        </p>
      ) : (
        doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex justify-center items-center gap-4">
              <div className="relative mb-2 h-24 w-24 rounded-full border-4 border-blue-600 shadow-lg overflow-hidden bg-white group-hover:border-blue-100 transition-colors duration-300">
                <Image
                  pic={
                    doctor.profilepic ||
                    "https://randomuser.me/api/portraits/men/32.jpg"
                  }
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">{doctor.name}</h3>
                <p className="text-sm text-gray-600 font-bold">
                  {Array.isArray(doctor.specialization)
                    ? doctor.specialization.join(", ")
                    : doctor.specialization}
                </p>
                <p className="text-sm font-semibold text-gray-600">
                  Registration ID: {doctor.registrationId}
                </p>
                <p className="text-sm text-gray-600 text-clip w-5/6">
                  Address: {doctor.address}
                </p>
                <p className="text-sm text-gray-500">{doctor.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(doctor)}
                className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(doctor.id)}
                className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDoctorVerification;

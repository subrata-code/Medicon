// src/components/AdminDoctorVerification.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../libs/axios";
import toast from "react-hot-toast";
import Image from "./Image";

const AdminDoctorVerification = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUnverifiedDoctors();
  }, []);

  const fetchUnverifiedDoctors = async () => {
    try {
      const adminToken = localStorage.getItem("admintoken");
      if (!adminToken) {
        setError("Admin authentication required");
        return;
      }

      const response = await axiosInstance.get("/api/v1/doctors", {
        params: { isVerified: false },
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.data && response.data.data) {
        // Additional check to filter out any verified doctors
        const unverifiedDoctors = response.data.data.filter(
          (doctor) => !doctor.isVerified
        );
        setDoctors(unverifiedDoctors);
      } else {
        setError("No data received from server");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching unverified doctors:", error);
      setError(
        error.response?.data?.message || "Failed to fetch unverified doctors"
      );
      setLoading(false);
    }
  };

  const handleVerify = async (doctorId) => {
    try {
      const adminToken = localStorage.getItem("admintoken");
      if (!adminToken) {
        toast.error("Admin authentication required");
        return;
      }

      const response = await axiosInstance.post(
        "/api/v1/verifyDoctor",
        {
          doctorId,
          isVerified: true,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.data && response.data.status === "OK") {
        // Remove the verified doctor from the list
        setDoctors(doctors.filter((doctor) => doctor._id !== doctorId));
        toast.success(response.data.message || "Doctor verified successfully!");
      } else {
        toast.error(response.data?.message || "Failed to verify doctor");
      }
    } catch (error) {
      console.error("Error verifying doctor:", error);
      toast.error(error.response?.data?.message || "Failed to verify doctor");
    }
  };

  const handleReject = async (doctorId) => {
    try {
      const adminToken = localStorage.getItem("admintoken");
      if (!adminToken) {
        toast.error("Admin authentication required");
        return;
      }

      const response = await axiosInstance.post(
        "/api/v1/verifyDoctor",
        {
          doctorId,
          isVerified: false,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.data && response.data.status === "OK") {
        // Remove the rejected doctor from the list
        setDoctors(doctors.filter((doctor) => doctor._id !== doctorId));
        toast.success(response.data.message || "Doctor rejected successfully!");
      } else {
        toast.error(response.data?.message || "Failed to reject doctor");
      }
    } catch (error) {
      console.error("Error rejecting doctor:", error);
      toast.error(error.response?.data?.message || "Failed to reject doctor");
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="space-y-4">
      {doctors.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No unverified doctors found.
        </p>
      ) : (
        doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex justify-center items-center gap-4">
              <div className="relative mb-2 h-24 w-24 rounded-full border-4 border-blue-600 shadow-lg overflow-hidden bg-white group-hover:border-blue-100 transition-colors duration-300">
                <Image
                  pic={doctor.profilepic}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">{doctor.name}</h3>
                <p className="text-sm text-gray-600 font-bold">
                  {doctor.specialization.join(", ")}
                </p>
                <p className="text-sm font-semibold text-gray-600">
                  Registration ID: {doctor.registrationId}
                </p>
                <p className="text-sm text-gray-600 text-clip w-5/6">
                  Address: {doctor.address}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleVerify(doctor._id)}
                className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Verify
              </button>
              <button
                onClick={() => handleReject(doctor._id)}
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

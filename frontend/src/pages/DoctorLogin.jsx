import { HeartHandshake } from "lucide-react";
import React, { useState } from "react";
import { axiosInstance } from "../libs/axios.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function DoctorLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First API call - Login
      const response = await axiosInstance.post(
        "/api/v1/login-doctor",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Login Response:", response.data);
      const data = response.data;
      const doctorId = data.data._id;

      if (response.status === 200) {
        try {
          // Second API call - Update online status
          const statusResponse = await axiosInstance.post(
            "/api/v1/update-doctor-status",
            {
              doctorId,
              isOnline: true,
              isBusy: false,
            }
          );

          console.log("Status Update Response:", statusResponse.data);

          // Verify the update by fetching the doctor's current status
          const verifyResponse = await axiosInstance.get(
            `/api/v1/doctors/${doctorId}`
          );
          console.log("Doctor's Current Status:", {
            isOnline: verifyResponse.data.data.isOnline,
            isBusy: verifyResponse.data.data.isBusy,
          });

          if (statusResponse.data.status === "OK") {
            toast.success("Login Successful");
            localStorage.setItem("doctortoken", data.token);
            localStorage.setItem("doctorId", doctorId);
            navigate(`/doctorDashboard/${doctorId}`);
          } else {
            console.warn("Online status not updated:", statusResponse.data);
            toast.warning("Logged in but status update failed");
            navigate(`/doctorDashboard/${doctorId}`);
          }
        } catch (statusError) {
          console.error(
            "Error updating online status:",
            statusError.response?.data || statusError
          );
          // Continue with login even if status update fails
          toast.warning("Logged in but status update failed");
          navigate(`/doctorDashboard/${doctorId}`);
        }
      } else {
        toast.error("Login Failed");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
            <HeartHandshake />
          </span>
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Doctor Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/doctorSignup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default DoctorLogin;

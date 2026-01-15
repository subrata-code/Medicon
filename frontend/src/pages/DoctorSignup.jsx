import React, { useState, useEffect } from "react";
import { User, AlertCircle } from "lucide-react";
import axiosInstance from "../libs/axios";
import { toast } from "react-hot-toast";

function DoctorSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phonenumber: "",
    password: "",
    profileimage: null,
    registrationId: "",
    specialization: [],
    geoLocation: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Get location when component mounts
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            geoLocation: `${position.coords.latitude},${position.coords.longitude}`,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Please enable location services to continue");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSpecializationChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setFormData((prevData) => ({
      ...prevData,
      specialization: selectedOptions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.geoLocation) {
      toast.error("Please enable location services to continue");
      setIsLoading(false);
      return;
    }

    const form = new FormData();

    // Add all form fields
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("phonenumber", formData.phonenumber);
    form.append("password", formData.password);
    form.append("registrationId", formData.registrationId);
    form.append("address", formData.address);
    formData.specialization.forEach((spec) => {
      form.append("specialization", spec);
    });
    if (formData.profileimage) {
      form.append("profileimage", formData.profileimage);
    }

    // Add location data
    form.append("geoLocation", formData.geoLocation);
    form.append("role", "doctor");

    try {
      const response = await axiosInstance.post("/api/v1/signup-doctor", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Signup successful!");
        window.location.href = "/doctorLogin";
      } else {
        setError(response.data.message || "Signup Failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError(
        error.response?.data?.message || "An error occurred during signup."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-[80%] mt-10 bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-100">
            <User className="h-8 w-8 text-blue-600" />
          </span>
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Doctor Sign Up
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your clinic address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phonenumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                id="phonenumber"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                required
                placeholder="Enter your mobile number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                placeholder="Create a password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="profilepic"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profile Picture
              </label>
              <input
                type="file"
                id="profilepic"
                name="profileimage"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="registrationId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                License No.
              </label>
              <input
                type="text"
                id="registrationId"
                name="registrationId"
                value={formData.registrationId}
                onChange={handleChange}
                required
                placeholder="Enter your medical License No."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="specialization"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Specialization
            </label>
            <select
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleSpecializationChange}
              required
              multiple
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 min-h-32"
            >
              <option value="General Physician">General Physician</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Endocrinology">Endocrinology</option>
              <option value="Gastroenterology">Gastroenterology</option>
              <option value="Hematology">Hematology</option>
              <option value="Neurology">Neurology</option>
              <option value="Nephrology">Nephrology</option>
              <option value="Oncology">Oncology</option>
              <option value="Ophthalmology">Ophthalmology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Otolaryngology (ENT)">Otolaryngology (ENT)</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Pulmonology">Pulmonology</option>
              <option value="Radiology">Radiology</option>
              <option value="Rheumatology">Rheumatology</option>
              <option value="Surgery">Surgery</option>
              <option value="Urology">Urology</option>
              <option value="Gynecology">Gynecology</option>
              <option value="Dentistry">Dentistry</option>
              <option value="Anesthesiology">Anesthesiology</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Hold Ctrl/Cmd to select multiple specializations
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              {isLoading ? "Processing..." : "Sign Up"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/doctorLogin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default DoctorSignup;

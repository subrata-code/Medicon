import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import AppointmentsSection from "../components/AppointmentsSection";
import MedicalRecords from "../components/MedicalRecords";
import DoctorCard from "../components/DoctorCard";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../libs/axios";
import { toast } from "react-hot-toast";

const PatientDashboard = () => {
  const { id: userId } = useParams();
  const [user, setUser] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usrtoken, setUsrtoken] = useState();
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const userToken = localStorage.getItem("usertoken");
    setUsrtoken(userToken);
    if (!userToken) {
      navigate("/loginDashboard");
    }
  }, [navigate]);

  // Fetch user data
  useEffect(() => {
    if (userId) {
      getUserData(userId);
    }
  }, [userId]);

  const getUserData = async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/v1/users/${userId}`);
      console.log(response.data.data);
      if (response.data && response.data.data) {
        const healthData = response.data.data.HealthData || {};
        setUser({
          _id: response.data.data.User._id || "",
          name: response.data.data.User.name || "",
          phonenumber: response.data.data.User.phonenumber || "",
          profilepic: response.data.data.User.profilepic || "",
          email: response.data.data.User.email || "",
          upcomingAppointment: response.data.data.User.upcomingAppointment || 0,
          completedAppointments:
            response.data.data.User.completedAppointments || 0,
          medicalRecords: response.data.data.User.medicalRecords || 0,
          iotDevices: response.data.data.User.iotDevices || 0,
          bloodPressure: {
            systolic: healthData.bpData.systolic || "Not Available",
            diastolic: healthData.bpData.diastolic || "Not Available",
          },
          heartRate: healthData.heartRateData || "Not Available",
          spo2: healthData.spO2Data || "Not Available",
        });
      } else {
        console.warn("User data is missing in response");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch available nearby doctors
  const fetchNearbyDoctors = async (latitude, longitude) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/nearby-doctors", {
        params: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          maxDistance: 10000, // 10km in meters
        },
      });
      console.log("Fetched Doctors:", response.data.data);
      if (response.data && response.data.status === "OK") {
        setDoctors(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to fetch doctors.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Please enable location services to find nearby doctors");
          setIsLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      console.log("User Location:", userLocation);
      fetchNearbyDoctors(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="container mx-auto py-4 space-y-6">
          {/* Header */}
          <DashboardHeader user={user} />

          {/* Other Sections */}
          <DashboardStats user={user} />

          {/* Doctors Grid */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Nearby Available Doctors
              </h2>
              <Link to="/find-doctors">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
                  View More Doctors
                </button>
              </Link>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor._id} doctor={doctor} user={user} />
                ))}
              </div>
            )}
          </div>

          {/* Appointments Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <AppointmentsSection
              user={user}
              userToken={usrtoken}
              userId={userId}
            />
          </div>

          {/* Medical Records Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <MedicalRecords userId={userId} userToken={usrtoken} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PatientDashboard;

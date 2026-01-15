import React, { useEffect, useState } from "react";
import DoctorProfileHeader from "../components/DoctorProfileHeader";
import DoctorDetailsForm from "../components/DoctorDetailsForm";
import ManageSchedule from "../components/ManageSchedule";
import Footer from "../components/Footer";
import { axiosInstance } from "../libs/axios";
import { useParams, useNavigate } from "react-router-dom";
import AppointmentList from "../components/AppointmentList";

const DoctorDashboard = () => {
  const { id: doctorId } = useParams();
  const [doctor, setDoctor] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  const [doctorToken, setDoctorToken] = useState();

  useEffect(() => {
    if (doctorId) {
      getDoctorData(doctorId);
    }
  }, [doctorId, refreshTrigger]);

  useEffect(() => {
    setDoctorToken(localStorage.getItem("doctortoken"));
    // if (!doctorToken) {
    //   navigate("/loginDashboard");
    // }
  }, [navigate]);

  const getDoctorData = async (doctorId) => {
    try {
      console.log("Fetching doctor data for ID:", doctorId);
      const response = await axiosInstance.get(`/api/v1/doctors/${doctorId}`);

      console.log("Doctor data received:", response.data.data);
      if (response.data && response.data.data) {
        setDoctor({
          name: response.data.data.name || "",
          address: response.data.data.address || "",
          languages: response.data.data.languages || [],
          phonenumber: response.data.data.phonenumber || "",
          profilepic: response.data.data.profilepic || "",
          registrationId: response.data.data.registrationId || "",
          specialization: response.data.data.specialization || [],
          consultationFee: response.data.data.consultationFee || "",
          experience: response.data.data.experience || "",
          education: response.data.data.education || "",
          facts: response.data.data.facts || "",
          isVerified: response.data.data.isVerified || false,
          averageRating: response.data.data.averageRating || "",
          totalReviews: response.data.data.totalReviews || "",
        });
      } else {
        console.warn("Doctor data is missing in response");
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  // Function to refresh doctor data after updates
  const refreshDoctorData = () => {
    console.log("Refreshing doctor data...");
    setRefreshTrigger((prev) => prev + 1); // This will trigger the useEffect
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="w-full">
              <DoctorProfileHeader doctorData={doctor} />
              <DoctorDetailsForm
                doctorData={doctor}
                refreshData={refreshDoctorData}
              />
              <AppointmentList doctorId={doctorId} Token={doctorToken} />
            </div>
            <div className="w-full">
              <ManageSchedule doctorId={doctorId} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;

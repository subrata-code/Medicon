import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import AppointmentsSection from "../components/AppointmentsSection";
import MedicalRecords from "../components/MedicalRecords";
import DoctorCard from "../components/DoctorCard";
import { Link, useNavigate, useParams } from "react-router-dom";
import { mergeDoctorCardsWithApproved } from "../utils/demoMergeDoctors";

const PatientDashboard = () => {
  const { id: userIdParam } = useParams();
  const [user, setUser] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usrtoken, setUsrtoken] = useState();
  const [myBookings, setMyBookings] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();

  const loadMyBookings = () => {
    const pid =
      localStorage.getItem("currentPatientId") || userIdParam || "demo-user";
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const map = new Map();
    [...appointments, ...bookings].forEach((row) => {
      if (!row || row.id == null) return;
      const matches =
        String(row.patientId) === String(pid) || row.patientId === "demo-user";
      if (!matches) return;
      map.set(row.id, row);
    });
    setMyBookings(Array.from(map.values()));
  };

  const loadFiles = () => {
    const files = JSON.parse(localStorage.getItem("files")) || [];
    setUploadedFiles(files);
  };

  const getStatusColor = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-800";
    if (status === "accepted" || status === "approved") {
      return "bg-green-100 text-green-800";
    }
    if (status === "rejected") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const files = JSON.parse(localStorage.getItem("files")) || [];
    files.push({
      id: Date.now(),
      name: file.name,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toLocaleString(),
    });
    localStorage.setItem("files", JSON.stringify(files));
    loadFiles();
    window.dispatchEvent(new Event("demoDataUpdated"));
    event.target.value = "";
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "user") {
      navigate("/loginDashboard");
      return;
    }

    const demoUserId =
      localStorage.getItem("currentPatientId") || userIdParam || "demo-user";
    localStorage.setItem("userId", demoUserId);
    localStorage.setItem("secNumber", "9000000000");

    const patients = JSON.parse(localStorage.getItem("patients")) || [];
    const registered = patients.find((p) => p.id === demoUserId);

    if (registered) {
      setUser({
        _id: registered.id,
        name: registered.name,
        phonenumber: registered.phonenumber,
        profilepic: "",
        email: registered.email,
        upcomingAppointment: 1,
        completedAppointments: 3,
        medicalRecords: 5,
        iotDevices: 2,
        bloodPressure: {
          systolic: "120",
          diastolic: "80",
        },
        heartRate: "72",
        spo2: "98",
      });
    } else {
      setUser({
        _id: demoUserId,
        name: "Demo User",
        phonenumber: "+91-9000000000",
        profilepic: "",
        email: "user@medicon.com",
        upcomingAppointment: 1,
        completedAppointments: 3,
        medicalRecords: 5,
        iotDevices: 2,
        bloodPressure: {
          systolic: "120",
          diastolic: "80",
        },
        heartRate: "72",
        spo2: "98",
      });
    }

    setDoctors(mergeDoctorCardsWithApproved());
    loadMyBookings();
    loadFiles();
  }, [navigate, userIdParam]);

  // For demo mode, mark loading false
  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleDemoDataUpdate = () => {
      loadMyBookings();
      loadFiles();
      setDoctors(mergeDoctorCardsWithApproved());
    };

    window.addEventListener("demoDataUpdated", handleDemoDataUpdate);
    const poll = setInterval(() => {
      setDoctors(mergeDoctorCardsWithApproved());
    }, 2500);
    return () => {
      window.removeEventListener("demoDataUpdated", handleDemoDataUpdate);
      clearInterval(poll);
    };
  }, []);

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

          {/* My Appointments */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              My Appointments
            </h2>
            {myBookings.length === 0 ? (
              <p className="text-gray-500">No appointment requests yet</p>
            ) : (
              <div className="space-y-3">
                {myBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-100 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {booking.doctorName}
                      </p>
                      <p className="text-sm text-gray-500">{booking.date}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Medical Records */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Upload Medical Records
            </h2>
            <input
              type="file"
              onChange={handleFileUpload}
              className="mb-4 block w-full text-sm text-gray-700"
            />

            {uploadedFiles.length === 0 ? (
              <p className="text-gray-500">No files uploaded</p>
            ) : (
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="border border-gray-100 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-500">{file.uploadedAt}</p>
                    </div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
                    >
                      Open/View
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointments Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
              <AppointmentsSection
                user={user}
                userToken={usrtoken}
                userId={user._id}
              />
          </div>

          {/* Medical Records Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <MedicalRecords userId={user._id} userToken={usrtoken} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PatientDashboard;

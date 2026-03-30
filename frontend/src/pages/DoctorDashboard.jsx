import React, { useEffect, useState } from "react";
import DoctorProfileHeader from "../components/DoctorProfileHeader";
import DoctorDetailsForm from "../components/DoctorDetailsForm";
import ManageSchedule from "../components/ManageSchedule";
import Footer from "../components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import AppointmentList from "../components/AppointmentList";

const DoctorDashboard = () => {
  const { id: doctorIdParam } = useParams();
  const [doctor, setDoctor] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  const [doctorToken, setDoctorToken] = useState();
  const [doctorBookings, setDoctorBookings] = useState([]);

  const doctorId = doctorIdParam || "demo-doctor";

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "doctor") {
      navigate("/loginDashboard");
      return;
    }

    let savedDetails = null;
    try {
      const raw = localStorage.getItem("demoDoctorDetails");
      if (raw) savedDetails = JSON.parse(raw);
    } catch {
      savedDetails = null;
    }
    const docId = localStorage.getItem("doctorId");
    const approved = JSON.parse(localStorage.getItem("approvedDoctors")) || [];
    const d = approved.find((x) => String(x.id) === String(docId));

    if (savedDetails) {
      setDoctor(savedDetails);
    } else if (d) {
      setDoctor({
        name: d.name,
        address: d.address || "Kolkata, India",
        languages: ["English", "Hindi", "Bengali"],
        phonenumber: d.phonenumber || "+91-9000000000",
        profilepic:
          d.profilepic ||
          "https://randomuser.me/api/portraits/men/32.jpg",
        registrationId: d.registrationId || "",
        specialization: Array.isArray(d.specialization)
          ? d.specialization
          : [d.specialization || "General Physician"],
        consultationFee: 800,
        experience: 10,
        education: "MBBS",
        facts: "Verified MediCon doctor.",
        isVerified: true,
        averageRating: 4.5,
        totalReviews: 12,
      });
    } else {
      setDoctor({
        name: "Dr. Amit Sharma",
        address: "Apollo Hospital, Kolkata",
        languages: ["English", "Hindi", "Bengali"],
        phonenumber: "+91-9876543210",
        profilepic: "https://randomuser.me/api/portraits/men/32.jpg",
        registrationId: "MED123456",
        specialization: ["Cardiologist"],
        consultationFee: 800,
        experience: 12,
        education: "MBBS, MD (Cardiology)",
        facts: "Specializes in interventional cardiology with 10+ years of experience.",
        isVerified: true,
        averageRating: 4.7,
        totalReviews: 124,
      });
    }
  }, [doctorIdParam, refreshTrigger, navigate]);

  useEffect(() => {
    setDoctorToken(localStorage.getItem("doctortoken"));
    // if (!doctorToken) {
    //   navigate("/loginDashboard");
    // }
  }, [navigate]);

  // Function to refresh doctor data after updates
  const refreshDoctorData = () => {
    console.log("Refreshing doctor data...");
    setRefreshTrigger((prev) => prev + 1); // This will trigger the useEffect
  };

  const loadDoctorBookings = () => {
    const currentId = localStorage.getItem("doctorId") || doctorId;
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const map = new Map();
    [...appointments, ...bookings].forEach((row) => {
      if (!row || row.id == null) return;
      if (String(row.doctorId) !== String(currentId)) return;
      map.set(row.id, row);
    });
    setDoctorBookings(Array.from(map.values()));
  };

  const updateBookingStatus = (bookingId, status) => {
    const patch = (key) => {
      const list = JSON.parse(localStorage.getItem(key)) || [];
      const updated = list.map((b) =>
        b.id === bookingId ? { ...b, status } : b
      );
      localStorage.setItem(key, JSON.stringify(updated));
    };
    patch("appointments");
    patch("bookings");
    if (status === "accepted") alert("Appointment Confirmed");
    loadDoctorBookings();
    window.dispatchEvent(new Event("demoDataUpdated"));
  };

  const getStatusColor = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-800";
    if (status === "accepted" || status === "approved") {
      return "bg-green-100 text-green-800";
    }
    if (status === "rejected") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  useEffect(() => {
    loadDoctorBookings();
  }, []);

  useEffect(() => {
    const handleDemoDataUpdate = () => loadDoctorBookings();
    window.addEventListener("demoDataUpdated", handleDemoDataUpdate);
    const id = setInterval(loadDoctorBookings, 2500);
    return () => {
      window.removeEventListener("demoDataUpdated", handleDemoDataUpdate);
      clearInterval(id);
    };
  }, []);

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
              <div className="bg-white rounded-xl shadow-md p-6 mt-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Incoming Appointment Requests
                </h2>
                {doctorBookings.length === 0 ? (
                  <p className="text-gray-500">No requests for this doctor</p>
                ) : (
                  <div className="space-y-3">
                    {doctorBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="border border-gray-100 rounded-lg p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="font-medium text-gray-800">
                              {booking.patientName}
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
                        <div className="flex gap-3 mt-3">
                          <button
                            onClick={() => updateBookingStatus(booking.id, "accepted")}
                            className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, "rejected")}
                            className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

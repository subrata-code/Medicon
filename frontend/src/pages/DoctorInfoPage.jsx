import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axiosInstance from "../libs/axios";
import DoctorProfileHeader from "../components/DoctorProfileHeader";
import {
  BadgeCheck,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  Award,
  Briefcase,
  GraduationCap,
  Languages,
  Star,
} from "lucide-react";
import AppointmentModal from "../components/AppointmentModal";
import { toast } from "react-hot-toast";

const DoctorInfoPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [doctor, setDoctor] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(location.state?.user || null);

  useEffect(() => {
    console.log("User data in doctor info : ", user);
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/v1/doctors/${id}`);
        if (response.data && response.data.data) {
          setDoctor(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        toast.error("Failed to load doctor information");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [id]);

  const openModal = () => {
    const userToken = localStorage.getItem("usertoken");
    if (!userToken) {
      toast.error("Please login to book appointment");
      return;
    }
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DoctorProfileHeader doctorData={doctor} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Doctor Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-blue-600 mb-4">
              About Dr. {doctor.name}
            </h2>
            <p className="text-gray-700">
              {doctor.facts || "No information available."}
            </p>
          </section>

          {/* Education & Experience */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-blue-600 mb-4">
              Education & Experience
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <GraduationCap className="text-blue-500" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Education</h3>
                  <p className="text-gray-700">
                    {doctor.education || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Briefcase className="text-blue-500" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Experience</h3>
                  <p className="text-gray-700">
                    {doctor.experience
                      ? `${doctor.experience} years`
                      : "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Award className="text-blue-500" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Specializations</h3>
                  <p className="text-gray-700">
                    {doctor.specialization?.join(", ") || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Languages className="text-blue-500" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Languages</h3>
                  <p className="text-gray-700">
                    {doctor.languages?.join(", ") || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-blue-600 mb-4">
              Contact Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Mail className="text-blue-500" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-700">
                    {doctor.email || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Phone className="text-blue-500" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-700">
                    {doctor.phonenumber || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <MapPin className="text-blue-500" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-700">
                    {doctor.address || "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Consultation Fee */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Consultation Fee</h3>
            <p className="text-2xl font-bold text-blue-600">
              ₹{doctor.consultationFee || 0}
            </p>
            <button
              onClick={openModal}
              className="mt-4 cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Calendar size={18} />
              Book Appointment
            </button>
          </div>

          {/* Verification Status */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Verification Status</h3>
            <div className="flex items-center gap-2 mt-2">
              {doctor.isVerified ? (
                <>
                  <BadgeCheck className="text-green-500" size={24} />
                  <span className="text-green-500 font-medium">
                    Verified Doctor
                  </span>
                </>
              ) : (
                <>
                  <BadgeCheck className="text-gray-400" size={24} />
                  <span className="text-gray-500 font-medium">
                    Verification Pending
                  </span>
                </>
              )}
            </div>
            {doctor.registrationId && (
              <p className="mt-2 text-sm text-gray-600">
                Registration ID: {doctor.registrationId}
              </p>
            )}
          </div>

          {/* Ratings & Reviews Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold mb-2">Ratings & Reviews</h3>
            <div className="flex items-center gap-2 mt-2">
              <Star className="text-yellow-500 fill-yellow-500" size={24} />
              <span className="text-xl font-bold">
                {doctor.averageRating ? doctor.averageRating.toFixed(1) : "N/A"}
              </span>
              <span className="text-gray-500">
                ({doctor.totalReviews || 0} reviews)
              </span>
            </div>
          </div>

          {/* Location Map */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Location</h3>
            <div className="h-48 w-full rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  (doctor.geoLocation?.coordinates?.[0] || 88.0776323) - 0.5
                },${
                  (doctor.geoLocation?.coordinates?.[1] || 22.4808608) - 0.5
                },${
                  (doctor.geoLocation?.coordinates?.[0] || 88.0776323) + 0.5
                },${
                  (doctor.geoLocation?.coordinates?.[1] || 22.4808608) + 0.5
                }&layer=mapnik&marker=${
                  doctor.geoLocation?.coordinates?.[1] || 22.4808608
                },${doctor.geoLocation?.coordinates?.[0] || 88.0776323}`}
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={doctor}
        user={user}
      />
    </div>
  );
};

export default DoctorInfoPage;

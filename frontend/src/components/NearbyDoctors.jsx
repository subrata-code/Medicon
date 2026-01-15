import React, { useState, useEffect, useMemo } from "react";
import { MapPin, Phone, Mail, Star } from "lucide-react";
import axiosInstance from "../libs/axios";
import { toast } from "react-hot-toast";

const NearbyDoctors = ({ searchTerm, specialization }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user's location when component mounts
    if ("geolocation" in navigator) {
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
          setLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch nearby doctors when we have user's location
    if (userLocation) {
      fetchNearbyDoctors();
    }
  }, [userLocation]);

  const fetchNearbyDoctors = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/nearby-doctors", {
        params: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          maxDistance: 10000, // 10km in meters
        },
      });

      if (response.data && response.data.status === "OK") {
        setDoctors(response.data.data);
      } else {
        setError("No doctors found in your area");
      }
    } catch (error) {
      console.error("Error fetching nearby doctors:", error);
      setError(
        error.response?.data?.message || "Failed to fetch nearby doctors"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter doctors based on search term and specialization
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch = searchTerm
        ? doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialization.some((spec) =>
            spec.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;

      const matchesSpecialization = specialization
        ? doctor.specialization.includes(specialization)
        : true;

      return matchesSearch && matchesSpecialization;
    });
  }, [doctors, searchTerm, specialization]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Nearby Doctors</h2>
      {filteredDoctors.length === 0 ? (
        <p className="text-gray-500 text-center">
          No doctors found matching your criteria
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src={doctor.profilepic || "https://via.placeholder.com/150"}
                    alt={doctor.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {doctor.specialization.join(", ")}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{doctor.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">{doctor.phonenumber}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">{doctor.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {doctor.distance.toFixed(2)} km away
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() =>
                    (window.location.href = `/book-appointment/${doctor._id}`)
                  }
                  className="w-full bg-blue-600 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyDoctors;

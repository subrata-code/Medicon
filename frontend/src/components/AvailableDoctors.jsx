import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Star,
  Phone,
  MapPin,
  Briefcase,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { mergeAvailableDoctorsRows } from "../utils/demoMergeDoctors";
import { demoReviews } from "../data/demoReviews";

const AvailableDoctors = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const [doctors, setDoctors] = useState(() => mergeAvailableDoctorsRows());

  useEffect(() => {
    const refresh = () => setDoctors(mergeAvailableDoctorsRows());
    refresh();
    window.addEventListener("demoDataUpdated", refresh);
    const id = setInterval(refresh, 2500);
    return () => {
      window.removeEventListener("demoDataUpdated", refresh);
      clearInterval(id);
    };
  }, []);

  const specializations = [
    "all",
    ...Array.from(new Set(doctors.map((d) => d.specialization))),
  ];

  const filteredDoctors = doctors
    .filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialization =
        selectedSpecialization === "all" ||
        doctor.specialization === selectedSpecialization;
      return matchesSearch && matchesSpecialization;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "experience":
          return parseInt(b.experience) - parseInt(a.experience);
        case "availability":
          return a.availability === "Available Today" ? -1 : 1;
        default:
          return 0;
      }
    });

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDoctors(mergeAvailableDoctorsRows());
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
        <h2 className="text-xl font-semibold">Available Doctors</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec === "all" ? "All Specializations" : spec}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="rating">Sort by Rating</option>
            <option value="experience">Sort by Experience</option>
            <option value="availability">Sort by Availability</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`text-gray-600 ${isLoading ? "animate-spin" : ""}`}
              size={20}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-xl border border-gray-100 p-6 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-blue-600 text-xl font-medium">
                  {doctor.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{doctor.name}</h3>
                <p className="text-sm text-gray-500">{doctor.specialization}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-600">
                  {doctor.rating} ({doctor.reviews} reviews)
                </span>
              </div>
              {/* Demo Reviews */}
              <div className="mt-2 space-y-1">
                {demoReviews.map((review) => (
                  <div key={review.id} className="text-xs text-gray-600">
                    <span className="font-medium">{review.name}</span>{" "}
                    <span className="text-yellow-400">
                      {"★".repeat(review.rating)}
                    </span>
                    <span className="ml-1">- {review.comment}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{doctor.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{doctor.contact}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {doctor.experience}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {doctor.availability}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Next Available: {doctor.nextAvailable}
                </span>
              </div>
            </div>

            <button className="w-full mt-6 bg-blue-500 cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No doctors found</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <button className="text-blue-500 cursor-pointer hover:text-blue-600 font-medium">
          View All Doctors
        </button>
      </div>
    </div>
  );
};

export default AvailableDoctors;

import React, { useState } from "react";
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

const AvailableDoctors = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // Static data for doctors
  const doctorsData = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Cardiologist",
      rating: 4.8,
      reviews: 127,
      experience: "12 years",
      location: "New York, NY",
      availability: "Available Today",
      nextAvailable: "10:00 AM",
      contact: "+1 (555) 123-4567",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialization: "Neurologist",
      rating: 4.9,
      reviews: 89,
      experience: "15 years",
      location: "Los Angeles, CA",
      availability: "Next Available: Tomorrow",
      nextAvailable: "2:30 PM",
      contact: "+1 (555) 234-5678",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: 3,
      name: "Dr. Emily Brown",
      specialization: "Pediatrician",
      rating: 4.7,
      reviews: 156,
      experience: "8 years",
      location: "Chicago, IL",
      availability: "Available Today",
      nextAvailable: "11:00 AM",
      contact: "+1 (555) 345-6789",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      id: 4,
      name: "Dr. David Wilson",
      specialization: "Orthopedist",
      rating: 4.6,
      reviews: 98,
      experience: "10 years",
      location: "Houston, TX",
      availability: "Next Available: Tomorrow",
      nextAvailable: "9:00 AM",
      contact: "+1 (555) 456-7890",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
    },
  ];

  const [doctors, setDoctors] = useState(doctorsData);

  const specializations = [
    "all",
    "Cardiologist",
    "Neurologist",
    "Pediatrician",
    "Orthopedist",
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
    // Simulate API call with setTimeout
    setTimeout(() => {
      setDoctors(doctorsData);
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

import React, { useState } from "react";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Particles from "./Particles"; // Import the Particles component
import TypingText from "./TypingText"
import Tooltip from "../components/Tooltip";

const HomeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const navigate = useNavigate();

  const specializations = [
    "General Physician",
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
  ];

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (selectedSpecialization)
      params.append("specialization", selectedSpecialization);
    navigate(`/find-doctors?${params.toString()}`);
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-20 px-4 sm:px-6 lg:px-8">
      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={600}
          particleSpread={20}
          speed={0.3}
          particleBaseSize={300}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <h1 className="text-2xl md:text-6xl font-bold text-white mb-6">
          Find Your Preferable <TypingText />
        </h1>
        <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
          Connect with verified healthcare professionals near you. Book
          appointments instantly and get the care you deserve.
        </p>
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-4 sm:p-6 space-y-4 sm:space-y-0 flex sm:flex-row sm:space-x-4 items-center">
          {/* Search Input */}
          <form
            onSubmit={handleSearch}
            className="w-full flex gap-4 sm:gap-6 items-center"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors by Specalization"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Tooltip content={"Search Specalist Doctor Here"} position="top">
              <button
                type="submit"
                className="px-4 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer transition-colors flex items-center justify-center sm:text-sm"
              >
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </Tooltip>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomeSearch;
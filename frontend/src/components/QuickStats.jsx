import React from "react";

const QuickStats = ({ doctor }) => {
  const stats = [
    { icon: "👥", number: doctor.totalReviews ? doctor.totalReviews : "N/A", label: "Reviews" },
    { icon: "📅", number: doctor.experience ? doctor.experience : "N/A", label: "Years Experience" },
    { icon: "⭐", number: doctor.averageRating ? doctor.averageRating.toFixed(1) : "N/A", label: "Rated" },
  ];



  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 w-full px-4 sm:px-8 lg:px-16">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-zinc-100 px-10 py-2 rounded-xl flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg transition-shadow duration-300 hover:bg-blue-500 hover:text-white w-full"
        >
          <div className="text-2xl sm:text-3xl">{stat.icon}</div>
          <p className="text-lg sm:text-lg font-bold mt-2">{stat.number}</p>
          <p className="text-base sm:text-base opacity-80">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;

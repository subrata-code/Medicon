import React from "react";
import Image from "./Image";
import QuickStats from "../components/QuickStats";
import { BadgeCheck } from "lucide-react";

const DoctorProfileHeader = ({ doctorData }) => {
  if (!doctorData || Object.keys(doctorData).length === 0) {
    return <p>Loading...</p>; // Avoid rendering before data is ready
  }

  return (
    <div className="flex flex-col items-center md:items-start gap-4 mb-6 shadow-md rounded-lg p-6">
      <div className="flex flex-col items-center md:flex-row md:items-center gap-4">
        <div className="relative mb-2 h-24 w-24 rounded-full border-4 border-blue-600 shadow-lg overflow-hidden bg-white group-hover:border-blue-100 transition-colors duration-300">
          <Image
            pic={doctorData.profilepic}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-blue-500">
            {doctorData.name}
            {doctorData.isVerified && (
              <BadgeCheck
                className="inline-block ml-2 text-green-500"
                size={20}
              />
            )}
          </h2>
          <p className="text-gray-600 text-sm">
            {doctorData.specialization?.join(", ")}
          </p>
        </div>
      </div>
      <QuickStats doctor={doctorData}/>
    </div>
  );
};

export default DoctorProfileHeader;

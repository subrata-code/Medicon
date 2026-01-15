import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import axiosInstance from "../libs/axios";
import { toast } from "react-hot-toast";

const SOS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const secNumber = localStorage.getItem("secNumber");
  const [emNumber, setEmNumber] = useState(`+91${secNumber}`);
  const userId = localStorage.getItem("userId");

  const handleSOS = async () => {
    if (!emNumber || !userId) {
      toast.error("User is not logged in");
      window.location.href = "tel:108";
      return;
    }
    setIsLoading(true);
    try {
      await axiosInstance.post("/api/v1/sos", {
        userId,
        emNumber,
      });
      toast.success("SOS sent successfully");
    } catch (error) {
      toast.error("Failed to send SOS");
      window.location.href = "tel:108";
    }
    setIsLoading(false);
  };
  return (
    <button
      onClick={handleSOS}
      className="flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
    >
      <ShieldCheck className="w-4 h-4 mr-2 " />
      SOS
    </button>
  );
};

export default SOS;

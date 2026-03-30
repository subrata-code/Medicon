import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Define the component as a named function instead of an arrow function
function VideoCall() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const userToken = localStorage.getItem("doctortoken");
  const [userName, setUserName] = useState("");

  const handleGoBack = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    if (userToken) {
      setUserName(`User-${Math.floor(Math.random() * 1000)}`);
    } else {
      setUserName(`Doctor-${Math.floor(Math.random() * 1000)}`);
    }
  }, [userToken, navigate]);

  const myMeeting = async (element) => {
    if (!element) return;

    element.innerHTML = `
      <div style="height:100%;display:flex;align-items:center;justify-content:center;background:#f8fafc;">
        <div style="text-align:center;padding:24px;background:white;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);max-width:500px;">
          <h2 style="font-size:20px;font-weight:700;color:#2563eb;margin-bottom:10px;">Demo Video Consultation</h2>
          <p style="color:#4b5563;margin-bottom:8px;">Room ID: ${appointmentId}</p>
          <p style="color:#4b5563;margin-bottom:8px;">Participant: ${userName}</p>
          <p style="color:#6b7280;font-size:14px;">This is a frontend-only mock call screen for demo presentation.</p>
        </div>
      </div>
    `;
  };

  return (
    <div className="relative flex flex-col h-screen bg-gray-50">
      {/* Video call container */}
      <div className="flex-1 w-full" ref={myMeeting} />

      {/* Logout button positioned at bottom center */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 bg-red-500 text-white px-5 py-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          End & Logout
        </button>
      </div>
    </div>
  );
}

export default VideoCall;

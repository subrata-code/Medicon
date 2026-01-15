import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
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

    try {
      const appID = parseInt(import.meta.env.VITE_ZEG_APP_ID);
      const serverSecret = import.meta.env.VITE_SERVER_SECRET;

      if (!appID || !serverSecret) {
        console.error("ZegoCloud credentials not found");
        return;
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        appointmentId,
        Date.now().toString(),
        userName
      );

      // Create instance
      const zc = ZegoUIKitPrebuilt.create(kitToken);

      zc.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Copy link",
            url: `${window.location.origin}/videocall/${appointmentId}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
      });
    } catch (error) {
      console.error("Error initializing video call:", error);
    }
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

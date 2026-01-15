import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorSignup from "./pages/DoctorSignup";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import LoginDashboard from "./pages/LoginDashboard";
import ErrorPage from "./pages/Error";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import FindDoctors from "./pages/FindDoctors";
import AdminDoctorVerification from "./components/AdminDoctorVerification";
import Home from "./pages/Home";
import VideoCall from "./components/VideoCall";
import BuyMeACoffee from "./components/BuyMeACoffee";
import DoctorInfoPage from "./pages/DoctorInfoPage";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Doctor Routes */}
          <Route path="/doctorLogin" element={<DoctorLogin />} />
          <Route path="/doctorSignup" element={<DoctorSignup />} />
          <Route path="/doctorDashboard/:id" element={<DoctorDashboard />} />
          <Route path="/doctorprofile/:id" element={<DoctorInfoPage />} />

          {/* User Routes */}
          <Route path="/userLogin" element={<UserLogin />} />
          <Route path="/userSignup" element={<UserSignup />} />
          <Route path="/patientDashboard/:id" element={<PatientDashboard />} />

          {/* Login Dashboard */}
          <Route path="/loginDashboard" element={<LoginDashboard />} />

          {/* Admin Routes */}
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/verify-doctors" element={<AdminDoctorVerification />} />

          {/* Find Doctors */}
          <Route path="/find-doctors" element={<FindDoctors />} />

          {/* VideoCall  */}
          <Route path="/videocall/:appointmentId" element={<VideoCall />} />

          {/* Buy us a Coffee */}
          <Route path="/buymeacoffee" element={<BuyMeACoffee />} />

          {/* Error Page */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "#4aed88",
            },
          },
        }}
      />
    </div>
  );
};

export default App;

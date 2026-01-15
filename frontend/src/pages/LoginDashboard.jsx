import { HeartHandshake, User2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const LoginDashboard = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="container max-w-6xl mx-auto bg-zinc-50 rounded-2xl shadow-lg">
        <div className="p-4 md:p-6 flex flex-col items-center">
          <div className="w-full flex flex-col md:flex-row justify-between gap-4 mb-4">
            {/* Healthcare Providers Section */}
            <section
              id="left"
              className="w-full md:w-1/2 bg-zinc-100 rounded-2xl flex flex-col items-center justify-center p-4 md:p-6"
            >
              <span className="mb-4 md:mb-6">
                <HeartHandshake className="h-12 w-12 md:h-16 md:w-16 text-blue-600" />
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-blue-600 text-center">
                For Healthcare Providers
              </h2>
              <p className="text-center text-gray-600 my-2 text-sm md:text-base lg:text-lg w-full md:w-5/6">
                Access our comprehensive platform to manage patient care,
                appointments, and telemedicine services efficiently.
              </p>
              <a href="/doctorLogin">
                <button className="my-2 md:my-4 py-2 px-4 md:px-6 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-500 transition-colors">
                  Doctor Login
                </button>
              </a>
              <p className="text-center text-gray-600 my-2 text-sm md:text-base w-full md:w-5/6">
                Don't have an account?{" "}
                <a
                  href="/doctorSignup"
                  className="text-blue-600 hover:underline"
                >
                  Contact Support
                </a>{" "}
                |{" "}
                <a
                  href="/doctorSignup"
                  className="text-blue-600 hover:underline"
                >
                  Request Access
                </a>
              </p>
            </section>

            {/* Patients/General User Section */}
            <section
              id="right"
              className="w-full md:w-1/2 bg-zinc-100 rounded-2xl flex flex-col items-center justify-center p-4 md:p-6"
            >
              <span className="mb-4 md:mb-6">
                <User2 className="h-12 w-12 md:h-16 md:w-16 text-blue-600" />
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-blue-600 text-center">
                For Patients/General User
              </h2>
              <p className="text-center text-gray-600 my-2 text-sm md:text-base lg:text-lg w-full md:w-5/6">
                Access your personal health dashboard, book appointments, and
                connect with healthcare professionals.
              </p>
              <a href="/userLogin">
                <button className="my-2 md:my-4 py-2 px-4 md:px-6 bg-transparent border border-blue-600 text-blue-600 rounded-md cursor-pointer hover:bg-blue-500 hover:text-white transition-colors">
                  User Login
                </button>
              </a>
              <p className="text-center text-gray-600 my-2 text-sm md:text-base w-full md:w-5/6">
                Don't have an account?{" "}
                <a href="/userSignup" className="text-blue-600 hover:underline">
                  Contact Support
                </a>{" "}
                |{" "}
                <a href="/userSignup" className="text-blue-600 hover:underline">
                  Sign Up Here
                </a>
              </p>
            </section>
          </div>

          {/* Admin Login Link */}
          <Link to="/adminLogin" className="text-blue-600 hover:underline mt-2">
            Admin Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginDashboard;
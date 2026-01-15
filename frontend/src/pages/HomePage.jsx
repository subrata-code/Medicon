import React from "react";
import heroImg from "../assets/hero-sec.svg";
import { Heart, CalendarCheck, Headphones, UserCheck } from "lucide-react";
import Footer from "../components/Footer";
import ChatInterface from "../components/ChatInterface";

const HomePage = () => {
  localStorage.clear();
  return (
    <main className="font-sans text-gray-800 relative">
      {/* Chatbot  */}
      <ChatInterface />
      {/* Hero Section */}
      <section
        id="hero"
        className="flex flex-col md:flex-row items-center justify-between px-4 py-8 md:px-4 md:py-16"
      >
        <div id="hero-left" className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-blue-600">
            Welcome to <span className="text-blue-600">MEDICON</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Connect with top medical professionals at the click of a button.
            Schedule appointments, manage your visits, and stay on top of your
            healthcare needs with ease.
          </p>
          <a
            href="/loginDashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md inline-block transition duration-300"
          >
            Get Started
          </a>
        </div>
        <div
          id="hero-right"
          className="md:w-1/2 mt-8 md:mt-0 flex items-center justify-center"
        >
          <img className="w-[80%]" src={heroImg} alt="hero" />
        </div>
      </section>

      {/* Premium Section */}
      <section className="bg-gradient-to-br from-blue-100 to-blue-50 py-16 mb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-blue-700">
              Unique Features
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">
                Advanced Diagnostics
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get detailed health diagnostics with our premium AI technology
                in emergency .
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">
                Priority Support
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Enjoy expedited support with dedicated priority service.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">
                Video Consultation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Video consultation allows patients to consult doctors through
                secure live video calls.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">
                Personal Health Coach
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Work with a personal health coach to achieve your wellness
                goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">
            Other Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <div className="flex justify-center mb-6">
                <Heart className="text-4xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-center">
                AI Health Diagnosis
              </h3>
              <p className="text-gray-600 leading-relaxed text-center text-lg px-6">
                Cutting-edge AI technology for accurate health diagnostics.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <div className="flex justify-center mb-6">
                <CalendarCheck className="text-4xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-center">
                Appointment Booking
              </h3>
              <p className="text-gray-600 leading-relaxed text-center text-lg px-6">
                Easy and efficient appointment booking system.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <div className="flex justify-center mb-6">
                <Headphones className="text-4xl text-blue-600" />
              </div>
              <h3 className="text-2xl text-center font-semibold mb-3">
                Shift Appointment
              </h3>
              <p className="text-gray-600 leading-relaxed text-center text-lg px-6">
                Shift appointment allows patients to reschedule their booked
                appointments.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition duration-300">
              <div className="flex justify-center mb-6">
                <UserCheck className="text-4xl text-blue-600" />
              </div>
              <h3 className="text-2xl text-center font-semibold mb-3">
                24/7 Support
              </h3>
              <p className="text-gray-600 leading-relaxed text-center text-lg px-6">
                Round-the-clock customer support for all your queries.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default HomePage;

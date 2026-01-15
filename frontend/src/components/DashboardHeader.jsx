import React, { useState } from "react";
import { Bell, Settings, LogOut, Menu, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserImage from "./UserImage";

const DashboardHeader = ({ user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-zinc-50 rounded-lg text-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-blue-500">
              <UserImage
                pic={user.profilepic}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold">
                Welcome, {user?.name || "User"}!
              </h1>
              <p className="text-sm font-light text-gray-600">
                Your health, our priority.
              </p>
            </div>
          </div>

          {/* Notification and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
              <Bell className="text-gray-600" size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 cursor-pointer rounded-lg hover:bg-gray-200 transition-colors md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="text-gray-800" size={20} />
              ) : (
                <Menu className="text-gray-800" size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/settings");
                }}
                className="w-full cursor-pointer flex items-center space-x-2 px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 rounded-lg"
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;

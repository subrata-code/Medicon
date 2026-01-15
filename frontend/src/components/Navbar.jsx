import { useEffect, useState } from "react";
import {
  HomeIcon,
  Settings,
  Menu,
  LogOut,
  UserCircle,
  Stethoscope,
  ShieldCheck,
  X,
  Search,
  Calendar,
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axiosInstance from "../libs/axios"; 
import Tooltip from "./Tooltip";
import SOS from "./SOS";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const checkAuth = () => {
    const doctorToken = localStorage.getItem("doctortoken");
    const userToken = localStorage.getItem("usertoken");
    const adminToken = localStorage.getItem("admintoken");
    const secNumber = localStorage.getItem("secNumber");

    if (doctorToken) {
      setIsAuth(true);
      setRole("doctor");
    } else if (userToken) {
      setIsAuth(true);
      setRole("user");
    } else if (adminToken) {
      setIsAuth(true);
      setRole("admin");
    } else {
      setIsAuth(false);
      setRole(null);
    }
  };

  useEffect(() => {
    checkAuth();
    setIsOpen(false);
  }, [location.pathname]);

  const handleDoctorLogout = async () => {
    const doctorToken = localStorage.getItem("doctortoken");
    const doctorId = localStorage.getItem("doctorId");

    if (doctorToken && doctorId) {
      try {
        await axiosInstance.post(
          "/api/v1/update-doctor-status",
          {
            doctorId,
            isOnline: false,
            isBusy: false,
          },
          {
            headers: {
              Authorization: `Bearer ${doctorToken}`,
            },
          }
        );
      } catch (error) {
        console.error("Error during doctor logout:", error);
      }
    }
    localStorage.removeItem("doctortoken");
    localStorage.removeItem("doctorId");
    setIsAuth(false);
    setRole(null);
    navigate("/loginDashboard");
  };

  const handleUserLogout = () => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("userId");
    localStorage.removeItem("secNumber");
    setIsAuth(false);
    setRole(null);
    navigate("/loginDashboard");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("admintoken");
    setIsAuth(false);
    setRole(null);
    navigate("/loginDashboard");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/find-doctors?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const getDashboardLink = () => {
    const userId = localStorage.getItem(
      role === "doctor" ? "doctorId" : "userId"
    );
    switch (role) {
      case "doctor":
        return `/doctorDashboard/${userId}`;
      case "user":
        return `/patientDashboard/${userId}`;
      case "admin":
        return "/adminDashboard";
      default:
        return "/";
    }
  };

  const navLinks = [
    {
      name: "Home",
      path: "/",
      icon: HomeIcon,
      show: true,
    },
    {
      name: "Dashboard",
      path: getDashboardLink(),
      icon: Settings,
      show: isAuth,
    },
    {
      name: "Find Doctors",
      path: "/find-doctors",
      icon: Stethoscope,
      show: true,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: Calendar,
      show: isAuth && role !== "admin",
    },
    {
      name: "Verify Doctors",
      path: "/verify-doctors",
      icon: ShieldCheck,
      show: role === "admin",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:opacity-90 transition-opacity flex items-center"
            >
              <Stethoscope className="w-8 h-8 mr-2 text-blue-600" />
              Medicon
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for doctors, specialties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {navLinks
              .filter((link) => link.show)
              .map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <link.icon className="w-5 h-5 mr-2" />
                  {link.name}
                </Link>
              ))}

            {/* SOS Button */}
            <Tooltip content={"Click here if emergency"} position="bottom">
              {/* <a
                href="tel:108"
                className="flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                SOS
              </a> */}
              <SOS />
            </Tooltip>

            {/* Auth Button */}
            <Tooltip content={"Click to Login or Logout"} position="bottom">
              {isAuth && role === "doctor" && (
                <button
                  onClick={handleDoctorLogout}
                  className="cursor-pointer flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              )}
              {isAuth && role === "user" && (
                <button
                  onClick={handleUserLogout}
                  className="cursor-pointer flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              )}
              {isAuth && role === "admin" && (
                <button
                  onClick={handleAdminLogout}
                  className="cursor-pointer flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              )}
              {!isAuth && (
                <Link
                  to="/loginDashboard"
                  className="cursor-pointer flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  Login
                </Link>
              )}
            </Tooltip>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="sm:hidden">
            <div className="px-4 pt-4 pb-3 space-y-1">
              {navLinks
                .filter((link) => link.show)
                .map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center px-4 py-2 rounded-md text-base font-medium ${
                      location.pathname === link.path
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <link.icon className="w-5 h-5 mr-3" />
                    {link.name}
                  </Link>
                ))}

              {/* SOS Button */}
              <a
                href="tel:108"
                className="cursor-pointer flex items-center justify-center px-4 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <ShieldCheck className="w-5 h-5 mr-3" />
                SOS
              </a>

              {isAuth && role === "doctor" && (
                <button
                  onClick={() => {
                    handleDoctorLogout();
                    setIsOpen(false);
                  }}
                  className="cursor-pointer flex w-full items-center justify-center px-4 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              )}
              {isAuth && role === "user" && (
                <button
                  onClick={() => {
                    handleUserLogout();
                    setIsOpen(false);
                  }}
                  className="cursor-pointer flex w-full items-center justify-center px-4 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              )}
              {isAuth && role === "admin" && (
                <button
                  onClick={() => {
                    handleAdminLogout();
                    setIsOpen(false);
                  }}
                  className="cursor-pointer flex w-full items-center justify-center px-4 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              )}
              {!isAuth && (
                <Link
                  to="/loginDashboard"
                  className="cursor-pointer flex w-full items-center justify-center px-4 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <UserCircle className="w-5 h-5 mr-3" />
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
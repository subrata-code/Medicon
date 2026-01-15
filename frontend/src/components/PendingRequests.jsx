// src/components/PendingRequests.jsx
import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Filter,
  Search,
} from "lucide-react";

const PendingRequests = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Static data for requests
  const requestsData = [
    {
      id: 1,
      type: "Appointment Request",
      doctor: "Dr. Sarah Johnson",
      date: "2024-03-25",
      time: "10:00 AM",
      status: "pending",
      message: "Request for general checkup",
    },
    {
      id: 2,
      type: "Prescription Refill",
      doctor: "Dr. Michael Chen",
      date: "2024-03-24",
      time: "2:30 PM",
      status: "approved",
      message: "Request for blood pressure medication",
    },
    {
      id: 3,
      type: "Lab Results",
      doctor: "Dr. Emily Brown",
      date: "2024-03-23",
      time: "11:00 AM",
      status: "rejected",
      message: "Request for blood test results",
    },
  ];

  const [requests, setRequests] = useState(requestsData);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call with setTimeout
    setTimeout(() => {
      setRequests(requestsData);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
        <h2 className="text-xl font-semibold">Pending Requests</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`text-gray-600 ${isLoading ? "animate-spin" : ""}`}
              size={20}
            />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {request.doctor.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{request.type}</h3>
                <p className="text-sm text-gray-500">{request.doctor}</p>
                <p className="text-sm text-gray-500 mt-1">{request.message}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date(request.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">{request.time}</p>
              </div>
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(
                  request.status
                )}`}
              >
                {getStatusIcon(request.status)}
                <span className="text-sm font-medium capitalize">
                  {request.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No requests found</p>
        </div>
      )}
    </div>
  );
};

export default PendingRequests;
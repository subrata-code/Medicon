import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  FileText,
  Activity,
  Heart,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

const DashboardStats = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState([]);
  // Simulate real-time health updates in demo mode
  useEffect(() => {
    if (!user || !user._id) {
      return;
    }
    const interval = setInterval(() => {
      setHealthMetrics((prevMetrics) =>
        prevMetrics.map((metric) => {
          if (metric.title === "Heart Rate" && typeof metric.value === "number") {
            const next = Math.max(60, Math.min(100, metric.value + (Math.random() > 0.5 ? 1 : -1)));
            return { ...metric, value: next, status: "Normal" };
          }
          if (metric.title === "SPO2" && typeof metric.value === "number") {
            const next = Math.max(95, Math.min(100, metric.value + (Math.random() > 0.5 ? 1 : -1)));
            return { ...metric, value: next, status: "Healthy" };
          }
          return metric;
        })
      );
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [user]);

  // Initial data setup
  useEffect(() => {
    if (!user) return;

    const newStatsData = [
      {
        title: "Upcoming Appointments",
        value: user.upcomingAppointment || 0,
        icon: Calendar,
        color: "blue",
      },
      {
        title: "Completed Appointments",
        value: user.completedAppointments || 0,
        icon: Clock,
        color: "green",
      },
      {
        title: "Medical Records",
        value: user.medicalRecords || 0,
        icon: FileText,
        color: "orange",
      },
      {
        title: "Health Band",
        value: user.iotDevices ? "Connected" : "Not Available",
        icon: User,
        color: "white",
        bg: "bg-blue-500",
        text: "text-white",
      },
    ];
    setStats(newStatsData);

    const newHealthMetricsData = [
      {
        title: "Blood Pressure",
        value: {
          systolic: user.bloodPressure?.systolic || "Not Available",
          diastolic: user.bloodPressure?.diastolic || "Not Available",
        },
        unit: "mmHg",
        icon: Activity,
        color: "blue",
        status:
          !user.bloodPressure ||
          user.bloodPressure.systolic === "Not Available" ||
          user.bloodPressure.diastolic === "Not Available"
            ? "Not Available"
            : user.bloodPressure.systolic >= 90 &&
              user.bloodPressure.systolic <= 120 &&
              user.bloodPressure.diastolic >= 60 &&
              user.bloodPressure.diastolic <= 80
            ? "Normal"
            : "Abnormal",
      },
      {
        title: "Heart Rate",
        value: user.heartRate || "Not Available",
        unit: "bpm",
        icon: Heart,
        color: "red",
        status:
          user.heartRate >= 60 && user.heartRate <= 100 ? "Normal" : "Abnormal",
      },
      {
        title: "SPO2",
        value: user.spo2 || "Not Available",
        unit: "%",
        icon: TrendingUp,
        color: "green",
        status: user.spo2 >= 95 ? "Healthy" : "Low",
      },
    ];
    setHealthMetrics(newHealthMetricsData);
  }, [user]);

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
      },
      green: {
        bg: "bg-green-50",
        text: "text-green-600",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
      },
      orange: {
        bg: "bg-orange-50",
        text: "text-orange-600",
      },
      red: {
        bg: "bg-red-50",
        text: "text-red-600",
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // If you want to fetch fresh data on refresh, you can add an API call here
      // For example:
      // const response = await fetch(`/api/health-data/${user._id}`);
      // const data = await response.json();
      // Update your state with the fresh data

      // Simulating refresh for now
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to refresh data:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats &&
          stats.map((stat, index) => {
            const colorClasses = getColorClasses(stat.color);
            return (
              <div
                key={index}
                className={`rounded-xl cursor-pointer shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${
                  stat.bg
                    ? stat.bg
                    : "bg-white" && stat.text
                    ? stat.text
                    : "text-black"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClasses.bg}`}>
                    <stat.icon className={colorClasses.text} size={24} />
                  </div>
                </div>
                <h3
                  className={`${
                    stat.text ? stat.text : "text-gray-500"
                  } text-sm mb-1`}
                >
                  {stat.title}
                </h3>
                <p
                  className={`text-2xl font-bold  ${
                    stat.text ? stat.text : "text-gray-800"
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            );
          })}
      </div>

      {/* Health Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Health Metrics</h2>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`text-gray-600 ${isLoading ? "animate-spin" : ""}`}
              size={20}
            />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthMetrics &&
            healthMetrics.map((metric, index) => {
              const colorClasses = getColorClasses(metric.color);
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                      <metric.icon className={colorClasses.text} size={20} />
                    </div>
                    <h3 className="text-gray-700 font-medium">
                      {metric.title}
                    </h3>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-gray-800">
                      {metric.title === "Blood Pressure"
                        ? `${metric.value.systolic}/${metric.value.diastolic}`
                        : metric.value}
                    </p>
                    <span className="text-gray-500">{metric.unit}</span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        metric.status === "Normal" ||
                        metric.status === "Healthy"
                          ? "bg-green-100 text-green-800"
                          : metric.status === "Not Available"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {metric.status}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
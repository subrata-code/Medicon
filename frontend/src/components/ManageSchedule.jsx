// src/components/ManageSchedule.jsx
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

const ManageSchedule = ({ doctorId }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const doctorToken = localStorage.getItem("doctortoken");

  const defaultSchedule = () => {
    setSchedules(
      days.map((day) => ({
        day,
        enabled: true,
        slots: [{ start: "09:00", end: "17:00" }],
      }))
    );
  };

  const addTimeSlot = (day) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.day === day
          ? {
              ...schedule,
              slots: [...schedule.slots, { start: "09:00", end: "17:00" }],
            }
          : schedule
      )
    );
  };

  const removeTimeSlot = (day, index) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.day === day
          ? {
              ...schedule,
              slots: schedule.slots.filter((_, i) => i !== index),
            }
          : schedule
      )
    );
  };

  useEffect(() => {
    if (doctorId) {
      getSchedule(doctorId);
    } else {
      defaultSchedule();
    }
  }, [doctorId]);

  const handleSave = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/updateSchedule",
        { schedules },
        {
          headers: {
            Authorization: `Bearer ${doctorToken}`,
          },
        }
      );

      if (response.data && response.data.status === "Success") {
        toast.success("Schedule Updated Successfully");
        getSchedule(doctorId);
        toast.success("Schedule Reloaded");
      } else {
        toast.error("Failed to update schedule");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update schedule");
    }
  };

  const getSchedule = async (doctorId) => {
    try {
      setIsLoading(true);
      console.log("Fetching schedule for doctor:", doctorId);

      const response = await axiosInstance.get(
        `/api/v1/getSchedule/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${doctorToken}`,
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data && response.data.status === "Success") {
        let scheduleData;

        if (response.data.data && response.data.data.schedules) {
          // Case where schedules is within the data object
          scheduleData = response.data.data.schedules;
        } else if (response.data.data) {
          // Check if data itself could be the schedules array
          scheduleData = response.data.data;
        } else {
          console.error("No valid schedule data found in response");
          defaultSchedule();
          setIsLoading(false);
          toast.info("No schedule found, using default");
          return;
        }

        // Ensure scheduleData is an array before proceeding
        if (!Array.isArray(scheduleData)) {
          const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
          if (typeof scheduleData === "object") {
            // Convert object format to array format if needed
            const scheduleArray = [];
            for (const day of days) {
              if (scheduleData[day]) {
                scheduleArray.push({
                  day: day,
                  enabled: scheduleData[day].enabled || false,
                  slots: scheduleData[day].slots || [],
                });
              } else {
                scheduleArray.push({
                  day: day,
                  enabled: false,
                  slots: [{ start: "09:00", end: "17:00" }],
                });
              }
            }
            scheduleData = scheduleArray;
          } else {
            console.error(
              "Schedule data is not in a usable format:",
              scheduleData
            );
            defaultSchedule();
            setIsLoading(false);
            toast.error("Invalid schedule data format");
            return;
          }
        }

        // Make sure every expected day is in the schedule
        const formattedSchedules = days.map((day) => {
          const existingDay = scheduleData.find((s) => s.day === day);
          if (existingDay) {
            return {
              day,
              enabled: existingDay.enabled || false,
              slots:
                Array.isArray(existingDay.slots) && existingDay.slots.length > 0
                  ? existingDay.slots
                  : [{ start: "09:00", end: "17:00" }],
            };
          } else {
            return {
              day,
              enabled: false,
              slots: [{ start: "09:00", end: "17:00" }],
            };
          }
        });

        console.log("Formatted schedules:", formattedSchedules);
        setSchedules(formattedSchedules);
        setIsLoading(false);
      } else {
        // If no schedule is found, set default schedule
        defaultSchedule();
        setIsLoading(false);
        toast.info("No schedule found, using default");
      }
    } catch (error) {
      console.error("Error getting schedule:", error);
      defaultSchedule();
      setIsLoading(false);
      toast.error(`Failed to load schedule: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="text-center p-6">Loading schedule...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-blue-500 text-center sm:text-left">
          Manage Weekly Schedule
        </h3>
        <button
          onClick={handleSave}
          className="mt-4 cursor-pointer sm:mt-0 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </div>
      {schedules && schedules.length > 0 ? (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.day} className="bg-zinc-100 p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <p className="text-gray-800 font-medium text-center sm:text-left">
                  {schedule.day}
                </p>
                {/* Slider Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer mt-2 sm:mt-0">
                  <input
                    type="checkbox"
                    checked={schedule.enabled}
                    onChange={(e) =>
                      setSchedules((prev) =>
                        prev.map((s) =>
                          s.day === schedule.day
                            ? { ...s, enabled: e.target.checked }
                            : s
                        )
                      )
                    }
                    className="sr-only peer" // Hide the default checkbox
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors ${
                      schedule.enabled ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-0.6 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        schedule.enabled ? "translate-x-5.5" : "translate-x-0.5"
                      }`}
                    ></div>
                  </div>
                </label>
              </div>
              <div className="space-y-2">
                {schedule.slots &&
                  schedule.slots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) =>
                            setSchedules((prev) =>
                              prev.map((s) =>
                                s.day === schedule.day
                                  ? {
                                      ...s,
                                      slots: s.slots.map((sl, i) =>
                                        i === index
                                          ? { ...sl, start: e.target.value }
                                          : sl
                                      ),
                                    }
                                  : s
                              )
                            )
                          }
                          className="p-2 border border-gray-300 rounded-lg"
                        />
                        <span>to</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) =>
                            setSchedules((prev) =>
                              prev.map((s) =>
                                s.day === schedule.day
                                  ? {
                                      ...s,
                                      slots: s.slots.map((sl, i) =>
                                        i === index
                                          ? { ...sl, end: e.target.value }
                                          : sl
                                      ),
                                    }
                                  : s
                              )
                            )
                          }
                          className="p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <button
                        onClick={() => removeTimeSlot(schedule.day, index)}
                        className="text-red-500 cursor-pointer hover:text-red-700"
                      >
                        <AiOutlineClose />
                      </button>
                    </div>
                  ))}
                <div>
                  <button
                    onClick={() => addTimeSlot(schedule.day)}
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    + Add Slot
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4">
          <p>
            No schedule data available. Click below to create a default
            schedule.
          </p>
          <button
            onClick={defaultSchedule}
            className="mt-4 bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Default Schedule
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageSchedule;
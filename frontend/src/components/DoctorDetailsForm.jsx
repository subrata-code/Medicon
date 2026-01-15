import React, { useState, useEffect } from "react";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

const DoctorDetailsForm = ({ doctorData, refreshData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [details, setDetails] = useState({});

  useEffect(() => {
    // Initialize details when doctorData changes
    if (doctorData) {
      setDetails({
        name: doctorData.name || "",
        address: doctorData.address || "",
        education: doctorData.education || "",
        facts: doctorData.facts || "",
        languages: doctorData.languages || [],
        phonenumber: doctorData.phonenumber || "",
        profilepic: doctorData.profilepic || "",
        registrationId: doctorData.registrationId || "",
        specialization: doctorData.specialization || [],
        consultationFee: doctorData.consultationFee || "",
        experience: doctorData.experience || "",
      });
    }
  }, [doctorData]); // Run this effect when doctorData changes

  if (!doctorData || Object.keys(doctorData).length === 0) {
    return <p>Loading...</p>; // Avoid rendering before data is ready
  }

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for arrays (specialization and languages)
    if (name === "specialization" || name === "languages") {
      // Split the comma-separated string and trim each value
      const valueArray = value.split(",").map(item => item.trim());
      setDetails(prevDetails => ({ ...prevDetails, [name]: valueArray }));
    } else {
      // Regular handling for non-array fields
      setDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    }
  };

  const token = localStorage.getItem("doctortoken");

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting updated details:", details);
      
      const response = await axiosInstance.post(
        "/api/v1/updateDetails",
        details,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Doctor details updated successfully");
        setIsEditing(false);
        
        // Add a small delay before refreshing data to ensure DB operations complete
        setTimeout(() => {
          if (refreshData) {
            console.log("Calling refresh function after update");
            refreshData();
          } else {
            toast.error("Data updated but failed to reload");
          }
        }, 300);
      } else {
        toast.error("Failed to update doctor details");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Error updating doctor details: " + (error.message || "Unknown error"));
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="bg-white p-4 sm:p-6 rounded-lg shadow-md"
    >
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-blue-500">Details</h3>
          <button
            type="button"
            onClick={handleEdit}
            className="text-blue-500 cursor-pointer border border-blue-500 px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors text-sm sm:text-base"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-zinc-100 py-2 px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between rounded text-lg sm:text-lg">
            <label className="!text-blue-500 !font-medium !text-lg">
              Specialization
            </label>
            {isEditing ? (
              <input
                type="text"
                name="specialization"
                value={Array.isArray(details.specialization) ? details.specialization.join(", ") : ""}
                onChange={handleChange}
                className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-gray-800">
                {Array.isArray(details.specialization) ? details.specialization.join(", ") : "Not available"}
              </p>
            )}
          </div>
          <div className="bg-zinc-100 py-2 px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between rounded text-base sm:text-lg">
            <label className="!text-blue-500 !font-medium !text-lg">
              License No.
            </label>
            {isEditing ? (
              <input
                type="text"
                name="registrationId"
                value={details.registrationId || ""}
                onChange={handleChange}
                className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-gray-800">
                {details.registrationId || "Not available"}
              </p>
            )}
          </div>
          <div className="bg-zinc-100 py-2 px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between rounded text-base sm:text-lg">
            <label className="!text-blue-500 !font-medium !text-lg">
              Languages
            </label>
            {isEditing ? (
              <input
                type="text"
                name="languages"
                value={Array.isArray(details.languages) ? details.languages.join(", ") : ""}
                onChange={handleChange}
                className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-gray-800">
                {Array.isArray(details.languages) ? details.languages.join(", ") : "Not available"}
              </p>
            )}
          </div>
          <div className="bg-zinc-100 py-2 px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between rounded text-base sm:text-lg">
            <label className="!text-blue-500 !font-medium !text-lg">
              Education
            </label>
            {isEditing ? (
              <input
                type="text"
                name="education"
                value={details.education || ""}
                onChange={handleChange}
                className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-gray-800">
                {details.education || "Not available"}
              </p>
            )}
          </div>
          <div className="bg-zinc-100 py-2 px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between rounded text-base sm:text-lg">
            <label className="!text-blue-500 !font-medium !text-lg">
              Consultation Fee (₹)
            </label>
            {isEditing ? (
              <input
                type="text"
                name="consultationFee"
                value={details.consultationFee || ""}
                onChange={handleChange}
                className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-gray-800">
                {details.consultationFee || "Not available"}
              </p>
            )}
          </div>
          <div className="bg-zinc-100 py-2 px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between rounded text-base sm:text-lg">
            <label className="!text-blue-500 !font-medium !text-lg">
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={details.address || ""}
                onChange={handleChange}
                className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-gray-800">
                {details.address || "Not available"}
              </p>
            )}
          </div>
          <div className="bg-zinc-100 py-2 px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between rounded text-base sm:text-lg">
            <label className="!text-blue-500 !font-medium !text-lg">
              Experience (Years)
            </label>
            {isEditing ? (
              <input
                type="text"
                name="experience"
                value={details.experience || ""}
                onChange={handleChange}
                className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <p className="text-gray-800">
                {details.experience || "Not available"}
              </p>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <button
          type="submit"
          className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition-colors"
        >
          Save
        </button>
      )}
    </form>
  );
};

export default DoctorDetailsForm;
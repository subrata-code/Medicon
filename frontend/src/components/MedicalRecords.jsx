import React, { useState, useRef, useEffect } from "react";
import { Newspaper, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../libs/axios";

const MedicalRecords = ({ userId, userToken }) => {
  const [files, setFiles] = useState(null);
  const [fileNames, setFileNames] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [value, setValue] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userId && userToken) {
      fetchMedicalRecords();
    }
  }, [userId, userToken]);

  const fetchMedicalRecords = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/get-medical-certificate",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          withCredentials: true,
        }
      );

      console.log(response.data.data);
      setValue(response.data.data);

      if (response.data && response.data.status === "OK") {
        const files = response.data.data?.files || [];
        setRecords(files);
        if (files.length === 0) {
          toast("No records found");
        }
      } else {
        toast.error(response.data?.message || "Failed to fetch records");
      }
    } catch (error) {
      console.error("Error fetching medical records:", error);
      toast.error(
        error.response?.data?.message || "Failed to load medical records"
      );
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);

    // Initialize with original file names
    const names = {};
    Array.from(selectedFiles).forEach((file, index) => {
      names[index] = file.name;
    });
    setFileNames(names);
  };

  const handleNameChange = (index, value) => {
    setFileNames((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files || files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    // Validate all files have names
    const hasEmptyNames = Object.values(fileNames).some((name) => !name.trim());
    if (hasEmptyNames) {
      toast.error("Please provide names for all files");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("userId", userId);

    Array.from(files).forEach((file, index) => {
      formData.append("files", file);
      formData.append("filenames", fileNames[index]);
    });

    try {
      const response = await axiosInstance.post(
        "/api/v1/upload-medical-certificate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
          withCredentials: true,
        }
      );

      if (response.data && response.data.success) {
        toast.success("Medical records uploaded successfully");
        setFiles(null);
        setFileNames({});
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        fetchMedicalRecords();
      } else {
        toast.error(response.data?.message || "Failed to upload files");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload medical records"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      const response = await axiosInstance.delete(
        "/api/v1/delete-medical-certificate",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          data: { fileId },
          withCredentials: true,
        }
      );

      if (response.data && response.data.status === "OK") {
        toast.success("File deleted successfully");
        fetchMedicalRecords();
      } else {
        toast.error(response.data?.message || "Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(error.response?.data?.message || "Failed to delete file");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Selection Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
          <h2 className="text-xl font-bold">Medical Records</h2>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
              accept=".pdf"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="bg-gray-200 text-gray-800 px-4 py-2 w-full sm:w-auto rounded-md hover:bg-gray-300 cursor-pointer"
            >
              Select Files
            </button>
          </div>
        </div>

        {/* File Upload Form */}
        {files && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="font-semibold mb-2">Selected files:</p>
            <div className="space-y-3">
              {Array.from(files).map((file, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  <input
                    type="text"
                    placeholder="Enter certificate name"
                    value={fileNames[index] || ""}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                    required
                  />
                  <span className="text-sm text-gray-600">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`mt-4 w-full cursor-pointer ${
                isLoading ? "bg-blue-400" : "bg-blue-600"
              } text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:hover:bg-blue-400`}
            >
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </div>
        )}

        {/* Display Records */}
        <div className="space-y-4">
          {records.length > 0 ? (
            records.map((record, index) => (
              <div className="bg-gray-50 p-4 rounded-lg" key={index}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-300 text-blue-600 rounded-lg flex items-center justify-center">
                      <Newspaper />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{record.filename}</h3>
                      <p className="text-gray-600">
                        Uploaded on{" "}
                        {new Date(value.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <a
                      href={record.fileURL}
                      download={record.fileName}
                      className="bg-white border border-blue-500 text-blue-500 px-4 py-2 w-full sm:w-auto rounded-md hover:bg-blue-500 hover:text-white transition-colors text-center"
                    >
                      Download
                    </a>
                    <button
                      type="button"
                      onClick={() => deleteFile(record._id)}
                      className="bg-red-600 cursor-pointer px-4 py-2 w-full sm:w-auto text-white rounded-md hover:bg-red-700 transition-colors text-center flex items-center justify-center"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 text-gray-500">
              No medical records uploaded yet.
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default MedicalRecords;

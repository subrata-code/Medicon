import React, { useState, useRef, useEffect } from "react";
import { Newspaper, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const MedicalRecords = ({ userId, userToken }) => {
  const [files, setFiles] = useState(null);
  const [fileNames, setFileNames] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [value, setValue] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userId) {
      fetchMedicalRecords();
    }
  }, [userId, userToken]);

  const fetchMedicalRecords = () => {
    const files = JSON.parse(localStorage.getItem("files")) || [];
    setValue({ createdAt: new Date().toISOString() });
    setRecords(
      files.map((file) => ({
        _id: file.id,
        filename: file.name,
        fileURL: file.url,
      }))
    );
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
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem("files")) || [];
      const newFiles = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        name: fileNames[index],
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toLocaleString(),
      }));
      localStorage.setItem("files", JSON.stringify([...existing, ...newFiles]));
      toast.success("Medical records uploaded successfully");
      setFiles(null);
      setFileNames({});
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchMedicalRecords();
      window.dispatchEvent(new Event("demoDataUpdated"));
      setIsLoading(false);
    }, 500);
  };

  const deleteFile = async (fileId) => {
    const existing = JSON.parse(localStorage.getItem("files")) || [];
    const filtered = existing.filter((file) => file.id !== fileId);
    localStorage.setItem("files", JSON.stringify(filtered));
    toast.success("File deleted successfully");
    fetchMedicalRecords();
    window.dispatchEvent(new Event("demoDataUpdated"));
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

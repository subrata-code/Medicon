import { useState } from "react";
import { axiosInstance } from "../libs/axios";
import { toast } from "react-hot-toast";

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    password: "",
    profileimage: null,
    secNumber: "",
    geoLocation: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Get user's location first
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // Create FormData after getting location
      const form = new FormData();

      // Add all form fields
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phonenumber", formData.phonenumber);
      form.append("password", formData.password);
      form.append("secNumber", formData.secNumber);
      if (formData.profileimage) {
        form.append("profileimage", formData.profileimage);
      }

      // Add location
      form.append(
        "geoLocation",
        `${position.coords.latitude},${position.coords.longitude}`
      );
      form.append("role", "user");

      const response = await axiosInstance.post("/api/v1/signup-user", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        // 201 means created successfully
        console.log("Signup successful");
        window.location.href = "/userLogin";
      } else {
        setError(response.data.message || "Signup Failed");
        console.error("Signup failed:", response.data);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      if (error.name === "GeolocationPositionError") {
        toast.error("Please enable location services to continue");
      } else {
        setError(
          error.response?.data?.message || "An error occurred during signup."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="lg:w-[30%] mt-14 bg-white rounded-lg shadow-lg p-6 sm:p-8 sm:w-[85%] ">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
            User Sign Up
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="phonenumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                id="phonenumber"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                required
                placeholder="Enter your mobile number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="secNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Security Number
              </label>
              <input
                type="text"
                id="secNumber"
                name="secNumber"
                value={formData.secNumber}
                onChange={handleChange}
                required
                placeholder="Enter your secondary contact number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="profilepic"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profile Picture
              </label>
              <input
                type="file"
                id="profilepic"
                name="profileimage"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer flex justify-center py-2.5 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Processing..." : "Sign Up"}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/userLogin"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;

import axios from "axios";
import toast from "react-hot-toast";

// Demo/offline mode: no backend base URL. Kept for compatibility if re-imported.
export const axiosInstance = axios.create({
  baseURL: "",
  withCredentials: false,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      toast.error("Session expired. Please login again");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

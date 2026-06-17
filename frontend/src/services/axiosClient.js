import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:9999/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const storedToken = localStorage.getItem("accessToken");
if (storedToken) {
  axiosClient.defaults.headers.common["Authorization"] =
    `Bearer ${storedToken}`;
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axiosClient.post("/auth/refresh");
        const { accessToken } = refreshResponse.data.data;
        axiosClient.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;

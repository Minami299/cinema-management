import axiosClient from "./axiosClient";

// 1. Quản lý phim
export const movieApi = {
  getAll: () => axiosClient.get("/movies/all"),
  create: (data) => axiosClient.post("/movies", data),
  update: (id, data) => axiosClient.put(`/movies/${id}`, data),
  delete: (id) => axiosClient.delete(`/movies/${id}`),
};

// 2. Quản lý người dùng (Đã gộp vào đây)
export const userApi = {
  getAll: () => axiosClient.get("/users"),
  create: (userData) => axiosClient.post("/users", userData),
  update: (id, userData) => axiosClient.put(`/users/${id}`, userData),
  delete: (id) => axiosClient.delete(`/users/${id}`),
  toggleStatus: (id, isActive) =>
    axiosClient.put(`/users/${id}/status`, { isActive }),
};

// Gom tất cả vào một service chung để export default
const movieService = {
  movies: movieApi,
  users: userApi,
};

export default movieService;

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

// 3. Quản lý suất chiếu
export const showtimeApi = {
  getAll: () => axiosClient.get("/showtimes/all"),
  getByMovie: (movieId) => axiosClient.get(`/showtimes/movie/${movieId}`),
  getByCinema: (cinemaId) => axiosClient.get(`/showtimes/cinema/${cinemaId}`),
  getById: (id) => axiosClient.get(`/showtimes/${id}`),
  create: (data) => axiosClient.post("/showtimes", data),
  update: (id, data) => axiosClient.put(`/showtimes/${id}`, data),
  delete: (id) => axiosClient.delete(`/showtimes/${id}`),
};

// 4. Quản lý rạp
export const cinemaApi = {
  getAll: () => axiosClient.get("/cinemas"),
  getByCity: (city) => axiosClient.get(`/cinemas/city/${city}`),
  getById: (id) => axiosClient.get(`/cinemas/${id}`),
  create: (data) => axiosClient.post("/cinemas", data),
  update: (id, data) => axiosClient.put(`/cinemas/${id}`, data),
  updateStatus: (id, data) => axiosClient.patch(`/cinemas/${id}/status`, data),
  delete: (id) => axiosClient.delete(`/cinemas/${id}`),
};

// 5. Quản lý phòng chiếu
export const roomApi = {
  getAll: () => axiosClient.get("/rooms"),
  getByCinema: (cinemaId) => axiosClient.get(`/rooms/cinema/${cinemaId}`),
  getById: (id) => axiosClient.get(`/rooms/${id}`),
  getSeats: (id) => axiosClient.get(`/rooms/${id}/seats`),
  getCapacity: (id) => axiosClient.get(`/rooms/${id}/capacity`),
  create: (data) => axiosClient.post("/rooms", data),
  update: (id, data) => axiosClient.put(`/rooms/${id}`, data),
  delete: (id) => axiosClient.delete(`/rooms/${id}`),
};

// Gom tất cả vào một service chung để export default
const movieService = {
  movies: movieApi,
  users: userApi,
  showtimes: showtimeApi,
  cinemas: cinemaApi,
  rooms: roomApi,
};

export default movieService;

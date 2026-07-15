import axiosClient from "./axiosClient";

export const getBookings = () => axiosClient.get("/bookings");
export const updateBookingStatus = (id, status) => axiosClient.patch(`/bookings/${id}/status`, { status });
export const getFoodItems = () => axiosClient.get("/food-items");
export const createFoodItem = (data) => axiosClient.post("/food-items", data);
export const updateFoodItem = (id, data) => axiosClient.put(`/food-items/${id}`, data);
export const toggleFoodAvailability = (id) => axiosClient.patch(`/food-items/${id}/availability`);
export const deleteFoodItem = (id) => axiosClient.delete(`/food-items/${id}`);

import api from "./api";

export const getRestaurants = () => api.get("/restaurants");

export const getRestaurantById = (id) => api.get(`/restaurants/${id}`);

export const addRestaurant = (data) => api.post("/restaurants", data);

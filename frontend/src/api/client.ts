import axios from "axios";
import { getToken } from "../utils/storage";

console.log(import.meta.env);

const API = axios.create({
  baseURL:
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : import.meta.env.VITE_API_URL
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
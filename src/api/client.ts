import axios from "axios";
import { getToken } from "../utils/storage";

const API = axios.create({
  baseURL: "https://8w2trh-4000.csb.app", // ✅ YOUR BACKEND URL
});

API.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;

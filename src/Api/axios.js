// src/Api/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://hotel-server-side-sandy.vercel.app",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

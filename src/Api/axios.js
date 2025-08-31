import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://hotel-server-side-beta.vercel.app',  // Ensure the backend URL is correct
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

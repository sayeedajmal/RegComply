import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://regcomply.onrender.com",
});

export default axiosInstance;

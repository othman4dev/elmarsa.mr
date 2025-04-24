import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://34.38.58.55/api" || 'http://34.38.58.55/api';
//console.log(BASE_URL);

export const publicRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

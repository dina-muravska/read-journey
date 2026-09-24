import axios from "axios";

export const nextServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

nextServer.interceptors.request.use((config) => {
  if (typeof document === "undefined") return config;

  const token = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("token="))
    ?.split("=")[1];

  if (token) {
    config.headers.Authorization = `Bearer ${decodeURIComponent(token)}`;
  }

  return config;
});

import axios from "axios";

const api = axios.create({

  baseURL: "http://127.0.0.1:8000", 
});


api.interceptors.request.use((config) => {
  if (config.url && !config.url.endsWith("/")) {
    config.url += "/";
  }
  return config;
});

export default api;
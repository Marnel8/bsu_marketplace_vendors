import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `http://localhost:5000/api/v1/user/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          return instance(originalRequest);
        }
      } catch (err) {
        console.log("Token refresh failed:", err);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;

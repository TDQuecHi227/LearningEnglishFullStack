const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8081";

export const apiCall = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    credentials: "include",
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Có lỗi xảy ra từ máy chủ");
  }

  return data;
};

export const getHomeData = async () => {
  return await apiCall("/home");
};

export const getCourseById = async (id) => {
  return await apiCall(`/courses/${id}`);
};

export const getCourses = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await apiCall(`/courses?${query}`);
};

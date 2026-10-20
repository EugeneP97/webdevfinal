const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const TOKEN_KEY = "token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }
  return data;
}

export const login = async (email, password) => {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
};

export const logout = () => {
  setToken(null);
  return Promise.resolve({ message: "Logged out" });
};

export const getMe = () => request("/auth/me");

export const listCourses = (q = "") =>
  request(`/course${q ? `?q=${encodeURIComponent(q)}` : ""}`);

export const getCourse = (id) => request(`/course/${id}`);

export const createCourse = (course) =>
  request("/course", {
    method: "POST",
    body: JSON.stringify(course),
  });

export const updateCourse = (id, course) =>
  request(`/course/${id}`, {
    method: "PUT",
    body: JSON.stringify(course),
  });

export const deleteCourse = (id) =>
  request(`/course/${id}`, {
    method: "DELETE",
  });

export const enroll = (id) =>
  request(`/course/${id}/enroll`, {
    method: "POST",
  });

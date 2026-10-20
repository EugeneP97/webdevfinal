const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }
  return data;
}

export const login = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const logout = () =>
  request("/auth/logout", {
    method: "POST",
  });

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

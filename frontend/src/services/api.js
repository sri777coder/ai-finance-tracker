// api.js — All API calls in one place
// axios automatically attaches the JWT token to every request

import axios from "axios"

const api = axios.create({ baseURL: "http://localhost:8000" })

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login:    (data) => api.post("/auth/login", data),
}

export const uploadAPI = {
  uploadCSV: (file) => {
    const form = new FormData()
    form.append("file", file)
    return api.post("/upload/csv", form)
  }
}

export const analyticsAPI = {
  getSummary:      () => api.get("/analytics/summary"),
  getTransactions: () => api.get("/analytics/transactions"),
  getAnomalies:    () => api.get("/analytics/anomalies"),
}
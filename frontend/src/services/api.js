import axios from "axios";

const API = axios.create({
  baseURL: process.env.NODE_ENV === "development"
    ? "http://localhost:5001/api"
    : "/api",
});

// Authentication APIs
export const loginUser = (credentials) => API.post("/auth/login", credentials);
export const signupUser = (userData) => API.post("/auth/signup", userData);

// Research APIs
export const fetchResearch = () => API.get("/research");
export const uploadResearch = (researchData) => API.post("/research", researchData);
export const fetchResearchById = (id) => API.get(`/research/${id}`);
export const updateResearch = (id, updateData) => API.put(`/research/${id}`, updateData);
export const deleteResearch = (id, userId) => API.delete(`/research/${id}`, { data: { userId } });
export const voteResearch = (id, voteType, userId) => API.post(`/research/${id}/vote`, { voteType, userId });

// Comment APIs
export const fetchComments = (researchId) => API.get(`/comments/${researchId}`);
export const addComment = (researchId, commentData) => API.post(`/comments/${researchId}`, commentData);
export const voteComment = (commentId, voteType, userId) => API.post(`/comments/${commentId}/vote`, { voteType, userId });

// User APIs
export const fetchUserProfile = (userId) => API.get(`/users/${userId}`);

export default API;
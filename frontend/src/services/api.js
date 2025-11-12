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

// Admin APIs (send X-Admin-Secret header)
const withAdminHeader = (adminSecret) => ({ headers: { 'X-Admin-Secret': adminSecret } });

export const adminGetStats = (adminSecret) => API.get('/admin/stats', withAdminHeader(adminSecret));
export const adminListUsers = (adminSecret) => API.get('/admin/users', withAdminHeader(adminSecret));
export const adminSetUserRole = (userId, role, adminSecret) => API.patch(`/admin/users/${userId}/role`, { role }, withAdminHeader(adminSecret));
export const adminVerifyUser = (userId, isVerified, adminSecret) => API.patch(`/admin/users/${userId}/verify`, { isVerified }, withAdminHeader(adminSecret));

export const adminListResearch = (adminSecret, includeDeleted = true) => API.get(`/admin/research?includeDeleted=${includeDeleted}`, withAdminHeader(adminSecret));
export const adminDeleteResearch = (id, adminSecret) => API.delete(`/admin/research/${id}`, withAdminHeader(adminSecret));
export const adminRestoreResearch = (id, adminSecret) => API.patch(`/admin/research/${id}/restore`, {}, withAdminHeader(adminSecret));

export const adminListComments = (adminSecret, researchId) => API.get(`/admin/comments${researchId ? `?researchId=${researchId}` : ''}`, withAdminHeader(adminSecret));
export const adminDeleteComment = (id, adminSecret) => API.delete(`/admin/comments/${id}`, withAdminHeader(adminSecret));

export default API;
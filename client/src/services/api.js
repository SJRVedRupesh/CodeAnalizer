import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

export const analyzeCppApi = async (code) => {
  const response = await api.post('/analyze/cpp', { code });
  return response.data;
};

export const analyzeSqlApi = async (sql) => {
  const response = await api.post('/analyze/sql', { sql });
  return response.data;
};

export const runCppApi = async (code, input = '') => {
  const response = await api.post('/run/cpp', { code, input });
  return response.data;
};

export const runSqlApi = async (sql) => {
  const response = await api.post('/run/sql', { sql });
  return response.data;
};

export const getSchemasApi = async () => {
  const response = await api.get('/schemas');
  return response.data;
};

export const getTemplatesApi = async () => {
  const response = await api.get('/templates');
  return response.data;
};

export const saveHistoryApi = async (data) => {
  const response = await api.post('/history', data);
  return response.data;
};

export const getHistoryApi = async () => {
  const response = await api.get('/history');
  return response.data;
};

export const checkHealthApi = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;

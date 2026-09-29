import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getHealth = () => axios.get(`${API_URL}/health`);
export const getModelInfo = () => axios.get(`${API_URL}/model-info`);
export const getMetrics = () => axios.get(`${API_URL}/metrics`);
export const getFeatureImportance = () => axios.get(`${API_URL}/feature-importance`);
export const getEdaSummary = () => axios.get(`${API_URL}/eda-summary`);
export const getFeatureMetadata = () => axios.get(`${API_URL}/feature-metadata`);
export const predictRisk = (patientData: any) => axios.post(`${API_URL}/predict`, patientData);

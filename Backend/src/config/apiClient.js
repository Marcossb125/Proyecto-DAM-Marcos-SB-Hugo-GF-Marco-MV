import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const API_BASE_URL = process.env.API_BASE_URL;
let apiToken = null;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export async function authenticateBackend() {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/backend-login`, {
      nickname: process.env.BACKEND_USER,
      password: process.env.BACKEND_PASSWORD,
    });
    apiToken = response.data.token;
    console.log('Successfully authenticated with API REST as middleware user');
    return apiToken;
  } catch (error) {
    console.error('Failed to authenticate with API REST:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`Message: ${error.message}`);
    }
    throw error;
  }
}

apiClient.interceptors.request.use((config) => {
  if (apiToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${apiToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;

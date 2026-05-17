import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const API_BASE_URL = process.env.API_BASE_URL;
let apiToken = null;
let renewalTimer = null;

const RENEWAL_MARGIN_MS = 5 * 60 * 1000; // 5 minutos antes de expirar

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

function scheduleTokenRenewal(token) {
  if (renewalTimer) {
    clearTimeout(renewalTimer);
    renewalTimer = null;
  }

  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));

    if (!payload.exp) {
      console.warn('[Token Renewal] El token no contiene campo exp, no se programará renovación automática.');
      return;
    }

    const expMs = payload.exp * 1000;
    const nowMs = Date.now();
    const msUntilRenewal = expMs - nowMs - RENEWAL_MARGIN_MS;

    if (msUntilRenewal <= 0) {
      console.warn('[Token Renewal] Token próximo a expirar, renovando inmediatamente...');
      authenticateBackend();
      return;
    }

    const renewInMinutes = Math.round(msUntilRenewal / 60000);
    console.log(`[Token Renewal] Renovación programada en ${renewInMinutes} min (5 min antes de expirar).`);

    renewalTimer = setTimeout(async () => {
      console.log('[Token Renewal] Renovando token con backend-login...');
      try {
        await authenticateBackend();
        console.log('[Token Renewal] Token renovado correctamente.');
      } catch (err) {
        console.error('[Token Renewal] Falló la renovación, reintentando en 30s:', err.message);
        renewalTimer = setTimeout(() => authenticateBackend(), 30_000);
      }
    }, msUntilRenewal);

  } catch (err) {
    console.error('[Token Renewal] Error al parsear el token para programar la renovación:', err.message);
  }
}

export async function authenticateBackend() {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/backend-login`, {
      nickname: process.env.BACKEND_USER,
      password: process.env.BACKEND_PASSWORD,
    });
    apiToken = response.data.token;
    console.log('Successfully authenticated with API REST as middleware user');

    scheduleTokenRenewal(apiToken);

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

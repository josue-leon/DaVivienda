import { Configuration } from "../../api-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const API_KEY = import.meta.env.VITE_API_KEY || '';

export const configurationBase = new Configuration({
  basePath: API_BASE_URL,
  apiKey: API_KEY,
  baseOptions: {
    headers: {
      "x-api-key": API_KEY
    }
  }
});
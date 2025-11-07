import { Configuration } from "../../api-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const configurationBase = new Configuration({
  basePath: API_BASE_URL,
  apiKey: "client-api-key-2025",
  baseOptions: {
    headers: {
      "x-api-key": "client-api-key-2025"
    }
  }
});
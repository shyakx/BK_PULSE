import { config } from '../config/environment.js';

const DEFAULT_MODEL_API = 'http://localhost:8000';

export async function scoreCustomer(featureVector) {
  const baseUrl = config.modelApiUrl || DEFAULT_MODEL_API;
  const res = await fetch(`${baseUrl}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ features: featureVector })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Model API error ${res.status}: ${text}`);
  }
  return res.json(); // { churn_probability, risk, top_drivers, recommendations }
}

export async function getModelStatus() {
  const baseUrl = config.modelApiUrl || DEFAULT_MODEL_API;
  const res = await fetch(`${baseUrl}/status`);
  if (!res.ok) throw new Error('Model status error');
  return res.json();
}



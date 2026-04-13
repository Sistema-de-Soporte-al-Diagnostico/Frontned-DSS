import httpClient from './httpClient';

export async function createPatient(payload) {
  const response = await httpClient.post('/pacientes/', payload);
  return response.data;
}

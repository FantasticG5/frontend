import { apiGet, endpoints } from '../components/http';

export async function getMe() {
  return apiGet(`${endpoints.IDENTITY}/auth/me`);
}

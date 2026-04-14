import { identityClient } from './client';

export const authApi = {
  login: (data: any) => identityClient.post('/api/login', data),
  register: (data: any) => identityClient.post('/api/register', data, {
    headers: { 'User-Agent': 'baniya.store.web/1.0.0' }
  }),
  getAccessToken: () => identityClient.get('/api/accessToken'),
  getUser: (id: string) => identityClient.get(`/api/users/${id}`),
};

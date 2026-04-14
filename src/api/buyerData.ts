import { buyerDataClient } from './client';

export const buyerDataApi = {
  // Elastic
  getDomains: (sortOrder = 'desc') => buyerDataClient.get(`/api/domains`, { params: { sortOrder } }),
  getCategories: (domain: string, sortOrder = 'desc') => buyerDataClient.get(`/api/domains/${domain}/categories`, { params: { domain, sortOrder } }),
  getItems: (params: any) => buyerDataClient.get('/api/items', { params }),
  getItem: (id: string) => buyerDataClient.get(`/api/items/${id}`),
  search: (params: any) => buyerDataClient.get('/api/search', { params }),
  getProviders: (params: any) => buyerDataClient.get('/api/providers', { params }),
  
  // Carts
  getCarts: () => buyerDataClient.get('/api/carts'),
  addToCart: (data: any) => buyerDataClient.post('/api/carts', data),
  
  // OrderAudit
  getOrderAudit: (params: any) => buyerDataClient.get('/api/orderAudit', { params }),
  
  // Payment
  createPayment: (data: any) => buyerDataClient.post('/api/payment', data),
  
  // Orders
  getOrder: (id: string) => buyerDataClient.get(`/api/orders/${id}`),
  getOrders: (params: any) => buyerDataClient.get('/api/orders', { params }),
  
  // Buyers
  addLocation: (data: any) => buyerDataClient.post('/api/locations', data),
  getBuyer: (id: string) => buyerDataClient.get(`/api/buyers/${id}`),
  
  // Issues
  createIssue: (data: any) => buyerDataClient.post('/api/issues', data),
  addIssueComment: (issueId: string, data: any) => buyerDataClient.post(`/api/issues/${issueId}/comments`, data),
  getIssue: (issueId: string) => buyerDataClient.get(`/api/issues/${issueId}`),
  getIssues: (params: any) => buyerDataClient.get('/api/issues', { params }),
  updateIssue: (issueId: string, data: any) => buyerDataClient.put(`/api/issues/${issueId}`, data),
};

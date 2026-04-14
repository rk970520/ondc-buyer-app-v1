import { buyerAppClient } from './client';

export const buyerAppApi = {
  update: (data: any) => buyerAppClient.post('/update', data),
  issue: (data: any) => buyerAppClient.post('/issue', data),
  getIssueStatus: (issueId: string) => buyerAppClient.get(`/issue_status/${issueId}`),
  select: (data: any) => buyerAppClient.post('/select', data),
  init: (data: any) => buyerAppClient.post('/init', data),
  confirm: (data: any) => buyerAppClient.post('/confirm', data),
  cancel: (data: any) => buyerAppClient.post('/cancel', data),
  rating: (data: any) => buyerAppClient.post('/rating', data),
  getStatus: (orderId: string) => buyerAppClient.get(`/status/${orderId}`),
  track: (orderId: string) => buyerAppClient.get(`/track/${orderId}`),
};

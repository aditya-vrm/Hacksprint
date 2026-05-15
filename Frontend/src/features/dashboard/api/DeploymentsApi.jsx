import axiosInstance from '../../../app/config/axiosInstance';

export const DEPLOYMENTS = [
  { id: 1, project: 'nebula-core', commit: 'f42a9bc', env: 'PRODUCTION', status: 'Success', duration: '2m 45s' },
  { id: 2, project: 'api-gateway', commit: '881c22d', env: 'STAGING', status: 'In Progress', duration: '1m 12s' },
  { id: 3, project: 'auth-service', commit: '99e1a20', env: 'PRODUCTION', status: 'Failed', duration: '45s' },
  { id: 4, project: 'ui-dashboard', commit: '332d1f4', env: 'STAGING', status: 'Success', duration: '3m 20s' },
];

export const fetchDeployments = async () => {
  try {
    const { data } = await axiosInstance.get('/deployments');
    return data;
  } catch {
    return DEPLOYMENTS;
  }
};

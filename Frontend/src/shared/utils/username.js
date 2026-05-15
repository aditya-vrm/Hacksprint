export const formatUsername = (value) => {
  const handle = value.trim().replace(/^@/, '').toLowerCase();
  return handle ? `@${handle}` : '';
};

export const isValidUsername = (value) => {
  const handle = value.trim().replace(/^@/, '');
  return /^[a-z0-9_]{3,20}$/.test(handle);
};

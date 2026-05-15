export const GENDER_OPTIONS = [
  { value: '', label: 'Select gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const GENDER_LABELS = Object.fromEntries(
  GENDER_OPTIONS.filter((o) => o.value).map((o) => [o.value, o.label]),
);

export const formatDisplayDate = (isoDate) => {
  if (!isoDate) return '';
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const profileToForm = (profile) => ({
  name: profile.name || '',
  username: profile.username?.replace(/^@/, '') || '',
  email: profile.email || '',
  phone: profile.phone || '',
  dateOfBirth: profile.dateOfBirth || '',
  gender: profile.gender || '',
  avatarUrl: profile.avatarUrl || '',
});

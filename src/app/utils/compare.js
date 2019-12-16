import bcrypt from 'bcryptjs';

export const checkAccessKey = (accessKey, hash) => {
  return bcrypt.compare(accessKey, hash);
};

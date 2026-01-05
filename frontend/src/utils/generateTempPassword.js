// utils\generateTempPassword.js
export const generateTempPassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
  let pwd = "";
  for (let i = 0; i < 10; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
};

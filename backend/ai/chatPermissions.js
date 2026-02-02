// backend/ai/chatPermissions.js
export const canAccessCompany = (user, companyId) => {
  if (!companyId) return true; // allow non-company actions
  if (user.role === "admin") return true;
  return user.company_id === companyId;
};

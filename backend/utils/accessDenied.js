// backend/utils/accessDenied.js
export function accessDenied(res) {
  return res.status(403).json({
    error: "Access denied"
  });
}

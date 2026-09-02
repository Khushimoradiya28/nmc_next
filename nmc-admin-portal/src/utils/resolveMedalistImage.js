// Resolve a gold medalist image path into a browser-loadable URL.
//
// Three kinds of image values can come from the API:
//  1. Absolute URL (http/https)            -> use as-is
//  2. Frontend public asset ("/assets/..") -> lives in the FRONTEND app, so prefix the frontend origin
//  3. Backend uploaded media                -> already returned as a full backend URL via image_url
//
// The frontend origin is configurable via REACT_APP_FRONTEND_URL; falls back to localhost:3000 (dev).
const FRONTEND_URL = (process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');

const resolveMedalistImage = (item) => {
  if (!item) return '';
  const raw = item.image_webp_url || item.image_url || item.image || '';
  if (!raw) return '';

  const val = raw.toString().replace(/\\/g, '/');
  if (/^https?:\/\//i.test(val)) return val;
  if (val.startsWith('/assets/')) return `${FRONTEND_URL}${val}`;
  return val;
};

export default resolveMedalistImage;

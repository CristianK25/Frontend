// Central HTTP client for API calls

export const BASE_URL = 'https://backend-22cs.onrender.com/api';

/**
 * Generic API caller with JWT support, query params, JSON/FormData body,
 * and global error handling. Auth failures are handled silently on public pages
 * and via redirect only on private pages.
 */
export async function llamarApi(
  endpoint,
  method = 'GET',
  data = null,
  requiresAuth = true,
  queryParams = null,
  customHeaders = null
) {
  try {
    // Build URL with optional query params
    let url = `${BASE_URL}${endpoint}`;
    if (queryParams && typeof queryParams === 'object') {
      const query = new URLSearchParams(queryParams).toString();
      if (query) url += `?${query}`;
    }

    const headers = customHeaders ? { ...customHeaders } : { 'Content-Type': 'application/json' };

    // Auth header when required
    if (requiresAuth) {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        const err = new Error('NO_AUTH_TOKEN');
        err.code = 'NO_AUTH_TOKEN';
        throw err;
      }
    }

    const config = { method, headers };

    // Body for methods allowing it
    const methodAllowsBody = ['POST', 'PUT', 'PATCH'].includes(String(method).toUpperCase());
    if (data && methodAllowsBody) {
      if (data instanceof FormData) {
        delete headers['Content-Type'];
        config.body = data;
      } else {
        config.body = JSON.stringify(data);
      }
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await safeJsonParse(response);
      const message =
        errorData?.message ||
        errorData?.error ||
        `Error ${response.status}: ${response.statusText}`;

      if (response.status === 401) {
        handleUnauthorized();
      }

      const e = new Error(message);
      e.status = response.status;
      throw e;
    }

    if (response.status === 204) return null;
    return await safeJsonParse(response);
  } catch (error) {
    handleApiError(error, endpoint);
    throw error;
  }
}

async function safeJsonParse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function redirectToLogin() {
  const currentPage = (typeof window !== 'undefined' && window.location && window.location.pathname) || '';
  if (currentPage.endsWith('/index.html') || currentPage === '/' || currentPage.includes('login')) {
    return;
  }
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user_roles');
  window.location.href = '/index.html';
}

function isPrivatePage() {
  try {
    const path = (window.location && window.location.pathname) || '';
    return /(?:\/|^)(perfil|admin|checkout)/i.test(path);
  } catch {
    return false;
  }
}

function isPublicPage() {
  return !isPrivatePage();
}

function handleApiError(error, endpoint) {
  if (error?.code === 'NO_AUTH_TOKEN' || error?.message === 'NO_AUTH_TOKEN') {
    return;
  }
  if (isPublicPage()) {
    console.warn(`API error (página pública) ${endpoint}:`, error?.message || error);
    return;
  }
  console.error(`🔴 Error en endpoint ${endpoint}:`, error);
  if (typeof window !== 'undefined' && typeof window.alert === 'function') {
    alert(error.message || 'Error inesperado al comunicarse con el servidor.');
  }
}

function handleUnauthorized() {
  if (isPrivatePage()) {
    redirectToLogin();
  }
}

export default llamarApi;


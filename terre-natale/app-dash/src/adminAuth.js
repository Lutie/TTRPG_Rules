// Gestion du token admin — stocké en sessionStorage (expire à la fermeture du navigateur)

const SESSION_KEY = 'dash_adminToken';

let _token = sessionStorage.getItem(SESSION_KEY) || null;

export const getAdminToken = () => _token;

export const setAdminToken = (token) => {
  _token = token;
  if (token) sessionStorage.setItem(SESSION_KEY, token);
  else sessionStorage.removeItem(SESSION_KEY);
};

export const clearAdminToken = () => setAdminToken(null);

// Wrapper fetch qui ajoute automatiquement le header Authorization si admin
export const apiFetch = (url, opts = {}) => {
  if (!_token) return fetch(url, opts);
  return fetch(url, {
    ...opts,
    headers: {
      ...(opts.headers || {}),
      Authorization: `Bearer ${_token}`
    }
  });
};

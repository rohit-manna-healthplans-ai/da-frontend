const KEY = "ps_token";

export const tokenStorage = {
  get() {
    return localStorage.getItem(KEY);
  },
  set(token) {
    localStorage.setItem(KEY, token);
  },
  clear() {
    localStorage.removeItem(KEY);
  },
};

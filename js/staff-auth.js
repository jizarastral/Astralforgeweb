/**
 * Staff gate — only Afsal may access the fit-out quote tool.
 * Static-site client gate (not a full server auth). Change password by
 * updating PASSWORD_SHA256 below (SHA-256 hex of the new password).
 */
(function (global) {
  const AUTH_KEY = "af_staff_session_v1";
  const ALLOWED_USER = "afsal";
  // SHA-256 of: Afsal@AF2026
  const PASSWORD_SHA256 =
    "6667333103e0dd279c4a8e06bb69767c9ba78d3c5d2865e443357f15016bbf40";
  const SESSION_HOURS = 12;

  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function readSession() {
    try {
      const raw = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || data.user !== ALLOWED_USER || !data.exp) return null;
      if (Date.now() > data.exp) {
        clearSession();
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  function writeSession(user, remember) {
    const payload = {
      user,
      exp: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
      at: Date.now(),
    };
    const json = JSON.stringify(payload);
    sessionStorage.setItem(AUTH_KEY, json);
    if (remember) localStorage.setItem(AUTH_KEY, json);
    else localStorage.removeItem(AUTH_KEY);
  }

  function clearSession() {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
  }

  function isLoggedIn() {
    return !!readSession();
  }

  async function login(username, password, remember) {
    const user = String(username || "")
      .trim()
      .toLowerCase();
    if (user !== ALLOWED_USER) {
      return { ok: false, error: "Access denied. Only authorised staff can sign in." };
    }
    if (!password) {
      return { ok: false, error: "Enter your password." };
    }
    const hash = await sha256Hex(password);
    if (hash !== PASSWORD_SHA256) {
      return { ok: false, error: "Incorrect password." };
    }
    writeSession(ALLOWED_USER, !!remember);
    return { ok: true, user: ALLOWED_USER };
  }

  function logout() {
    clearSession();
  }

  function currentUser() {
    const s = readSession();
    return s ? s.user : null;
  }

  global.StaffAuth = {
    login,
    logout,
    isLoggedIn,
    currentUser,
    ALLOWED_USER,
  };
})(window);

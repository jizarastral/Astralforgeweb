/**
 * AstralForge frontend config — same-origin when site is served by the API (sleep mode).
 */
(function (global) {
  var meta = typeof document !== "undefined" ? document.querySelector('meta[name="af-api-base"]') : null;
  var metaBase = meta && meta.content ? String(meta.content).trim().replace(/\/$/, "") : "";

  // Priority: explicit global → meta → same origin (empty string = relative /api) → local API
  var base = "";
  if (global.ASTRALFORGE_API_BASE) {
    base = String(global.ASTRALFORGE_API_BASE).replace(/\/$/, "");
  } else if (metaBase) {
    base = metaBase;
  } else if (typeof location !== "undefined") {
    // Sleep mode: site and API share host (Express serves static)
    // Use relative URLs so it works on localhost:8787 AND Azure
    base = "";
  }

  function url(path) {
    if (!path) return base || "";
    if (path.charAt(0) !== "/") path = "/" + path;
    return (base || "") + path;
  }

  async function api(path, options) {
    var opts = options || {};
    var headers = Object.assign(
      { "Content-Type": "application/json", Accept: "application/json" },
      opts.headers || {}
    );
    var res = await fetch(url(path), Object.assign({}, opts, { headers: headers }));
    var data = null;
    try {
      data = await res.json();
    } catch (_) {
      data = null;
    }
    if (!res.ok) {
      var err = new Error((data && data.error) || res.statusText || "Request failed");
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  // Probe: if relative /api/health fails and we're on static host, fall back to local API
  global.AstralForgeConfig = {
    apiBase: base,
    url: url,
    api: api,
    hasApi: true,
    async ensureApi() {
      try {
        await api("/api/health");
        return true;
      } catch (_) {
        if (!base && typeof location !== "undefined" && location.port !== "8787") {
          base = "http://127.0.0.1:8787";
          global.AstralForgeConfig.apiBase = base;
          try {
            await api("/api/health");
            return true;
          } catch (e2) {
            return false;
          }
        }
        return false;
      }
    },
  };
})(window);

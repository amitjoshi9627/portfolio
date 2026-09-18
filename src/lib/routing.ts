export const ROUTE_MAP: Record<string, string> = {
  "/": "opening",
  "/home": "opening",
  "/hero": "opening",
  "/resume": "director",
  "/director": "director",
  "/script": "script",
  "/work": "edit",
  "/edit": "edit",
  "/stack": "system",
  "/system": "system",
  "/behind": "behind",
  "/life": "life",
  "/contact": "final",
  "/final": "final",
};

export const ID_TO_ROUTE: Record<string, string> = {
  "opening": "/",
  "director": "/resume",
  "script": "/script",
  "footage": "/footage",
  "edit": "/work",
  "system": "/stack",
  "behind": "/behind",
  "life": "/life",
  "final": "/contact",
};

export function syncUrl(id: string, replace = true) {
  const route = ID_TO_ROUTE[id] || `/${id}`;
  if (window.location.pathname !== route) {
    if (replace) {
      window.history.replaceState(null, "", route);
    } else {
      window.history.pushState(null, "", route);
    }
  }
}

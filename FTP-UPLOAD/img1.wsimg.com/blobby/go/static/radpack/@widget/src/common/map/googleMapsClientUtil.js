/* eslint-disable no-undef */

const hasGoogleScriptInDom = () =>
  document.querySelectorAll("script[src*='maps.googleapis.com/maps/api/js']")
    .length;

const loadGoogleMapsLibrary = (cb) => {
  if (window.google && window.google.maps && typeof cb === "function")
    return cb();
  if (hasGoogleScriptInDom()) return setTimeout(cb, 2000);

  const googleAPI = document.createElement("script");
  const channel = "gc-widget-contact";
  const url = [
    "https://maps.googleapis.com/maps/api/js",
    "?client=gme-godaddycom",
    `&channel=${channel}`,
  ].join("");
  googleAPI.setAttribute("src", `${url}`);
  googleAPI.setAttribute("async", "async");
  document.body.appendChild(googleAPI);
  googleAPI.onload = cb;
};

export { loadGoogleMapsLibrary };

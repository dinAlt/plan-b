"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieStorage = {
    getItem: function (key) {
        return getCookie(key);
    },
    setItem: function (key, value) {
        setCookie(key, value, 94608000, "/");
    },
};
function getCookie(name) {
    return document.cookie.replace(new RegExp("(?:(?:^|.*;\\s*)" + encodeURIComponent(name) + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1");
}
function setCookie(name, value, expiration, path) {
    if (path === void 0) { path = "/"; }
    var cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; path=" + encodeURIComponent(path) + ";";
    if (expiration) {
        if (typeof expiration === "number") {
            cookie += " max-age=" + expiration;
        }
        else {
            cookie += " expires=" + expiration.toUTCString();
        }
    }
    document.cookie = cookie;
}
//# sourceMappingURL=storage.js.map
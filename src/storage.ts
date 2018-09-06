import { IStorage } from "./types";
export const cookieStorage: IStorage = {
    getItem: (key) => {
        return getCookie(key);
    },
    setItem: (key, value) => {
        setCookie(key, value, 94608000, "/");
    },
};

function getCookie(name: string): string {
    return document.cookie.replace(
        new RegExp(`(?:(?:^|.*;\\s*)${encodeURIComponent(name)}\\s*\\=\\s*([^;]*).*$)|^.*$`), "$1");
}

function setCookie(name: string, value: string, expiration?: Date | number, path: string = "/") {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${encodeURIComponent(path)};`;
    if (expiration) {
        if (typeof expiration === "number") {
            cookie += ` max-age=${expiration}`;
        } else {
            cookie += ` expires=${expiration.toUTCString()}`;
        }
    }
    document.cookie = cookie;
}

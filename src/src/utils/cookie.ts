import Cookies from "js-cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/cookie";

function getCookie(CookieName: string) {
  const cookieValue = Cookies.get(CookieName);

  // Return null if cookie doesn't exist
  if (!cookieValue) {
    return null;
  }

  // Try to parse as JSON, if it fails return the string value
  try {
    return JSON.parse(cookieValue);
  } catch (error) {
    return cookieValue;
  }
}

function setCookie(CookieName: string, CookieValue: any) {
  const strCookieValue =
    typeof CookieValue == "object" ? JSON.stringify(CookieValue) : CookieValue;
  return Cookies.set(CookieName, strCookieValue);
}

function removeCookie(CookieName: string) {
  return Cookies.remove(CookieName);
}

function removeCookieAll() {
  removeCookie(ACCESS_TOKEN);
  removeCookie(REFRESH_TOKEN);
}

export { getCookie, setCookie, removeCookie, removeCookieAll };

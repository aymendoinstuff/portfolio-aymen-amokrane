// src/server/cookies.ts
import "server-only";
import { cookies as nextCookies } from "next/headers";

const isProd = process.env.NODE_ENV === "production";

/** Optional: set only if you need cross-subdomain cookies in prod. */
const ENV_COOKIE_DOMAIN =
  isProd && process.env.COOKIE_DOMAIN?.trim()
    ? process.env.COOKIE_DOMAIN.trim()
    : undefined;

/** Fail fast in prod if the secret is weak/missing. */
(function assertEnv() {
  if (!isProd) return;
  const secret = process.env.SESSION_COOKIE_SECRET || "";
  if (secret.length < 32) {
    console.error(
      "SESSION_COOKIE_SECRET is missing or too short (>=32 chars recommended)."
    );
  }
})();

export const COOKIE = {
  SESSION: process.env.SESSION_COOKIE_NAME?.trim() || "__session",
  PREFERENCES: "prefs",
  FLASH: "flash",
} as const;

export type CookieName = (typeof COOKIE)[keyof typeof COOKIE];

export type CookieAttributes = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
};

export const DEFAULT_ATTRS: CookieAttributes = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax",
  path: "/",
  domain: ENV_COOKIE_DOMAIN, // undefined unless explicitly set via env in prod
};

async function jar() {
  return await nextCookies();
}

export async function getCookie(name: CookieName): Promise<string | undefined> {
  const store = await jar();
  return store.get(name)?.value;
}

export async function setCookie(
  name: CookieName,
  value: string,
  attrs: CookieAttributes = {}
) {
  const store = await jar();
  const opts: CookieAttributes = {
    ...DEFAULT_ATTRS,
    ...attrs,
    domain: attrs.domain ?? DEFAULT_ATTRS.domain,
  };
  // If SameSite=None is requested, force secure per spec.
  if (opts.sameSite === "none") opts.secure = true;
  store.set(name, value, opts);
}

export async function deleteCookie(
  name: CookieName,
  attrs: CookieAttributes = {}
) {
  const store = await jar();
  const opts: CookieAttributes = {
    ...DEFAULT_ATTRS,
    ...attrs,
    domain: attrs.domain ?? DEFAULT_ATTRS.domain,
  };
  store.delete({ name, path: opts.path, domain: opts.domain });
}

export async function setJSONCookie<T>(
  name: CookieName,
  data: T,
  attrs: CookieAttributes = {}
) {
  await setCookie(name, JSON.stringify(data), {
    ...attrs,
    httpOnly: attrs.httpOnly ?? true,
  });
}

export async function getJSONCookie<T>(
  name: CookieName
): Promise<T | undefined> {
  const raw = await getCookie(name);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export async function popFlash<T = unknown>(): Promise<T | undefined> {
  const store = await jar();
  const raw = store.get(COOKIE.FLASH)?.value;
  if (raw) {
    store.delete({
      name: COOKIE.FLASH,
      path: DEFAULT_ATTRS.path,
      domain: DEFAULT_ATTRS.domain,
    });
  }
  return raw ? (JSON.parse(raw) as T) : undefined;
}

export async function setSessionCookie(value: string, maxAgeSeconds: number) {
  await setCookie(COOKIE.SESSION, value, {
    httpOnly: true,
    maxAge: maxAgeSeconds,
    sameSite: "lax",
  });
}

export async function clearSessionCookie() {
  await deleteCookie(COOKIE.SESSION);
}

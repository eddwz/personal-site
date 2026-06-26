const API_BASE = "https://health.googleapis.com/v4";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export const GOOGLE_HEALTH_SCOPES = [
  "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
  "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
  "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
];

// Global cache for serverless environment
let globalAccessToken: string | null = null;

export function hasGoogleHealth() {
  return Boolean(
    process.env.GOOGLE_HEALTH_CLIENT_ID &&
      process.env.GOOGLE_HEALTH_CLIENT_SECRET &&
      process.env.GOOGLE_HEALTH_REFRESH_TOKEN
  );
}

export function redirectUri(baseUri: string) {
  if (process.env.GOOGLE_HEALTH_REDIRECT_URI) {
    return process.env.GOOGLE_HEALTH_REDIRECT_URI;
  }
  return `${baseUri}/api/auth/google/callback`;
}

export function consentUrl(uri: string) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_HEALTH_CLIENT_ID || "",
    redirect_uri: uri,
    response_type: "code",
    scope: GOOGLE_HEALTH_SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
  });
  return `${AUTH_URL}?${params.toString()}`;
}

async function refreshAccessToken() {
  const refreshToken = process.env.GOOGLE_HEALTH_REFRESH_TOKEN;
  if (!refreshToken) throw new Error("No Google Health refresh token configured.");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_HEALTH_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_HEALTH_CLIENT_SECRET || "",
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Google token refresh failed: ${res.status} ${detail}`);
  }

  const data = await res.json();
  globalAccessToken = data.access_token;
  return globalAccessToken;
}

export async function exchangeCodeForTokens(code: string, uri: string) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_HEALTH_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_HEALTH_CLIENT_SECRET || "",
      redirect_uri: uri,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Code exchange failed: ${res.status} ${detail}`);
  }

  const data = await res.json();
  return data;
}

export async function ghGet(path: string) {
  if (!globalAccessToken) await refreshAccessToken();

  const doFetch = (token: string) =>
    fetch(`${API_BASE}${path}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });

  let res = await doFetch(globalAccessToken!);
  if (res.status === 401) {
    await refreshAccessToken();
    res = await doFetch(globalAccessToken!);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const err: any = new Error(`Google Health GET ${path} -> ${res.status} ${detail}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function listAllDataPoints(dataTypeKebab: string, filter?: string, pageSize?: number) {
  const out: any[] = [];
  let pageToken: string | null = null;
  do {
    const params = new URLSearchParams();
    if (filter) params.set("filter", filter);
    if (pageSize) params.set("pageSize", String(pageSize));
    if (pageToken) params.set("pageToken", pageToken);
    
    const data = await ghGet(
      `/users/me/dataTypes/${dataTypeKebab}/dataPoints?${params.toString()}`
    );
    
    if (Array.isArray(data.dataPoints)) out.push(...data.dataPoints);
    pageToken = data.nextPageToken || null;
  } while (pageToken);
  
  return out;
}

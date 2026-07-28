type RequestQueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean | null | undefined>;

type RequestQuery = Record<string, RequestQueryValue>;

type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  baseURL?: string;
  data?: unknown;
  headers?: HeadersInit;
  params?: RequestQuery;
  parseAs?: "json" | "text" | "response";
  requiresAuth?: boolean;
  token?: string | null;
  timeoutMs?: number;
};

type ErrorPayload = {
  code?: string;
  message?: string;
  error?: {
    message?: string;
  };
  details?: string[];
  requestId?: string;
};

const ACCESS_TOKEN_STORAGE_KEY = "auth.accessToken";
const DEFAULT_TIMEOUT_MS = 15000;

export class RequestError extends Error {
  status: number;
  code?: string;
  details?: string[];
  requestId?: string;

  constructor(
    message: string,
    options: {
      status: number;
      code?: string;
      details?: string[];
      requestId?: string;
    },
  ) {
    super(message);
    this.name = "RequestError";
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
    this.requestId = options.requestId;
  }
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function getStorage() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    // Safari 隐私模式或浏览器禁用存储时会抛出 SecurityError
    return null;
  }
}

export function getAccessToken() {
  return getStorage()?.getItem(ACCESS_TOKEN_STORAGE_KEY) || "";
}

export function setAccessToken(token: string) {
  const storage = getStorage();
  if (!storage) return;

  if (token.trim()) {
    storage.setItem(ACCESS_TOKEN_STORAGE_KEY, token.trim());
    return;
  }

  storage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function clearAccessToken() {
  getStorage()?.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function getApiBaseUrl() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "/api";
  return trimTrailingSlash(baseUrl);
}

function appendQuery(url: string, params?: RequestQuery) {
  if (!params) return url;

  const target = new URL(url, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === undefined || item === null || item === "") return;
        target.searchParams.append(key, String(item));
      });
      return;
    }

    target.searchParams.set(key, String(value));
  });

  if (isAbsoluteUrl(url)) {
    return target.toString();
  }

  return `${target.pathname}${target.search}${target.hash}`;
}

function buildRequestUrl(path: string, baseURL?: string) {
  if (isAbsoluteUrl(path)) return path;

  const resolvedBaseUrl = trimTrailingSlash(baseURL || getApiBaseUrl());
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${resolvedBaseUrl}${normalizedPath}`;
}

function createAbortSignal(
  signal?: AbortSignal | null,
  timeoutMs = DEFAULT_TIMEOUT_MS,
) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  if (signal) {
    if (signal.aborted) controller.abort();
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  return {
    signal: controller.signal,
    cleanup: () => window.clearTimeout(timeoutId),
  };
}

function createHeaders(headers?: HeadersInit, data?: unknown, token?: string) {
  const resolvedHeaders = new Headers(headers);

  if (!resolvedHeaders.has("Accept")) {
    resolvedHeaders.set("Accept", "application/json");
  }

  if (token && !resolvedHeaders.has("Authorization")) {
    resolvedHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (
    data !== undefined &&
    data !== null &&
    !(data instanceof FormData) &&
    !(data instanceof URLSearchParams) &&
    !(data instanceof Blob) &&
    typeof data !== "string" &&
    !resolvedHeaders.has("Content-Type")
  ) {
    resolvedHeaders.set("Content-Type", "application/json");
  }

  return resolvedHeaders;
}

function createRequestBody(data: unknown) {
  if (
    data === undefined ||
    data === null ||
    data instanceof FormData ||
    data instanceof URLSearchParams ||
    data instanceof Blob ||
    typeof data === "string"
  ) {
    return data;
  }

  return JSON.stringify(data);
}

async function parseResponseBody(response: Response) {
  if (response.status === 204) return undefined;

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as unknown;
  }

  return await response.text();
}

function normalizeErrorMessage(status: number, payload: unknown) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const data = payload as ErrorPayload;
    const message = data.message || data.error?.message;
    if (message) return message;
  }

  return `请求失败（${status}）`;
}

function toRequestError(status: number, payload: unknown) {
  const data =
    payload && typeof payload === "object" ? (payload as ErrorPayload) : null;

  return new RequestError(normalizeErrorMessage(status, payload), {
    status,
    code: data?.code,
    details: data?.details,
    requestId: data?.requestId,
  });
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    baseURL,
    data,
    headers,
    params,
    parseAs = "json",
    requiresAuth = false,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    token,
    signal,
    ...rest
  } = options;

  const resolvedToken = token ?? (requiresAuth ? getAccessToken() : "");
  const url = appendQuery(buildRequestUrl(path, baseURL), params);
  const abortController = createAbortSignal(signal, timeoutMs);

  try {
    const response = await fetch(url, {
      ...rest,
      headers: createHeaders(headers, data, resolvedToken || undefined),
      body: createRequestBody(data),
      signal: abortController.signal,
    });
    const payload = await parseResponseBody(response);

    if (response.status === 401) {
      clearAccessToken();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }
    }

    if (!response.ok) {
      throw toRequestError(response.status, payload);
    }

    if (parseAs === "response") {
      return response as T;
    }

    if (parseAs === "text") {
      return String(payload ?? "") as T;
    }

    return payload as T;
  } catch (error) {
    if (error instanceof RequestError) throw error;

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("请求超时，请稍后重试。");
    }

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("网络连接失败，请检查服务是否已启动。");
    }

    throw error instanceof Error ? error : new Error("请求失败");
  } finally {
    abortController.cleanup();
  }
}

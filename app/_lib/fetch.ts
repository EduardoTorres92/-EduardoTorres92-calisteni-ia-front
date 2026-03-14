import { cookies } from "next/headers";

const getBody = <T>(c: Response | Request): Promise<T> => {
  return c.json() as Promise<T>;
};

const getUrl = (contextUrl: string): string => {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  const path = contextUrl.startsWith("/") ? contextUrl : `/${contextUrl}`;
  return base ? `${base}${path}` : `http://127.0.0.1:8000${path}`;
};

const getHeaders = async (headers?: HeadersInit): Promise<HeadersInit> => {
  const _cookies = await cookies();
  return {
    ...headers,
    cookie: _cookies.toString(),
  };
};

export const customFetch = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  const requestUrl = getUrl(url);
  const requestHeaders = await getHeaders(options.headers);

  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders,
    credentials: "include",
    cache: "no-store",
  };

  const response = await fetch(requestUrl, requestInit);

  if (!response.ok) {
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      data = { error: response.statusText || "Service Unavailable", code: "HTTP_ERROR" };
    }
    return { status: response.status, data, headers: response.headers } as T;
  }

  const data = await getBody<T>(response);
  return { status: response.status, data, headers: response.headers } as T;
};


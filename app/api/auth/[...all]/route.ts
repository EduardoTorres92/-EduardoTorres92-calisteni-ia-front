import { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

async function handler(request: NextRequest) {
  const url = new URL(request.url);
  const targetPath = url.pathname;
  const targetUrl = `${API_URL}${targetPath}${url.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  });

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method !== "GET" && request.method !== "HEAD"
      ? await request.text()
      : undefined,
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  response.headers.forEach((value, key) => {
    responseHeaders.append(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export const GET = handler;
export const POST = handler;

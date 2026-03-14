import { cookies } from "next/headers";

export async function getServerSession() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    if (!apiUrl) return null;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const response = await fetch(`${apiUrl}/api/auth/get-session`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const session = (await response.json()) as { user?: unknown } | null;
    return session?.user ? session : null;
  } catch {
    return null;
  }
}

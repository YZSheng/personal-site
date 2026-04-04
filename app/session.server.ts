import { createCookieSessionStorage, redirect } from "@remix-run/node";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__admin_session",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      secrets: [process.env.SESSION_SECRET!],
    },
  });

export { getSession, commitSession, destroySession };

export async function requireAdminSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.get("isAdmin")) throw redirect("/admin/login");
  return session;
}

export async function createAdminSession(redirectTo: string) {
  const session = await getSession();
  session.set("isAdmin", true);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

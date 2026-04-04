import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { getSession, destroySession } from "~/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/admin/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}

export async function loader() {
  return redirect("/admin/login");
}

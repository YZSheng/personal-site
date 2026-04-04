import { json, type ActionFunctionArgs } from "@remix-run/node";
import { requireAdminSession } from "~/session.server";
import { parseMarkdownWithHighlight } from "~/utils/markdown.server";

export async function action({ request }: ActionFunctionArgs) {
  await requireAdminSession(request);
  const form = await request.formData();
  const content = (form.get("content") as string) ?? "";
  const html = parseMarkdownWithHighlight(content);
  return json({ html }, { headers: { "Cache-Control": "no-store" } });
}

export async function loader() {
  return json({ error: "Method not allowed" }, { status: 405 });
}

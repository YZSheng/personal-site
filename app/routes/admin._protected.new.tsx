import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { requireAdminSession } from "~/session.server";
import { createBlog } from "~/services/blogs.server";
import AdminPostEditor from "~/components/AdminPostEditor";
import styles from "highlight.js/styles/atom-one-dark-reasonable.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdminSession(request);
  return json({}, { headers: { "Cache-Control": "no-store" } });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdminSession(request);
  const form = await request.formData();

  const title = form.get("title") as string;
  const slug = form.get("slug") as string;
  const content = form.get("content") as string;
  const published = form.get("published") === "true";

  if (!title || !slug || !content) {
    return json({ error: "Title, slug, and content are required." }, { status: 400 });
  }

  try {
    const post = await createBlog({ title, slug, content, published });
    return redirect(`/admin/${post.id}/edit`);
  } catch (err: unknown) {
    const message =
      err instanceof Error && err.message.includes("Unique constraint")
        ? "A post with that slug already exists."
        : "Failed to create post.";
    return json({ error: message }, { status: 400 });
  }
}

export default function NewPost() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        New Post
      </h1>
      {actionData?.error && (
        <p className="mb-4 text-red-600 dark:text-red-400 text-sm">
          {actionData.error}
        </p>
      )}
      <Form method="post">
        <AdminPostEditor />
      </Form>
    </div>
  );
}

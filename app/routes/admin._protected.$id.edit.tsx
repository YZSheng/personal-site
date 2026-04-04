import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { requireAdminSession } from "~/session.server";
import { getAdminBlogById, updateBlog } from "~/services/blogs.server";
import AdminPostEditor from "~/components/AdminPostEditor";
import styles from "highlight.js/styles/atom-one-dark-reasonable.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireAdminSession(request);
  const post = await getAdminBlogById(params.id!);
  return json({ post }, { headers: { "Cache-Control": "no-store" } });
}

export async function action({ request, params }: ActionFunctionArgs) {
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
    await updateBlog(params.id!, { title, slug, content, published });
    return redirect("/admin");
  } catch (err: unknown) {
    const message =
      err instanceof Error && err.message.includes("Unique constraint")
        ? "A post with that slug already exists."
        : "Failed to update post.";
    return json({ error: message }, { status: 400 });
  }
}

export default function EditPost() {
  const { post } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Edit Post
      </h1>
      {actionData?.error && (
        <p className="mb-4 text-red-600 dark:text-red-400 text-sm">
          {actionData.error}
        </p>
      )}
      <Form method="post">
        <AdminPostEditor
          defaultTitle={post.title}
          defaultSlug={post.slug}
          defaultContent={post.content}
          defaultPublished={post.published}
        />
      </Form>
    </div>
  );
}

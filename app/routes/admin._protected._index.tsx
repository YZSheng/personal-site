import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { requireAdminSession } from "~/session.server";
import { getAdminBlogList, deleteBlog, togglePublish } from "~/services/blogs.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdminSession(request);
  const posts = await getAdminBlogList();
  return json({ posts }, { headers: { "Cache-Control": "no-store" } });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdminSession(request);
  const form = await request.formData();
  const _action = form.get("_action") as string;
  const id = form.get("id") as string;

  if (_action === "delete") {
    await deleteBlog(id);
  } else if (_action === "togglePublish") {
    const published = form.get("published") === "true";
    await togglePublish(id, !published);
  }

  return redirect("/admin");
}

export default function AdminDashboard() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          All Posts
        </h1>
        <Link
          to="/admin/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {post.title}
                  </span>
                  {post.published ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  /blog/{post.slug}
                </p>
              </div>

              <div className="flex items-center gap-2 ml-4 shrink-0">
                <Link
                  to={`/admin/${post.id}/edit`}
                  className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-300 dark:border-gray-600 rounded-md transition-colors"
                >
                  Edit
                </Link>

                <Form method="post">
                  <input type="hidden" name="_action" value="togglePublish" />
                  <input type="hidden" name="id" value={post.id} />
                  <input
                    type="hidden"
                    name="published"
                    value={String(post.published)}
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-300 dark:border-gray-600 rounded-md transition-colors"
                  >
                    {post.published ? "Unpublish" : "Publish"}
                  </button>
                </Form>

                <Form
                  method="post"
                  onSubmit={(e) => {
                    if (
                      !window.confirm(
                        `Delete "${post.title}"? This cannot be undone.`
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="_action" value="delete" />
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-300 dark:border-red-700 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </Form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { requireAdminSession } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdminSession(request);
  return json({});
}

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-4">
            <Link
              to="/admin"
              className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Admin
            </Link>
            <Link
              to="/admin/new"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              + New post
            </Link>
          </nav>
          <Form method="post" action="/admin/logout">
            <button
              type="submit"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              Log out
            </button>
          </Form>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

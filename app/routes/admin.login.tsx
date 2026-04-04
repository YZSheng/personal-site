import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { getSession, createAdminSession } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("isAdmin")) return redirect("/admin");
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const password = form.get("password");

  if (password !== process.env.ADMIN_PASSWORD) {
    return json({ error: "Incorrect password" }, { status: 401 });
  }

  return createAdminSession("/admin");
}

export default function AdminLogin() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-sm p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Admin Login
        </h1>
        <Form method="post" className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {actionData?.error && (
            <p className="text-red-600 dark:text-red-400 text-sm">
              {actionData.error}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Log in
          </button>
        </Form>
      </div>
    </div>
  );
}

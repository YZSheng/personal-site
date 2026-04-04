import { useEffect, useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { generateSlug } from "~/utils/slug";

interface AdminPostEditorProps {
  defaultTitle?: string;
  defaultSlug?: string;
  defaultContent?: string;
  defaultPublished?: boolean;
}

export default function AdminPostEditor({
  defaultTitle = "",
  defaultSlug = "",
  defaultContent = "",
  defaultPublished = false,
}: AdminPostEditorProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [slug, setSlug] = useState(defaultSlug);
  const [content, setContent] = useState(defaultContent);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    Boolean(defaultSlug)
  );
  const previewFetcher = useFetcher<{ html: string }>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-generate slug from title unless manually edited
  useEffect(() => {
    if (!slugManuallyEdited) {
      setSlug(generateSlug(title));
    }
  }, [title, slugManuallyEdited]);

  // Debounced preview fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (content.trim()) {
        previewFetcher.submit(
          { content },
          { method: "post", action: "/admin/preview" }
        );
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugManuallyEdited(true);
          }}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Content (Markdown)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <textarea
            id="content"
            name="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={24}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
          <div
            className="prose prose-slate max-w-full dark:prose-invert border border-gray-200 dark:border-gray-700 rounded-md p-4 overflow-auto max-h-[600px] bg-white dark:bg-gray-800"
            dangerouslySetInnerHTML={{
              __html: previewFetcher.data?.html ?? "<p class='text-gray-400'>Preview will appear here…</p>",
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          value="true"
          defaultChecked={defaultPublished}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor="published"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Published
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          name="intent"
          value="save"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}

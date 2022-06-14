import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { mockBlogs } from "test/data";
import { describe, it, expect, vi } from "vitest";
import BlogPage from "./index";

describe("blog index", () => {
  vi.mock("@remix-run/react", async () => {
    const remix: object = await vi.importActual("@remix-run/react");
    return {
      ...remix,
      useLoaderData: vi.fn().mockReturnValue({ blogs: mockBlogs }),
    };
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render blog post", () => {
    render(
      <MemoryRouter>
        <BlogPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Recent Posts")).toBeTruthy();
    expect(screen.getAllByRole("blog-post-link")).toHaveLength(
      mockBlogs.length
    );
    expect(screen.getByText(mockBlogs[0].title)).toBeTruthy();
    expect(screen.getByText(mockBlogs[1].title)).toBeTruthy();
  });
});

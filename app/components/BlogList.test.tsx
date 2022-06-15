import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { aMockBlog } from "test/data";
import BlogList from "./BlogList";

describe("BlogList", () => {
  const blogs = [aMockBlog(), aMockBlog()];

  it("should render blog post", () => {
    render(
      <MemoryRouter>
        <BlogList blogs={blogs} />
      </MemoryRouter>
    );
    expect(screen.getByText("Recent Posts")).toBeTruthy();
    expect(screen.getAllByRole("blog-post-link")).toHaveLength(blogs.length);
    expect(screen.getByText(blogs[0].title)).toBeTruthy();
    expect(screen.getByText(blogs[1].title)).toBeTruthy();
  });
});

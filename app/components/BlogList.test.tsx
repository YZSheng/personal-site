import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { aMockBlog } from "test/data";
import { describe, expect, it } from "vitest";
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
    expect(screen.getAllByRole("link")).toHaveLength(blogs.length);
    expect(screen.getByText(blogs[0].title)).toBeTruthy();
    expect(screen.getByText(blogs[1].title)).toBeTruthy();
  });
});

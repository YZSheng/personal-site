import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, vi } from "vitest";
import DarkModeToggle from "./DarkModeToggle";

describe("DarkModeToggle", () => {
  const dark = false;
  const onClick = vi.fn();

  beforeEach(() => {
    onClick.mockClear();
  });

  it("should render dark icon", async () => {
    const { findByTestId } = render(
      <DarkModeToggle dark={dark} toggleDarkMode={onClick} />
    );
    const darkIcon = await findByTestId("dark-icon");
    expect(darkIcon).toBeTruthy();
    try {
      await findByTestId("light-icon");
      throw new Error("should not find light icon");
    } catch {}
  });

  it("should handle click", async () => {
    const { findByRole } = render(
      <DarkModeToggle dark={dark} toggleDarkMode={onClick} />
    );
    const toggle = await findByRole("button");
    fireEvent.click(toggle);
    expect(onClick).toHaveBeenCalled();
  });
});

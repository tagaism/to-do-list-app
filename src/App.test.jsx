import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds, completes, filters, and removes a task", async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/add a task/i);
    await user.type(input, "Ship the redesign");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(screen.getByText("Ship the redesign")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("todos"))[0].title).toBe("Ship the redesign");

    await user.click(screen.getByRole("checkbox", { name: /mark ship the redesign as complete/i }));
    expect(screen.getByRole("checkbox", { name: /mark ship the redesign as active/i })).toHaveAttribute(
      "aria-checked",
      "true"
    );

    await user.click(screen.getByRole("button", { name: /active/i }));
    expect(screen.getByText(/all caught up/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /done/i }));
    expect(screen.getByText("Ship the redesign")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /delete ship the redesign/i }));
    expect(screen.queryByText("Ship the redesign")).not.toBeInTheDocument();
  });

  it("rejects an empty task", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getByText(/a task needs a name/i)).toBeInTheDocument();
  });

  it("toggles theme", async () => {
    const user = userEvent.setup();
    render(<App />);
    const toggle = screen.getByRole("button", { name: /switch to light theme|switch to dark theme/i });
    const current = document.documentElement.dataset.theme;
    await user.click(toggle);
    expect(document.documentElement.dataset.theme).not.toBe(current);
  });
});

import { createRemixStub } from "@remix-run/testing";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";
import { ApiClient } from "~/api/api-client";
import { renderWith } from "~/utils/testUtils";
import RegisterPage from "../Register.page";

vi.mock("../../../api/api-client");

const mockedUseNavigate = vi.fn();
vi.mock("@remix-run/react", async () => {
  const mod =
    await vi.importActual<typeof import("@remix-run/react")>(
      "@remix-run/react"
    );
  return {
    ...mod,
    useNavigate: () => mockedUseNavigate,
    Link: ({ to, children }: PropsWithChildren<{ to: string }>) => (
      <a href={to}>{children}</a>
    ),
  };
});

describe("Register page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const RemixStub = createRemixStub([
    {
      path: "/",
      Component: RegisterPage,
    },
  ]);

  it("renders without crashing", () => {
    renderWith().render(<RemixStub />);

    expect(
      screen.getByRole("heading", { name: "Sign Up" })
    ).toBeInTheDocument();
  });

  it("submits the form with valid data", async () => {
    const mockRegisterResponse = { data: "" };
    // @ts-expect-error mock
    ApiClient.auth.authControllerRegister.mockResolvedValue(
      mockRegisterResponse
    );

    renderWith({ withQuery: true }).render(<RemixStub />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create an account" }));

    expect(ApiClient.auth.authControllerRegister).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("displays error messages for invalid inputs", async () => {
    renderWith({ withQuery: true }).render(<RemixStub />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Create an account" }));

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("navigates to login page when 'Sign in' link is clicked", async () => {
    renderWith({ withQuery: true }).render(<RemixStub />);

    const signInLink = screen.getByRole("link", { name: "Sign in" });
    expect(signInLink).toHaveAttribute("href", "/auth/login");
  });
});

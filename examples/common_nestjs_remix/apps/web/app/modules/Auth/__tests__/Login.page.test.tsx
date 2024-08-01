import { createRemixStub } from "@remix-run/testing";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";
import { ApiClient } from "~/api/api-client";
import { renderWith } from "~/utils/testUtils";
import LoginPage from "../Login.page";

const mockedUseNavigate = vi.fn();

vi.mock("../../../api/api-client");
vi.mock("@remix-run/react", async () => {
  const module =
    await vi.importActual<typeof import("@remix-run/react")>(
      "@remix-run/react"
    );
  return {
    ...module,
    useNavigate: () => mockedUseNavigate,
    Link: ({ to, children }: PropsWithChildren<{ to: string }>) => (
      <a href={to}>{children}</a>
    ),
  };
});

describe("Login page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const RemixStub = createRemixStub([
    {
      path: "/",
      Component: LoginPage,
    },
  ]);

  it("renders without crashing", () => {
    renderWith().render(<RemixStub />);

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  it.only("submits the form with valid data", async () => {
    // @ts-expect-error mock
    ApiClient.auth.authControllerLogin.mockResolvedValue({
      data: "",
    });

    renderWith({ withQuery: true }).render(<RemixStub />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(ApiClient.auth.authControllerLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(mockedUseNavigate).toHaveBeenCalledWith("/dashboard");
  });
});

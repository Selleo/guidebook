import { createRemixStub } from "@remix-run/testing";
import { prettyDOM, render, screen } from "@testing-library/react";
import { vi, describe, expect, it } from "vitest";
import LoginPage from "../Login.page";
import * as remixReact from "@remix-run/react";
import * as useLoginUserModule from "~/api/mutations/useLoginUser";
import * as reactHookForm from "react-hook-form";
import userEvent from "@testing-library/user-event";
import { renderWith } from "~/utils/testUtils";

vi.mock("@remix-run/react");
vi.mock("~/api/mutations/useLoginUser", () => ({
  useLoginUser: vi.fn(),
}));
vi.mock("react-hook-form", () => ({
  useForm: vi.fn().mockReturnValue({
    register: vi.fn(),
    handleSubmit: vi.fn((cb) => cb),
    formState: { errors: {} },
  }),
}));

describe("Login page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // const renderLoginPage = () => {
  const RemixStub = createRemixStub([
    {
      path: "/",
      Component: LoginPage,
    },
  ]);
  // return render(<RemixStub />);
  // };

  it("renders without crashing", () => {
    vi.mocked(useLoginUserModule.useLoginUser).mockReturnValue({
      mutateAsync: vi.fn(),
      isLoading: false,
      isError: false,
      error: null,
      data: null,
    } as any);
    // renderLoginPage();
    renderWith().render(<RemixStub />);

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  it("submits the form with valid data", async () => {
    const navigate = vi.fn();
    const loginUser = vi.fn().mockResolvedValue(undefined);

    vi.mocked(remixReact.useNavigate).mockReturnValue(navigate);
    vi.mocked(useLoginUserModule.useLoginUser).mockReturnValue({
      mutateAsync: loginUser,
      isLoading: false,
      isError: false,
      error: null,
      data: null,
    } as any);
    vi.mocked(reactHookForm.useForm).mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn((cb) => cb),
      formState: { errors: {} },
    } as any);

    // renderLoginPage();
    renderWith().render(<RemixStub />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(loginUser).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(navigate).toHaveBeenCalledWith("/dashboard");
  });
});

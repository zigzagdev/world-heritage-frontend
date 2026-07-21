/** @jest-environment jsdom */

import { jest } from "@jest/globals";

const submitMock = jest.fn();
const useLoginMock = jest.fn();
const navigateMock = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom") as typeof import("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

jest.mock("../../hooks/use-login", () => ({
  useLogin: () => useLoginMock(),
}));

jest.mock("../../components/LoginForm", () => ({
  __esModule: true,
  LoginForm: function MockLoginForm(props: {
    value: { email: string; password: string };
    onChange: (next: { email: string; password: string }) => void;
    onSubmit: () => void;
    isLoading: boolean;
    error: unknown;
  }) {
    return (
      <div>
        <span data-testid="email">{props.value.email}</span>
        <span data-testid="is-loading">{String(props.isLoading)}</span>
        <span data-testid="error">{props.error ? "has-error" : "no-error"}</span>
        <button
          type="button"
          onClick={() => props.onChange({ ...props.value, email: "taro@example.com" })}
        >
          change
        </button>
        <button type="button" onClick={props.onSubmit}>
          submit
        </button>
      </div>
    );
  },
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "@jest/globals";
import { MemoryRouter } from "react-router-dom";
import { LoginContainer } from "../login-container";

describe("LoginContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLoginMock.mockReturnValue({ submit: submitMock, isLoading: false, error: null });
  });

  const renderContainer = () =>
    render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>,
    );

  it("renders the form with default draft values", () => {
    renderContainer();

    expect(screen.getByTestId("email").textContent).toBe("");
    expect(screen.getByTestId("is-loading").textContent).toBe("false");
    expect(screen.getByTestId("error").textContent).toBe("no-error");
  });

  it("updates the draft when the form calls onChange", () => {
    renderContainer();

    fireEvent.click(screen.getByRole("button", { name: "change" }));

    expect(screen.getByTestId("email").textContent).toBe("taro@example.com");
  });

  it("calls submit with the current draft and navigates to /mypage on success", async () => {
    submitMock.mockResolvedValue(true);
    renderContainer();

    fireEvent.click(screen.getByRole("button", { name: "change" }));
    fireEvent.click(screen.getByRole("button", { name: "submit" }));

    expect(submitMock).toHaveBeenCalledWith(
      expect.objectContaining({ email: "taro@example.com", password: "" }),
    );
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/mypage"));
  });

  it("does not navigate when submit fails", async () => {
    submitMock.mockResolvedValue(false);
    renderContainer();

    fireEvent.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => expect(submitMock).toHaveBeenCalled());
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("passes through isLoading and error from the hook", () => {
    useLoginMock.mockReturnValue({
      submit: submitMock,
      isLoading: true,
      error: new Error("boom"),
    });

    renderContainer();

    expect(screen.getByTestId("is-loading").textContent).toBe("true");
    expect(screen.getByTestId("error").textContent).toBe("has-error");
  });
});

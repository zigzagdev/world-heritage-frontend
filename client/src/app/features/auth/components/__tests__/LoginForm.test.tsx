/** @jest-environment jsdom */

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LocaleProvider } from "@shared/locale/LocaleProvider.tsx";
import { LoginForm } from "../LoginForm";
import type { LoginFormValues } from "../../types";

const renderForm = (props: Partial<React.ComponentProps<typeof LoginForm>> = {}) => {
  const value: LoginFormValues = { email: "", password: "" };

  const defaultProps: React.ComponentProps<typeof LoginForm> = {
    value,
    onChange: jest.fn(),
    onSubmit: jest.fn(),
    isLoading: false,
    error: null,
    ...props,
  };

  return render(
    <MemoryRouter>
      <LocaleProvider>
        <LoginForm {...defaultProps} />
      </LocaleProvider>
    </MemoryRouter>,
  );
};

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    renderForm();

    expect(screen.getByLabelText(/^Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
  });

  it("calls onChange with the updated field when typing", () => {
    const onChange = jest.fn();
    renderForm({ onChange });

    fireEvent.change(screen.getByLabelText(/^Email/), {
      target: { value: "taro@example.com" },
    });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ email: "taro@example.com", password: "" }),
    );
  });

  it("calls onSubmit when the form is submitted", () => {
    const onSubmit = jest.fn();
    const value: LoginFormValues = { email: "taro@example.com", password: "password123" };
    renderForm({ onSubmit, value });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows an error panel when error is present", () => {
    renderForm({ error: new Error("boom") });

    expect(screen.getByText("Failed to log in.")).toBeInTheDocument();
  });
});

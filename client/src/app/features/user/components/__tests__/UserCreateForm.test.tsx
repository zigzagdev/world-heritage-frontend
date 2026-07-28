/** @jest-environment jsdom */

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LocaleProvider } from "@shared/locale/LocaleProvider.tsx";
import { UserCreateForm } from "../UserCreateForm";
import type { CreateUserFormValues } from "../../types";
import type { ApiUserDto } from "../../apis/user-api";

const renderForm = (props: Partial<React.ComponentProps<typeof UserCreateForm>> = {}) => {
  const value: CreateUserFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    ageRange: "teens",
  };

  const defaultProps: React.ComponentProps<typeof UserCreateForm> = {
    value,
    onChange: jest.fn(),
    onSubmit: jest.fn(),
    isLoading: false,
    error: null,
    createdUser: null,
    ...props,
  };

  return render(
    <MemoryRouter>
      <LocaleProvider>
        <UserCreateForm {...defaultProps} />
      </LocaleProvider>
    </MemoryRouter>,
  );
};

describe("UserCreateForm", () => {
  it("renders first name, last name, email, password, and age range fields, but not subscription", () => {
    renderForm();

    expect(screen.getByLabelText(/^First Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Last Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/age range/i)).toBeInTheDocument();

    expect(screen.queryByLabelText(/subscription/i)).not.toBeInTheDocument();
  });

  it("calls onChange with the updated field when typing", () => {
    const onChange = jest.fn();
    renderForm({ onChange });

    fireEvent.change(screen.getByLabelText(/^First Name/), { target: { value: "Taro" } });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: "Taro",
        lastName: "",
        email: "",
        password: "",
        ageRange: "teens",
      }),
    );
  });

  it("calls onSubmit when the form is submitted", () => {
    const onSubmit = jest.fn();
    const value: CreateUserFormValues = {
      firstName: "Taro",
      lastName: "Yamada",
      email: "taro@example.com",
      password: "password123",
      ageRange: "20s",
    };
    renderForm({ onSubmit, value });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows a success message when createdUser is present", () => {
    const createdUser: ApiUserDto = {
      id: 1,
      first_name: "Taro",
      last_name: "Yamada",
      email: "taro@example.com",
      age_range: "teens",
      subscription_tier: "free",
      subscription_expires_at: null,
    };
    renderForm({ createdUser });

    expect(screen.getByText("User created successfully.")).toBeInTheDocument();
  });

  it("shows an error panel when error is present", () => {
    renderForm({ error: new Error("boom") });

    expect(screen.getByText("Failed to create user.")).toBeInTheDocument();
  });
});

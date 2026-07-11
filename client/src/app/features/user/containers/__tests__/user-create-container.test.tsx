/** @jest-environment jsdom */

import { render, screen, fireEvent } from "@testing-library/react";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import type { CreateUserFormValues } from "../../types";
import type { ApiUserDto } from "../../apis/user-api";

const submitMock = jest.fn();
const useCreateUserMock = jest.fn();

jest.mock("../../hooks/use-create-user", () => ({
  useCreateUser: () => useCreateUserMock(),
}));

jest.mock("../../components/UserCreateForm", () => ({
  __esModule: true,
  UserCreateForm: function MockUserCreateForm(props: {
    value: CreateUserFormValues;
    onChange: (next: CreateUserFormValues) => void;
    onSubmit: () => void;
    isLoading: boolean;
    error: unknown;
    createdUser: ApiUserDto | null;
  }) {
    return (
      <div>
        <span data-testid="first-name">{props.value.firstName}</span>
        <span data-testid="is-loading">{String(props.isLoading)}</span>
        <span data-testid="error">{props.error ? "has-error" : "no-error"}</span>
        <span data-testid="created-user">{props.createdUser ? props.createdUser.email : ""}</span>
        <button type="button" onClick={() => props.onChange({ ...props.value, firstName: "Taro" })}>
          change
        </button>
        <button type="button" onClick={props.onSubmit}>
          submit
        </button>
      </div>
    );
  },
}));

import { UserCreateContainer } from "../user-create-container";

describe("UserCreateContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCreateUserMock.mockReturnValue({
      submit: submitMock,
      data: null,
      isLoading: false,
      error: null,
    });
  });

  it("renders the form with the default draft values", () => {
    render(<UserCreateContainer />);

    expect(screen.getByTestId("first-name").textContent).toBe("");
    expect(screen.getByTestId("is-loading").textContent).toBe("false");
    expect(screen.getByTestId("error").textContent).toBe("no-error");
  });

  it("updates the draft when the form calls onChange", () => {
    render(<UserCreateContainer />);

    fireEvent.click(screen.getByRole("button", { name: "change" }));

    expect(screen.getByTestId("first-name").textContent).toBe("Taro");
  });

  it("calls submit with the current draft when the form calls onSubmit", () => {
    render(<UserCreateContainer />);

    fireEvent.click(screen.getByRole("button", { name: "change" }));
    fireEvent.click(screen.getByRole("button", { name: "submit" }));

    expect(submitMock).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: "Taro", lastName: "", email: "", password: "" }),
    );
  });

  it("passes through isLoading, error, and createdUser from the hook", () => {
    const createdUser: ApiUserDto = {
      id: 1,
      first_name: "Taro",
      last_name: "Yamada",
      email: "taro@example.com",
      age_range: "teens",
      subscription_tier: "free",
      subscription_expires_at: null,
    };
    useCreateUserMock.mockReturnValue({
      submit: submitMock,
      data: createdUser,
      isLoading: true,
      error: new Error("boom"),
    });

    render(<UserCreateContainer />);

    expect(screen.getByTestId("is-loading").textContent).toBe("true");
    expect(screen.getByTestId("error").textContent).toBe("has-error");
    expect(screen.getByTestId("created-user").textContent).toBe("taro@example.com");
  });
});

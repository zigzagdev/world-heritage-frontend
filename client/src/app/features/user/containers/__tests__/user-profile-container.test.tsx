/** @jest-environment jsdom */

import type { UserProfile } from "../../types";

const useGetUserMock = jest.fn();
const useUpdateUserMock = jest.fn();
const useDeleteUserMock = jest.fn();

jest.mock("../../hooks/use-get-user", () => ({
  useGetUser: (id: number) => useGetUserMock(id),
}));

jest.mock("../../hooks/use-update-user", () => ({
  useUpdateUser: () => useUpdateUserMock(),
}));

jest.mock("../../hooks/use-delete-user", () => ({
  useDeleteUser: () => useDeleteUserMock(),
}));

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { LocaleProvider } from "@shared/locale/LocaleProvider.tsx";
import { UserProfileContainer } from "../user-profile-container";

const profile: UserProfile = {
  id: 1,
  firstName: "Taro",
  lastName: "Yamada",
  email: "taro@example.com",
  ageRange: "teens",
  subscriptionTier: "free",
  subscriptionExpiresAt: null,
};

const renderContainer = (id = 1) =>
  render(
    <MemoryRouter initialEntries={["/profile"]}>
      <LocaleProvider>
        <Routes>
          <Route path="/profile" element={<UserProfileContainer id={id} />} />
          <Route path="/heritages" element={<div>Heritages Home</div>} />
        </Routes>
      </LocaleProvider>
    </MemoryRouter>,
  );

describe("UserProfileContainer", () => {
  const submitUpdateMock = jest.fn();
  const submitDeleteMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useUpdateUserMock.mockReturnValue({
      submit: submitUpdateMock,
      data: null,
      isLoading: false,
      error: null,
    });
    useDeleteUserMock.mockReturnValue({
      submit: submitDeleteMock,
      done: false,
      isLoading: false,
      error: null,
    });
  });

  it("shows a spinner while loading", () => {
    useGetUserMock.mockReturnValue({ data: null, isLoading: true, error: null });

    renderContainer();

    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("passes the given id to useGetUser", () => {
    useGetUserMock.mockReturnValue({ data: profile, isLoading: false, error: null });

    renderContainer(42);

    expect(useGetUserMock).toHaveBeenCalledWith(42);
  });

  it("renders the user profile on success", () => {
    useGetUserMock.mockReturnValue({ data: profile, isLoading: false, error: null });

    renderContainer();

    expect(screen.getByText("Taro Yamada")).toBeInTheDocument();
    expect(screen.getAllByText("taro@example.com").length).toBeGreaterThan(0);
  });

  it("shows an error panel when the hook reports an error", () => {
    useGetUserMock.mockReturnValue({ data: null, isLoading: false, error: new Error("boom") });

    renderContainer();

    expect(screen.getByText("Failed to load user.")).toBeInTheDocument();
  });

  it("shows an error panel when data is missing after loading", () => {
    useGetUserMock.mockReturnValue({ data: null, isLoading: false, error: null });

    renderContainer();

    expect(screen.getByText("Failed to load user.")).toBeInTheDocument();
  });

  it("calls useUpdateUser's submit with the given id and form values on save", () => {
    useGetUserMock.mockReturnValue({ data: profile, isLoading: false, error: null });

    renderContainer(42);

    fireEvent.click(screen.getByRole("button", { name: "Edit First Name" }));
    fireEvent.change(screen.getByLabelText(/^First Name/), { target: { value: "Jiro" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(submitUpdateMock).toHaveBeenCalledWith(
      42,
      expect.objectContaining({ firstName: "Jiro", lastName: "Yamada", email: "taro@example.com" }),
    );
  });

  it("reflects the updated profile immediately once useUpdateUser returns data", () => {
    useGetUserMock.mockReturnValue({ data: profile, isLoading: false, error: null });
    useUpdateUserMock.mockReturnValue({
      submit: submitUpdateMock,
      data: { ...profile, firstName: "Jiro" },
      isLoading: false,
      error: null,
    });

    renderContainer();

    expect(screen.getByText("Jiro Yamada")).toBeInTheDocument();
  });

  it("calls useDeleteUser's submit with the given id after confirming deletion", () => {
    useGetUserMock.mockReturnValue({ data: profile, isLoading: false, error: null });

    renderContainer(42);

    fireEvent.click(screen.getByRole("button", { name: "Delete User" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete User" }));

    expect(submitDeleteMock).toHaveBeenCalledWith(42);
  });

  it("navigates to /heritages once useDeleteUser reports done", () => {
    useGetUserMock.mockReturnValue({ data: profile, isLoading: false, error: null });
    useDeleteUserMock.mockReturnValue({
      submit: submitDeleteMock,
      done: true,
      isLoading: false,
      error: null,
    });

    renderContainer();

    expect(screen.getByText("Heritages Home")).toBeInTheDocument();
  });
});

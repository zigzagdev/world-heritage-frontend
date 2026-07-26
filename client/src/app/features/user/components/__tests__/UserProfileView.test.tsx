/** @jest-environment jsdom */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LocaleProvider } from "@shared/locale/LocaleProvider.tsx";
import { UserProfileView } from "../UserProfileView";
import type { UserProfile } from "../../types";

const profile: UserProfile = {
  id: 1,
  firstName: "Taro",
  lastName: "Yamada",
  email: "taro@example.com",
  ageRange: "teens",
  subscriptionTier: "free",
  subscriptionExpiresAt: null,
};

const renderView = (props: Partial<React.ComponentProps<typeof UserProfileView>> = {}) => {
  const defaultProps: React.ComponentProps<typeof UserProfileView> = {
    profile,
    onUpdate: jest.fn(),
    isUpdating: false,
    updateError: null,
    onDelete: jest.fn(),
    isDeleting: false,
    deleteError: null,
    ...props,
  };

  return render(
    <MemoryRouter>
      <LocaleProvider>
        <UserProfileView {...defaultProps} />
      </LocaleProvider>
    </MemoryRouter>,
  );
};

describe("UserProfileView", () => {
  it("renders the avatar initials from first and last name", () => {
    renderView();

    expect(screen.getByText("TY")).toBeInTheDocument();
  });

  it("renders the full name and email", () => {
    renderView();

    expect(screen.getByText("Taro Yamada")).toBeInTheDocument();
    expect(screen.getAllByText("taro@example.com").length).toBeGreaterThan(0);
  });

  it("renders a profile row for each field, with an edit trigger only for editable ones", () => {
    renderView();

    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Age Range")).toBeInTheDocument();
    expect(screen.getByText("teens")).toBeInTheDocument();
    expect(screen.getByText("Subscription")).toBeInTheDocument();
    expect(screen.getByText("free")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Edit First Name" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit Last Name" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit Email" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit Age Range" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit Subscription" })).not.toBeInTheDocument();
  });

  it("turns only the selected field into an input, pre-filled with its current value", () => {
    renderView();

    fireEvent.click(screen.getByRole("button", { name: "Edit First Name" }));

    expect(screen.getByLabelText(/^First Name/)).toHaveValue("Taro");
    expect(screen.queryByLabelText(/^Last Name/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^Email/)).not.toBeInTheDocument();
    expect(screen.getByText("Yamada")).toBeInTheDocument();
    expect(screen.getAllByText("taro@example.com").length).toBeGreaterThan(0);
  });

  it("calls onUpdate with the full field set, only the edited field changed, on save", () => {
    const onUpdate = jest.fn();
    renderView({ onUpdate });

    fireEvent.click(screen.getByRole("button", { name: "Edit First Name" }));
    fireEvent.change(screen.getByLabelText(/^First Name/), { target: { value: "Jiro" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onUpdate).toHaveBeenCalledWith({
      firstName: "Jiro",
      lastName: "Yamada",
      email: "taro@example.com",
    });
  });

  it("switching to editing another field cancels the previous one", () => {
    renderView();

    fireEvent.click(screen.getByRole("button", { name: "Edit First Name" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit Last Name" }));

    expect(screen.queryByLabelText(/^First Name/)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/^Last Name/)).toHaveValue("Yamada");
  });

  it("returns to view mode when Cancel is clicked", () => {
    renderView();

    fireEvent.click(screen.getByRole("button", { name: "Edit First Name" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByLabelText(/^First Name/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit First Name" })).toBeInTheDocument();
  });

  it("shows an error panel when updateError is present", () => {
    renderView({ updateError: new Error("boom") });

    expect(screen.getByText("Failed to update user.")).toBeInTheDocument();
  });

  const rerenderWith = (
    rerender: (ui: React.ReactElement) => void,
    props: { isUpdating: boolean; updateError: unknown },
  ) =>
    rerender(
      <MemoryRouter>
        <LocaleProvider>
          <UserProfileView
            profile={profile}
            onUpdate={jest.fn()}
            onDelete={jest.fn()}
            isDeleting={false}
            deleteError={null}
            {...props}
          />
        </LocaleProvider>
      </MemoryRouter>,
    );

  it("stays in edit mode when isUpdating transitions to false with an error", () => {
    const { rerender } = renderView();

    fireEvent.click(screen.getByRole("button", { name: "Edit First Name" }));
    rerenderWith(rerender, { isUpdating: true, updateError: null });
    rerenderWith(rerender, { isUpdating: false, updateError: new Error("boom") });

    expect(screen.getByLabelText(/^First Name/)).toBeInTheDocument();
  });

  it("returns to view mode when isUpdating transitions to false without an error", () => {
    const { rerender } = renderView();

    fireEvent.click(screen.getByRole("button", { name: "Edit First Name" }));
    rerenderWith(rerender, { isUpdating: true, updateError: null });
    rerenderWith(rerender, { isUpdating: false, updateError: null });

    expect(screen.queryByLabelText(/^First Name/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit First Name" })).toBeInTheDocument();
  });

  it("opens a confirmation dialog when Delete User is clicked", () => {
    renderView();

    fireEvent.click(screen.getByRole("button", { name: "Delete User" }));

    expect(
      screen.getByText("Are you sure you want to delete this user?", { exact: false }),
    ).toBeInTheDocument();
  });

  it("closes the dialog without calling onDelete when Cancel is clicked", async () => {
    const onDelete = jest.fn();
    renderView({ onDelete });

    fireEvent.click(screen.getByRole("button", { name: "Delete User" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onDelete).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(
        screen.queryByText("Are you sure you want to delete this user?", { exact: false }),
      ).not.toBeInTheDocument();
    });
  });

  it("calls onDelete when the dialog's Delete User button is confirmed", () => {
    const onDelete = jest.fn();
    renderView({ onDelete });

    fireEvent.click(screen.getByRole("button", { name: "Delete User" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete User" }));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("shows an error panel when deleteError is present", () => {
    renderView({ deleteError: new Error("boom") });

    expect(screen.getByText("Failed to delete user.")).toBeInTheDocument();
  });
});

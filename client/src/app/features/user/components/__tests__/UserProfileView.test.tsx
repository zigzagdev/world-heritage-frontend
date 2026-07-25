/** @jest-environment jsdom */

import { render, screen, fireEvent } from "@testing-library/react";
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

  it("renders a profile row for each field", () => {
    renderView();

    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Age Range")).toBeInTheDocument();
    expect(screen.getByText("teens")).toBeInTheDocument();
    expect(screen.getByText("Subscription")).toBeInTheDocument();
    expect(screen.getByText("free")).toBeInTheDocument();
  });

  it("switches to an edit form pre-filled with the current profile when Edit is clicked", () => {
    renderView();

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByLabelText(/^First Name/)).toHaveValue("Taro");
    expect(screen.getByLabelText(/^Last Name/)).toHaveValue("Yamada");
    expect(screen.getByLabelText(/^Email/)).toHaveValue("taro@example.com");
    expect(screen.queryByLabelText(/age range/i)).not.toBeInTheDocument();
  });

  it("calls onUpdate with the edited values on save", () => {
    const onUpdate = jest.fn();
    renderView({ onUpdate });

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText(/^First Name/), { target: { value: "Jiro" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onUpdate).toHaveBeenCalledWith({
      firstName: "Jiro",
      lastName: "Yamada",
      email: "taro@example.com",
    });
  });

  it("returns to view mode when Cancel is clicked", () => {
    renderView();

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByText("Taro Yamada")).toBeInTheDocument();
    expect(screen.queryByLabelText(/^First Name/)).not.toBeInTheDocument();
  });

  it("shows an error panel in edit mode when updateError is present", () => {
    renderView({ updateError: new Error("boom") });

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByText("Failed to update user.")).toBeInTheDocument();
  });

  it("stays in edit mode when isUpdating transitions to false with an error", () => {
    const { rerender } = renderView({ isUpdating: true, updateError: null });

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    rerender(
      <MemoryRouter>
        <LocaleProvider>
          <UserProfileView
            profile={profile}
            onUpdate={jest.fn()}
            isUpdating={false}
            updateError={new Error("boom")}
          />
        </LocaleProvider>
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/^First Name/)).toBeInTheDocument();
  });

  it("returns to view mode when isUpdating transitions to false without an error", () => {
    const { rerender } = renderView({ isUpdating: true, updateError: null });

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    rerender(
      <MemoryRouter>
        <LocaleProvider>
          <UserProfileView
            profile={profile}
            onUpdate={jest.fn()}
            isUpdating={false}
            updateError={null}
          />
        </LocaleProvider>
      </MemoryRouter>,
    );

    expect(screen.queryByLabelText(/^First Name/)).not.toBeInTheDocument();
    expect(screen.getByText("Taro Yamada")).toBeInTheDocument();
  });
});

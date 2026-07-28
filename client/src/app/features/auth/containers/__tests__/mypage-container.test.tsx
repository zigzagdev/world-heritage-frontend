/** @jest-environment jsdom */

const useAuthMock = jest.fn();
const userProfileContainerMock = jest.fn();

jest.mock("@shared/auth/AuthHooks.ts", () => ({
  useAuth: () => useAuthMock(),
}));

jest.mock("@features/user/containers/user-profile-container.tsx", () => ({
  UserProfileContainer: (props: { id: number }) => {
    userProfileContainerMock(props);
    return <div data-testid="id">{props.id}</div>;
  },
}));

import { render, screen } from "@testing-library/react";
import { MyPageContainer } from "../mypage-container";

describe("MyPageContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows a spinner while the authenticated user is not yet resolved", () => {
    useAuthMock.mockReturnValue({ user: null, isLoading: true });

    render(<MyPageContainer />);

    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    expect(userProfileContainerMock).not.toHaveBeenCalled();
  });

  it("renders UserProfileContainer with the authenticated user's id", () => {
    useAuthMock.mockReturnValue({
      user: { id: 7, first_name: "Taro", last_name: "Yamada", email: "taro@example.com" },
      isLoading: false,
    });

    render(<MyPageContainer />);

    expect(userProfileContainerMock).toHaveBeenCalledWith({ id: 7 });
    expect(screen.getByTestId("id").textContent).toBe("7");
  });
});

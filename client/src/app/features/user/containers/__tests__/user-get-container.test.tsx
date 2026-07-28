/** @jest-environment jsdom */

const userProfileContainerMock = jest.fn();

jest.mock("../user-profile-container", () => ({
  UserProfileContainer: (props: { id: number }) => {
    userProfileContainerMock(props);
    return <div data-testid="id">{props.id}</div>;
  },
}));

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { UserGetContainer } from "../user-get-container";

const renderContainer = (id: string) =>
  render(
    <MemoryRouter initialEntries={[`/users/${id}`]}>
      <Routes>
        <Route path="/users/:id" element={<UserGetContainer />} />
      </Routes>
    </MemoryRouter>,
  );

describe("UserGetContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("passes the numeric id from the route to UserProfileContainer", () => {
    renderContainer("42");

    expect(userProfileContainerMock).toHaveBeenCalledWith({ id: 42 });
    expect(screen.getByTestId("id").textContent).toBe("42");
  });
});

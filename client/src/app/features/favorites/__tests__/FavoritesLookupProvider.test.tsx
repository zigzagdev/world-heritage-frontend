/** @jest-environment jsdom */

import { jest } from "@jest/globals";

const useAuthMock = jest.fn();

jest.mock("@shared/auth/AuthHooks.ts", () => ({
  useAuth: () => useAuthMock(),
}));

const useIsFavoritedMock = jest.fn();

jest.mock("../hooks/use-is-favorited", () => ({
  useIsFavorited: () => useIsFavoritedMock(),
}));

import { render, screen } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "@jest/globals";
import { FavoritesLookupProvider } from "../FavoritesLookupProvider";
import { useFavoritesLookup } from "../hooks/use-favorites-lookup";

function Probe() {
  const { isFavorited, isLoading } = useFavoritesLookup();
  return (
    <div data-testid="state">
      {isLoading ? "loading" : isFavorited(1) ? "favorited" : "not-favorited"}
    </div>
  );
}

describe("FavoritesLookupProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("useIsFavoritedの結果をcontext経由で公開する", () => {
    useAuthMock.mockReturnValue({ user: { id: 1 } });
    useIsFavoritedMock.mockReturnValue({
      isFavorited: (id: number) => id === 1,
      isLoading: false,
      error: null,
    });

    render(
      <FavoritesLookupProvider>
        <Probe />
      </FavoritesLookupProvider>,
    );

    expect(screen.getByTestId("state")).toHaveTextContent("favorited");
  });

  test("Provider外でuseFavoritesLookupを呼ぶとエラーになる", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Probe />)).toThrow(
      "useFavoritesLookup must be used within FavoritesLookupProvider",
    );

    spy.mockRestore();
  });
});

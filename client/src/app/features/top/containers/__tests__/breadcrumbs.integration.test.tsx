/** @jest-environment jsdom */

import { useEffect } from "react";
import { render, screen, act, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";

import { WorldHeritageDetailContainer } from "../world-heritage-detail-container";
import { BreadcrumbProvider } from "@features/breadcrumbs/BreadCrumbProvider";
import { BreadcrumbList } from "@shared/components/BreadcrumbList";

import { fetchWorldHeritageDetail } from "../../apis";

jest.mock("@features/heritages/mappers/to-world-heritage-detail-vm", () => ({
  toWorldHeritageDetailVm: (x: unknown) => x,
}));

jest.mock("../../apis", () => ({
  fetchWorldHeritageDetail: jest.fn(),
}));

jest.mock("@features/top/components/heritage-detail/HeritageDetailLayout", () => ({
  HeritageDetailLayout: ({ item }: { item: { title?: string; name?: string } }) => (
    <div data-testid="detail">Detail: {item?.title ?? item?.name ?? "detail"}</div>
  ),
}));

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
};

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

function TestNav({ to }: { to: string }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  return null;
}

const fetchMock = fetchWorldHeritageDetail as jest.MockedFunction<
  (id: string, opts: { signal: AbortSignal }) => Promise<unknown>
>;

function renderApp(initialEntry: string) {
  return render(
    <BreadcrumbProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <BreadcrumbList />
        <Routes>
          <Route path="/heritages" element={<div>Index Page</div>} />
          <Route path="/heritages/:id" element={<WorldHeritageDetailContainer />} />
        </Routes>
      </MemoryRouter>
    </BreadcrumbProvider>,
  );
}

describe("Breadcrumb integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Direct access: /heritages/:id 直アクセスでも親crumbが 'World Heritages' になり、/heritages にリンクする", async () => {
    fetchMock.mockResolvedValueOnce({
      id: 1,
      name: "Kyoto",
      title: "Kyoto",
    });

    renderApp("/heritages/1");

    const parent = await screen.findByRole("link", { name: "World Heritages" });
    expect(parent).toHaveAttribute("href", "/heritages");
  });

  test("Race: /1 → /2 を素早く遷移しても、最終的に /2 の dynamic label が表示され続ける", async () => {
    const firstDeferred = createDeferred<unknown>();
    const secondDefered = createDeferred<unknown>();

    fetchMock.mockImplementationOnce(() => firstDeferred.promise); // /1
    fetchMock.mockImplementationOnce(() => secondDefered.promise); // /2

    render(
      <BreadcrumbProvider>
        <MemoryRouter initialEntries={["/heritages/1"]}>
          <BreadcrumbList />
          <Routes>
            <Route path="/heritages/:id" element={<WorldHeritageDetailContainer />} />
          </Routes>
          <TestNav to="/heritages/2" />
        </MemoryRouter>
      </BreadcrumbProvider>,
    );

    const breadcrumbNav = await screen.findByLabelText("breadcrumb");

    await act(async () => {
      secondDefered.resolve({ id: 2, name: "Nara", title: "Nara" });
      await Promise.resolve();
    });

    expect(within(breadcrumbNav).getByText("Nara")).toBeInTheDocument();

    await act(async () => {
      firstDeferred.resolve({ id: 1, name: "Kyoto", title: "Kyoto" });
      await Promise.resolve();
    });

    expect(within(breadcrumbNav).getByText("Nara")).toBeInTheDocument();
    expect(within(breadcrumbNav).queryByText("Kyoto")).not.toBeInTheDocument();
  });
});

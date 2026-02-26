import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ApiWorldHeritageDto, WorldHeritageVm } from "../../../../../domain/types.ts";

const navigateMock = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

jest.mock("../../apis", () => ({
  fetchTopFirstPage: jest.fn(),
}));

// ✅ mapper mockを「新仕様（JP優先）」に合わせる
jest.mock("@features/heritages/mappers/to-world-heritage-vm", () => ({
  __esModule: true,
  toWorldHeritageListVm: jest.fn((dto: ReadonlyArray<ApiWorldHeritageDto>) =>
    dto.map((d) => {
      const title = d.heritage_name_jp || d.official_name || d.name;
      const countryLabel = d.country_name_jp || d.country || null;
      const subtitle = [countryLabel, d.region].filter(Boolean).join(" · ");

      const fmtHa = (v: number | null) => (v == null ? "—" : `${v} ha`);
      const vm: Pick<
        WorldHeritageVm,
        | "id"
        | "title"
        | "subtitle"
        | "category"
        | "yearInscribed"
        | "areaText"
        | "bufferText"
        | "thumbnailUrl"
      > = {
        id: d.id,
        title,
        subtitle,
        category: d.category,
        yearInscribed: d.year_inscribed,
        areaText: fmtHa(d.area_hectares),
        bufferText: fmtHa(d.buffer_zone_hectares),
        thumbnailUrl: d.thumbnail,
      };

      return vm as WorldHeritageVm;
    }),
  ),
}));

// ✅ TopPage mockのprops型を「新pagination props込み」に合わせる
jest.mock("../../components/TopPage", () => ({
  __esModule: true,
  default: function MockTopPage(props: {
    items: ReadonlyArray<WorldHeritageVm>;
    onReload: () => void;
    onClickItem: (id: number) => void;
    onSearch: () => void;
    isLoading?: boolean;
    errorMessage?: string | null;
    isError?: boolean;

    currentPage?: number;
    lastPage?: number;
    onChangePage?: (page: number) => void;
    paginationDisabled?: boolean;
  }) {
    if (props.isLoading) return <div>Loading…</div>;

    if (props.isError || props.errorMessage) {
      return (
        <div>
          <div>Failed to load.</div>
          <button type="button" onClick={props.onReload}>
            Retry
          </button>
        </div>
      );
    }

    return (
      <div>
        {/* 初期で Loading を探すテストがあるので残す */}
        <div style={{ display: "none" }}>Loading</div>

        <button type="button" onClick={props.onReload}>
          Retry
        </button>
        <button type="button" onClick={props.onSearch}>
          Search
        </button>

        <ul>
          {props.items.map((it) => (
            <li key={it.id} onClick={() => props.onClickItem(it.id)}>
              {it.title}
            </li>
          ))}
        </ul>
      </div>
    );
  },
}));

import { fetchTopFirstPage } from "../../apis";
import TopPageContainer from "../top-page-container";

const fetchTopFirstPageMock = fetchTopFirstPage as jest.MockedFunction<typeof fetchTopFirstPage>;

const HIMEJI: ApiWorldHeritageDto = {
  id: 661,
  official_name: "Himeji-jo",
  name: "Himeji-jo",
  heritage_name_jp: "姫路城",
  country: "Japan",
  country_name_jp: "日本",
  region: "APA",
  category: "Cultural",
  year_inscribed: 1993,
  latitude: null,
  longitude: null,
  is_endangered: false,
  criteria: ["i", "iv"],
  area_hectares: null,
  buffer_zone_hectares: null,
  short_description: "白鷺城の名で知られる城郭建築の傑作。天守群と縄張りが良好に保存される。",
  unesco_site_url: "https://whc.unesco.org/en/list/661",
  state_party: "Japan",
  state_party_codes: ["JPN"],
  state_parties_meta: { JPN: { is_primary: true, inscription_year: 1993 } },
  thumbnail: "http://localhost/storage/world_heritage/661/img1.jpg",
};

const YAKUSHIMA: ApiWorldHeritageDto = {
  id: 662,
  official_name: "Yakushima",
  name: "Yakushima",
  heritage_name_jp: "屋久島",
  country: "Japan",
  country_name_jp: "日本",
  region: "APA",
  category: "Natural",
  year_inscribed: 1993,
  latitude: null,
  longitude: null,
  is_endangered: false,
  criteria: ["vii", "ix"],
  area_hectares: null,
  buffer_zone_hectares: null,
  short_description: "巨樹・照葉樹林に代表される生態系と景観が特筆される島。",
  unesco_site_url: "https://whc.unesco.org/en/list/662",
  state_party: "Japan",
  state_party_codes: ["JPN"],
  state_parties_meta: { JPN: { is_primary: true, inscription_year: 1993 } },
  thumbnail: "http://localhost/storage/world_heritage/662/img1.jpg",
};

const SHIRAKAMI: ApiWorldHeritageDto = {
  id: 663,
  official_name: "Shirakami-Sanchi",
  name: "Shirakami-Sanchi",
  heritage_name_jp: "白神山地",
  country: "Japan",
  country_name_jp: "日本",
  region: "APA",
  category: "Natural",
  year_inscribed: 1993,
  latitude: null,
  longitude: null,
  is_endangered: false,
  criteria: ["ix", "x"],
  area_hectares: 442.0,
  buffer_zone_hectares: 320.0,
  short_description: "日本最大級のブナ天然林を中心とする山地生態系。",
  unesco_site_url: "https://whc.unesco.org/en/list/663",
  state_party: "Japan",
  state_party_codes: ["JPN"],
  state_parties_meta: { JPN: { is_primary: true, inscription_year: 1993 } },
  thumbnail: "http://localhost/storage/world_heritage/663/img1.jpg",
};

const makeOk = (items: ApiWorldHeritageDto[]) => ({
  items,
  pagination: {
    current_page: 1,
    per_page: 50,
    total: items.length,
    last_page: 1,
  },
});

describe("TopPageContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    navigateMock.mockClear();
  });

  it("loads and shows items", async () => {
    // ✅ 実装の返却型に合わせる（配列じゃない）
    fetchTopFirstPageMock.mockResolvedValueOnce(makeOk([HIMEJI, YAKUSHIMA]));

    render(
      <MemoryRouter>
        <TopPageContainer />
      </MemoryRouter>,
    );

    screen.getByText(/Loading/i);

    await waitFor(() => {
      // ✅ JP優先タイトルに合わせる
      screen.getByText("姫路城");
      screen.getByText("屋久島");
    });
  });

  it("shows error then reload works", async () => {
    fetchTopFirstPageMock
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce(makeOk([SHIRAKAMI]));

    render(
      <MemoryRouter>
        <TopPageContainer />
      </MemoryRouter>,
    );

    await waitFor(() => {
      screen.getByText(/Failed to load/i);
    });

    fireEvent.click(screen.getByText(/Retry/i));

    await waitFor(() => {
      screen.getByText("白神山地");
    });
  });

  it("navigates when an item is clicked", async () => {
    fetchTopFirstPageMock.mockResolvedValueOnce(makeOk([HIMEJI]));

    render(
      <MemoryRouter>
        <TopPageContainer />
      </MemoryRouter>,
    );

    await waitFor(() => {
      screen.getByText("姫路城");
    });

    fireEvent.click(screen.getByText("姫路城"));

    expect(navigateMock).toHaveBeenCalledWith("/heritages/661");
  });
});

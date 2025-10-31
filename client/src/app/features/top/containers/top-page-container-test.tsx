// containers/__tests__/top-page-container.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import React from "react";

// ===== Types =====
type CriteriaCode = "i" | "ii" | "iii" | "iv" | "v" | "vi" | "vii" | "viii" | "ix" | "x";

interface WorldHeritageDto {
  id: number;
  official_name?: string | null;
  name: string;
  country: string;
  region: string;
  category: "Cultural" | "Natural" | "Mixed" | string;
  year_inscribed: number;
  latitude: number | null;
  longitude: number | null;
  is_endangered: boolean;
  name_jp?: string | null;
  state_party?: string | null;
  criteria: CriteriaCode[];
  area_hectares: number | null;
  buffer_zone_hectares: number | null;
  short_description: string;
  unesco_site_url: string;
  state_party_codes: string[];
  state_parties_meta: Record<string, { is_primary: boolean; inscription_year: number }>;
  thumbnail: string;
}

interface WorldHeritageVm {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  yearInscribed: number;
  areaText: string;
  bufferText: string;
  thumbnail: string;
}

// ===== Mocks =====
// API（関数シグネチャを明示）
vi.mock("../../apis", () => ({
  fetchTopFirstPage: vi.fn<(opts?: { signal?: AbortSignal }) => Promise<WorldHeritageDto[]>>(),
}));

// DTO -> VM マッパー（DTO仕様に準拠）
vi.mock("../../mappers/to-world-heritage-vm", () => {
  const toWorldHeritageListVm = (dto: ReadonlyArray<WorldHeritageDto>): WorldHeritageVm[] =>
    dto.map((d) => ({
      id: d.id,
      title: d.official_name ?? d.name,
      subtitle: d.name_jp ? `${d.country} / ${d.name_jp}` : d.country,
      category: d.category,
      yearInscribed: d.year_inscribed,
      areaText:
        typeof d.area_hectares === "number" && d.area_hectares > 0 ? `${d.area_hectares} ha` : "—",
      bufferText:
        typeof d.buffer_zone_hectares === "number" && d.buffer_zone_hectares > 0
          ? `${d.buffer_zone_hectares} ha`
          : "—",
      thumbnail: d.thumbnail,
    }));
  return { toWorldHeritageListVm };
});

// TopPage（最小モック）
interface TopPageProps {
  items: ReadonlyArray<WorldHeritageVm>;
  onReload: () => void;
}
vi.mock("../../components/TopPage", () => {
  const TopPage: React.FC<TopPageProps> = ({ items, onReload }) => (
    <div>
      <button onClick={onReload}>Reload</button>
      <ul>
        {items.map((it) => (
          <li key={it.id}>{it.title}</li>
        ))}
      </ul>
    </div>
  );
  return { default: TopPage };
});

import { fetchTopFirstPage } from "../apis";
import TopPageContainer from "./top-page-container";

// 型付きモックハンドル
const fetchTopFirstPageMock = fetchTopFirstPage as unknown as vi.MockedFunction<
  (opts?: { signal?: AbortSignal }) => Promise<WorldHeritageDto[]>
>;

// ===== Fixtures =====
const HIMEJI: WorldHeritageDto = {
  id: 661,
  official_name: "Himeji-jo",
  name: "Himeji-jo",
  country: "Japan",
  region: "Asia",
  category: "Cultural",
  year_inscribed: 1993,
  latitude: null,
  longitude: null,
  is_endangered: false,
  name_jp: "姫路城",
  state_party: "JPN",
  criteria: ["i", "iv"],
  area_hectares: null,
  buffer_zone_hectares: null,
  short_description: "白鷺城の名で知られる城郭建築の傑作。天守群と縄張りが良好に保存される。",
  unesco_site_url: "https://whc.unesco.org/en/list/661",
  state_party_codes: ["JPN"],
  state_parties_meta: { JPN: { is_primary: true, inscription_year: 1993 } },
  thumbnail: "http://localhost/storage/world_heritage/661/img1.jpg",
};

const YAKUSHIMA: WorldHeritageDto = {
  id: 662,
  official_name: "Yakushima",
  name: "Yakushima",
  country: "Japan",
  region: "Asia",
  category: "Natural",
  year_inscribed: 1993,
  latitude: null,
  longitude: null,
  is_endangered: false,
  name_jp: "屋久島",
  state_party: "JPN",
  criteria: ["vii", "ix"],
  area_hectares: null,
  buffer_zone_hectares: null,
  short_description: "巨樹・照葉樹林に代表される生態系と景観が特筆される島。",
  unesco_site_url: "https://whc.unesco.org/en/list/662",
  state_party_codes: ["JPN"],
  state_parties_meta: { JPN: { is_primary: true, inscription_year: 1993 } },
  thumbnail: "http://localhost/storage/world_heritage/662/img1.jpg",
};

const SHIRAKAMI: WorldHeritageDto = {
  id: 663,
  official_name: "Shirakami-Sanchi",
  name: "Shirakami-Sanchi",
  country: "Japan",
  region: "Asia",
  category: "Natural",
  year_inscribed: 1993,
  latitude: null,
  longitude: null,
  is_endangered: false,
  name_jp: "白神山地",
  state_party: "JPN",
  criteria: ["ix", "x"],
  area_hectares: 442.0,
  buffer_zone_hectares: 320.0,
  short_description: "日本最大級のブナ天然林を中心とする山地生態系。",
  unesco_site_url: "https://whc.unesco.org/en/list/663",
  state_party_codes: ["JPN"],
  state_parties_meta: { JPN: { is_primary: true, inscription_year: 1993 } },
  thumbnail: "http://localhost/storage/world_heritage/663/img1.jpg",
};

// ===== Tests =====
describe("TopPageContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and shows items", async () => {
    fetchTopFirstPageMock.mockResolvedValueOnce([HIMEJI, YAKUSHIMA]);

    render(<TopPageContainer />);

    // 初期ローディング
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    // データ表示
    await waitFor(() => {
      expect(screen.getByText("Himeji-jo")).toBeInTheDocument();
      expect(screen.getByText("Yakushima")).toBeInTheDocument();
    });
  });

  it("shows error then reload works", async () => {
    fetchTopFirstPageMock
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce([SHIRAKAMI]);

    render(<TopPageContainer />);

    // エラー表示
    await waitFor(() => {
      expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
    });

    // リトライ
    fireEvent.click(screen.getByText(/Retry/i));

    // 成功後にアイテム表示
    await waitFor(() => {
      expect(screen.getByText("Shirakami-Sanchi")).toBeInTheDocument();
    });
  });
});

import { describe, it, expect } from "@jest/globals";
import {
  parseHeritageSearchParams,
  serializeHeritageSearchParams,
} from "../search-heritages.params.ts";
import { DEFAULT_HERITAGE_SEARCH_PARAMS } from "../search-heritage.types.ts";
import type { HeritageSearchParams } from "../../../../../domain/types.ts";

const baseParams = (overrides: Partial<HeritageSearchParams> = {}): HeritageSearchParams => ({
  ...DEFAULT_HERITAGE_SEARCH_PARAMS,
  ...overrides,
});

describe("parseHeritageSearchParams", () => {
  it("is_endangered=true is parsed as true", () => {
    const params = parseHeritageSearchParams("?is_endangered=true");
    expect(params.is_endangered).toBe(true);
  });

  it("is_endangered=false is treated as no filter (null)", () => {
    const params = parseHeritageSearchParams("?is_endangered=false");
    expect(params.is_endangered).toBeNull();
  });

  it("missing is_endangered defaults to null", () => {
    const params = parseHeritageSearchParams("?region=Asia");
    expect(params.is_endangered).toBeNull();
  });

  it("garbage is_endangered values fall back to null", () => {
    const params = parseHeritageSearchParams("?is_endangered=banana");
    expect(params.is_endangered).toBeNull();
  });
});

describe("serializeHeritageSearchParams", () => {
  it("emits is_endangered=true when params.is_endangered is true", () => {
    const queryString = serializeHeritageSearchParams(baseParams({ is_endangered: true }));
    expect(queryString).toContain("is_endangered=true");
  });

  it("omits is_endangered when null", () => {
    const queryString = serializeHeritageSearchParams(baseParams({ is_endangered: null }));
    expect(queryString).not.toContain("is_endangered");
  });

  it("omits is_endangered when false", () => {
    const queryString = serializeHeritageSearchParams(baseParams({ is_endangered: false }));
    expect(queryString).not.toContain("is_endangered");
  });
});

describe("round-trip", () => {
  it("preserves is_endangered=true through serialize -> parse", () => {
    const queryString = serializeHeritageSearchParams(baseParams({ is_endangered: true }));
    const parsed = parseHeritageSearchParams(queryString);
    expect(parsed.is_endangered).toBe(true);
  });

  it("preserves is_endangered=null through serialize -> parse", () => {
    const queryString = serializeHeritageSearchParams(baseParams({ is_endangered: null }));
    const parsed = parseHeritageSearchParams(queryString);
    expect(parsed.is_endangered).toBeNull();
  });
});

describe("parseHeritageSearchParams (criteria)", () => {
  it("parses comma-separated criteria values", () => {
    const params = parseHeritageSearchParams("?criteria=ii,iv");
    expect(params.criteria).toStrictEqual(["ii", "iv"]);
  });

  it("missing criteria defaults to []", () => {
    const params = parseHeritageSearchParams("?region=Asia");
    expect(params.criteria).toStrictEqual([]);
  });

  it("empty criteria value defaults to []", () => {
    const params = parseHeritageSearchParams("?criteria=");
    expect(params.criteria).toStrictEqual([]);
  });

  it("filters out invalid codes", () => {
    const params = parseHeritageSearchParams("?criteria=ii,xx,iv");
    expect(params.criteria).toStrictEqual(["ii", "iv"]);
  });

  it("dedupes and sorts by CRITERIA order", () => {
    const params = parseHeritageSearchParams("?criteria=v,ii,ii,i");
    expect(params.criteria).toStrictEqual(["i", "ii", "v"]);
  });
});

describe("serializeHeritageSearchParams (criteria)", () => {
  it("emits criteria as comma-separated when non-empty", () => {
    const queryString = serializeHeritageSearchParams(baseParams({ criteria: ["ii", "iv"] }));
    expect(queryString).toContain("criteria=ii%2Civ");
  });

  it("omits criteria when empty", () => {
    const queryString = serializeHeritageSearchParams(baseParams({ criteria: [] }));
    expect(queryString).not.toContain("criteria");
  });
});

describe("round-trip (criteria)", () => {
  it("preserves single value", () => {
    const queryString = serializeHeritageSearchParams(baseParams({ criteria: ["iii"] }));
    const parsed = parseHeritageSearchParams(queryString);
    expect(parsed.criteria).toStrictEqual(["iii"]);
  });

  it("preserves multiple values in canonical order", () => {
    const queryString = serializeHeritageSearchParams(baseParams({ criteria: ["v", "ii", "i"] }));
    const parsed = parseHeritageSearchParams(queryString);
    expect(parsed.criteria).toStrictEqual(["i", "ii", "v"]);
  });

  it("preserves empty array", () => {
    const queryString = serializeHeritageSearchParams(baseParams({ criteria: [] }));
    const parsed = parseHeritageSearchParams(queryString);
    expect(parsed.criteria).toStrictEqual([]);
  });
});

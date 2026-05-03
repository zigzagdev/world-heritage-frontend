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

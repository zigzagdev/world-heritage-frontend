import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { WorldHeritageVm } from "../types";
import { fetchTopFirstPage } from "../apis";
import { toWorldHeritageListVm } from "../mappers/to-world-heritage-vm";
import TopPage from "../components/TopPage";

const dummyItem: WorldHeritageVm = {
  id: 999999,
  officialName: "Dummy Site For UI Test",
  name: "Dummy Site For UI Test",
  nameJp: "UIテスト用ダミー世界遺産",
  country: "Japan",
  region: "Asia",
  stateParty: "Japan",
  category: "Cultural",
  criteria: [],
  yearInscribed: 2099,
  areaHectares: 12345,
  bufferZoneHectares: 67890,
  isEndangered: false,
  latitude: null,
  longitude: null,
  shortDescription:
    "これはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きます",
  unescoSiteUrl: "#",
  statePartyCodes: [],
  statePartiesMeta: {},
  thumbnail: undefined,
  title: "UIテスト用ダミーサイト",
  subtitle: "Japan · Asia",
  areaText: "12,345 ha",
  bufferText: "67,890 ha",
  criteriaText: "",
  primaryStatePartyCode: null,
};

export default function TopPageContainer(): React.ReactElement {
  const [items, setItems] = useState<WorldHeritageVm[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);
  const [reloadTick, setReloadTick] = useState<number>(0);

  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(() => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setIsLoading(true);
    setError(null);

    fetchTopFirstPage({ signal: ac.signal })
      .then(toWorldHeritageListVm)
      .then((vmList) => {
        setItems(vmList);
      })
      .catch((err: unknown) => {
        if ((err as { name?: string }).name === "AbortError") return;
        setItems([]);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load, reloadTick]);

  const handleReload = useCallback(() => {
    setReloadTick((n) => n + 1);
  }, []);

  const uiItems = useMemo(() => (items.length ? [dummyItem, ...items] : [dummyItem]), [items]);

  const pageProps = useMemo(
    () => ({
      items: uiItems,
      onReload: handleReload,
    }),
    [uiItems, handleReload],
  );

  if (isLoading) {
    return (
      <main className="p-6">
        <div>Loading…</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 space-y-3">
        <div className="text-red-700">Failed to load.</div>
        <button type="button" onClick={handleReload} className="underline">
          Retry
        </button>
      </main>
    );
  }

  return <TopPage {...pageProps} />;
}

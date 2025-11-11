import React, { useMemo } from "react";
import TopPage from "@features/top/components/TopPage";
import { useTopPage } from "@features/top/hooks/use-top-page";
import type { WorldHeritageVm } from "@features/top/types";

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
    "これはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きますこれはUIテスト用のダミーデータです。説明文を長くして折りたたみ表示(Read more)の挙動を確認するために使います。とても長い説明が続きます…とても長い説明が続きます…とても長い説明が続きます",
  unescoSiteUrl: "#",
  statePartyCodes: [],
  statePartiesMeta: {},
  thumbnail: undefined,
  title: "UIテスト用ダミーサイト",
  subtitle: "Japan · Asia",
  areaText: "12,345 ha",
  bufferText: "67,890 ha",
  criteriaText: "",
};

export default function App(): React.ReactElement {
  const { items, reload, isLoading, isError, error } = useTopPage();

  const uiItems = useMemo(() => (items.length ? [dummyItem, ...items] : items), [items]);

  if (isLoading) {
    return <main className="p-6">Loading…</main>;
  }
  if (isError) {
    return (
      <main className="p-6 space-y-3">
        <div className="text-red-700">Failed to load.</div>
        <pre className="text-xs opacity-70">{String(error)}</pre>
        <button type="button" onClick={reload} className="underline">
          Retry
        </button>
      </main>
    );
  }

  return (
    <TopPage items={uiItems} onReload={reload} onClickItem={(id) => console.log("clicked", id)} />
  );
}

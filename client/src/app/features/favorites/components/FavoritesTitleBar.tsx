import { useText } from "@shared/locale/ui-text.ts";

export function FavoritesTitleBar() {
  const text = useText();
  return (
    <div className="sticky top-[49px] z-20 -mx-4 border-b border-zinc-200 bg-white/95 px-4 pb-4 pt-4 backdrop-blur">
      <h1 className="text-3xl font-extrabold tracking-tight text-indigo-700">
        {text.favoritesListTitle}
      </h1>
    </div>
  );
}

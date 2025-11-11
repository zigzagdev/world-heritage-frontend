import type { ReactNode } from "react";

type BaseCardProps = {
  children: ReactNode;
  as?: "li" | "div";
  onClick?: () => void;
};

export function BaseCard({ children, as = "li", onClick }: BaseCardProps) {
  const Wrapper = as;

  return (
    <Wrapper
      className="
            group list-none overflow-hidden rounded-2xl border border-zinc-200/70
            bg-white/70 shadow-sm backdrop-blur transition
            hover:shadow-md dark:border-zinc-800
            dark:bg-zinc-900/70 min-h-[600px]"
    >
      <button
        type="button"
        onClick={onClick}
        className="
                    block w-full text-left focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {children}
      </button>
    </Wrapper>
  );
}

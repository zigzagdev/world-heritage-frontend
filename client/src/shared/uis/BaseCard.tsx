import type { ReactNode } from "react";

type BaseCardProps = {
  children: ReactNode;
  as?: "li" | "div";
  onClick?: () => void;
};

export function BaseCard({ children, as = "div", onClick }: BaseCardProps) {
  const Wrapper = as;

  const isInteractive = typeof onClick === "function";

  const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (e) => {
    if (!isInteractive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Wrapper
      className="
        group overflow-hidden rounded-2xl border border-zinc-200/70
        bg-white/70 shadow-sm backdrop-blur transition hover:shadow-md
        dark:border-zinc-800 dark:bg-zinc-900/70 min-h-[600px]
      "
      {...(isInteractive
        ? {
            role: "button",
            tabIndex: 0,
            onClick,
            onKeyDown: handleKeyDown,
          }
        : {})}
    >
      {children}
    </Wrapper>
  );
}

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Button } from "./Button.tsx";

export function ErrorPanel({
  message = "Something went wrong.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50/60 px-6 py-12 text-center">
      <ErrorOutlineIcon className="!text-4xl !text-red-500" />
      <p className="text-sm font-semibold text-zinc-700">{message}</p>
      {onRetry && (
        <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

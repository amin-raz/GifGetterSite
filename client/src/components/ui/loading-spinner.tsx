import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div role="status" className={cn("flex items-center justify-center", className)}>
      <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

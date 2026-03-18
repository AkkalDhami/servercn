"use client";

export function Method({ value }: { value: string }) {
  const styles =
    value === "GET"
      ? "bg-green-500/10 text-green-600 border-green-500/30"
      : value === "POST"
        ? "bg-orange-500/10 text-orange-600 border-orange-500/30"
        : value === "PUT"
          ? "bg-sky-blue/10 text-blue-600 border-blue-500/30"
          : value === "PATCH"
            ? "bg-sky-500/10 text-sky-600 border-sky-500/30"
            : value === "DELETE"
              ? "bg-red-500/10 text-red-600 border-red-500/30"
              : "bg-purple-500/10 text-purple-600 border-purple-500/30";

  return (
    <span
      className={`rounded-md border px-2 py-1 font-mono text-xs font-medium ${styles}`}>
      {value}
    </span>
  );
}

export function Endpoint({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-muted rounded-md px-1 py-1 font-mono text-xs">
      {children}
    </span>
  );
}

export function Auth({ value }: { value: boolean }) {
  return !value ? (
    <span className="font-medium text-green-600">Yes</span>
  ) : (
    <span className="text-muted-foreground">No</span>
  );
}

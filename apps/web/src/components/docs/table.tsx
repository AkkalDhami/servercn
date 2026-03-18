"use client";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 w-full overflow-x-auto rounded-md border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-muted">{children}</thead>;
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({ children }: { children: React.ReactNode }) {
  return <tr className="border-edge border-t">{children}</tr>;
}

export function TH({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left font-medium">{children}</th>;
}

export function TD({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3">{children}</td>;
}

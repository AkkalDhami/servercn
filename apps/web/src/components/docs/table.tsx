"use client";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <table className="typeset-scroll scroll-fade-x w-full scrollbar-none rounded-lg border text-sm *:[table]:w-full">
      {children}
    </table>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-muted">{children}</thead>;
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({ children }: { children: React.ReactNode }) {
  return <tr className="border-edge hover:bg-muted border-t">{children}</tr>;
}

export function TH({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left font-medium">{children}</th>;
}

export function TD({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3">{children}</td>;
}

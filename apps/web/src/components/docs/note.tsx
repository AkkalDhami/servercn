export default function Note({ text }: { text: string }) {
  return (
    <div className="bg-muted xsm:max-w[360px] text-muted-primary my-3 flex max-w-[320px] gap-2 rounded-md border border-neutral-300 px-2 py-2 md:max-w-200 dark:border-neutral-900">
      <p className="text-sm leading-relaxed sm:text-base">{text}</p>
    </div>
  );
}

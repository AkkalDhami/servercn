export default function Note({ text }: { text: string }) {
  return (
    <div className="xsm:max-w[360px] my-3 flex max-w-[320px] gap-2 rounded-md border border-blue-300 bg-blue-500/10 px-2 py-2 text-blue-600 md:max-w-200 dark:border-blue-900">
      <p className="text-sm leading-relaxed sm:text-base">{text}</p>
    </div>
  );
}

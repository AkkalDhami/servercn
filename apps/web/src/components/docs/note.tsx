export default function Note({ text }: { text: string }) {
  return (
    <div className="xsm:max-w[360px] text my-3 flex max-w-[320px] gap-2 rounded-lg border border-blue-300 bg-blue-500/10 px-3 py-2 text-blue-500 sm:py-2.5 md:max-w-200 dark:border-blue-800">
      <p className="text-base leading-relaxed font-medium tracking-wide">
        {text}
      </p>
    </div>
  );
}

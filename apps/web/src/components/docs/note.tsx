export default function Note({ text }: { text: string }) {
  return (
    <div className="text my-3 flex gap-2 rounded-lg border border-blue-300 bg-blue-500/10 px-3 py-2 text-blue-500 sm:py-2.5 md:max-w-300 dark:border-blue-900">
      <p className="text-base leading-relaxed font-medium tracking-wide">
        {text}
      </p>
    </div>
  );
}

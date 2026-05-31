export default function Warning({ text }: { text: string }) {
  return (
    <div className="text my-3 flex gap-2 rounded-lg border border-yellow-300 bg-yellow-500/10 px-3 py-2 text-yellow-600 sm:py-2.5 dark:border-yellow-950">
      <p className="text-base leading-relaxed font-medium tracking-wide">
        {text}
      </p>
    </div>
  );
}

export default function Note({ text }: { text: string }) {
  return (
    <div className="my-3 flex gap-2 rounded-md border border-blue-300 bg-blue-500/10 px-2 py-2 text-blue-500 dark:border-blue-900">
      <p className="text-sm leading-relaxed sm:text-base">{text}</p>
    </div>
  );
}

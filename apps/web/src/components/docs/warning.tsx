export default function Warning({ text }: { text: string }) {
  return (
    <div className="my-3 flex gap-2 rounded-md border border-yellow-300 bg-yellow-500/10 px-2 py-2 text-yellow-600 dark:border-yellow-900">
      <p className="text-sm sm:text-base">{text}</p>
    </div>
  );
}

export default function Warning({ text }: { text: string }) {
  return (
    <div className="flex my-3 gap-2 rounded-md bg-yellow-500/10 px-2 py-2 text-yellow-600">
      <p className="text-sm sm:text-base">{text}</p>
    </div>
  );
}

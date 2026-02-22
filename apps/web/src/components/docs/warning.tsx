export default function Warning({ text }: { text: string }) {
  return (
    <div className="xsm:max-w[360px] text my-3 flex max-w-[320px] gap-2 border-l-4 border-yellow-500 bg-yellow-500/10 px-3 py-2 text-yellow-600 sm:py-2.5 md:max-w-200">
      <p className="text-base leading-relaxed font-medium tracking-wide">
        {text}
      </p>
    </div>
  );
}

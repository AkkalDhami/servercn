export default function Note({ text }: { text: string }) {
  return (
    <div className="xsm:max-w[360px] my-3 flex max-w-[320px] gap-2 border-l-4 text border-blue-500 bg-blue-500/10 sm:pl-3 sm:py-2.5 px-2 py-2 text-blue-500 md:max-w-200">
      <p className="leading-relaxed tracking-wide font-medium text-base">{text}</p>
    </div>
  );
}

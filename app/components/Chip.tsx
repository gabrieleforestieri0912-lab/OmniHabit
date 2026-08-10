export default function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.12em] text-white/60">
      {label}
    </span>
  );
}

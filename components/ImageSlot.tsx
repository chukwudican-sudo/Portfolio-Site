import { ImagePlaceholderIcon } from "./icons";

export function ImageSlot({ label = "Photo coming soon" }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border border-dashed border-[rgba(242,237,228,0.16)]">
      <ImagePlaceholderIcon className="text-[rgba(242,237,228,0.3)]" />
      <p className="m-0 font-mono text-[11px] text-text-faint">{label}</p>
    </div>
  );
}

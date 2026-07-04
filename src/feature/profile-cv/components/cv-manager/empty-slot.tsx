import { CloudUpload, FilePlus } from "lucide-react";
import { useRef } from "react";

export default function EmptySlot({
  slotNumber,
  onUpload,
  uploading,
}: {
  slotNumber: number;
  onUpload: (file: File) => void;
  uploading: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  };

  const isFirst = slotNumber === 2;

  return (
    <div
      className="group flex h-44 cursor-pointer items-center justify-center
        rounded-2xl border-2 border-dashed border-[#D1D5DB] bg-[#F3F4F6]/30 p-6
        transition-all hover:border-[#059669] hover:bg-white"
      onClick={() => ref.current?.click()}
    >
      <div className="flex flex-col items-center space-y-3 text-center">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full
            bg-[#D1D5DB]/50 transition-colors group-hover:bg-[#D1FAE5]"
        >
          {uploading ? (
            <div
              className="h-5 w-5 animate-spin rounded-full border-2
                border-[#059669] border-t-transparent"
            />
          ) : isFirst ? (
            <CloudUpload
              className="h-5 w-5 text-[#4B5563] transition-colors
                group-hover:text-[#059669]"
            />
          ) : (
            <FilePlus
              className="h-5 w-5 text-[#4B5563] transition-colors
                group-hover:text-[#059669]"
            />
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-[#064E3B]">Empty Slot</p>
          <p className="text-xs text-[#4B5563]">
            {isFirst ? "Support PDF, DOCX (Max 5MB)" : "Available Slot"}
          </p>
        </div>
        <button
          type="button"
          className="pointer-events-none rounded-lg bg-[#F3F4F6] px-6 py-2
            text-xs font-extrabold text-[#064E3B] transition-all
            group-hover:bg-[#059669] group-hover:text-white"
        >
          {isFirst ? "Upload CV" : "Quick Upload"}
        </button>
      </div>
      <input
        ref={ref}
        type="file"
        accept=".pdf,.docx,.doc"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

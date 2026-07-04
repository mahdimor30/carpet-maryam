import { Check, FileText, MoreVertical, X } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CvSlot {
  id: number;
  filename: string | null;
  label: string;
  size: string | null;
  uploadedAt: string | null;
}

export function UploadedSlot({
  slot,
  onRemove,
  onLabelChange,
}: {
  slot: CvSlot;
  onRemove: (id: number) => void;
  onLabelChange: (id: number, label: string) => void;
}) {
  const [editLabel, setEditLabel] = useState(false);
  const [localLabel, setLocalLabel] = useState(slot.label);

  return (
    <div
      className="editorial-shadow flex h-44 flex-col justify-between rounded-2xl
      border-2 border-[#059669] bg-white p-6"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#D1FAE5]">
            <FileText className="h-6 w-6 text-[#059669]" />
          </div>

          <div className="min-w-0 overflow-hidden">
            <p
              className="truncate text-sm font-bold text-[#064E3B]"
              title={slot.filename ?? ""}
            >
              {slot.filename}
            </p>

            <p className="text-xs text-[#4B5563]">
              Uploaded {slot.uploadedAt} • {slot.size}
            </p>
          </div>
        </div>

        {/* ✅ shadcn menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="p-1 text-[#4B5563] transition-colors hover:text-[#059669]"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => onRemove(slot.id)}
              className="text-red-600 focus:text-red-600"
            >
              <X className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Label */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold tracking-widest text-[#4B5563] uppercase">
          Label / Tag
        </label>

        {editLabel ? (
          <div className="flex gap-2">
            <input
              autoFocus
              type="text"
              value={localLabel}
              onChange={(e) => setLocalLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onLabelChange(slot.id, localLabel);
                  setEditLabel(false);
                }
                if (e.key === "Escape") {
                  setEditLabel(false);
                  setLocalLabel(slot.label);
                }
              }}
              className="flex-1 rounded-lg bg-[#F3F4F6] px-3 py-1.5 text-xs font-bold text-[#059669] outline-none focus:ring-1 focus:ring-[#059669]"
            />

            <button
              onClick={() => {
                onLabelChange(slot.id, localLabel);
                setEditLabel(false);
              }}
              className="rounded-lg bg-[#059669] p-1.5 text-white"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditLabel(true)}
            className="w-full rounded-lg bg-[#F3F4F6] px-3 py-1.5 text-left text-xs font-bold text-[#059669] hover:bg-[#E5E7EB] focus:ring-1 focus:ring-[#059669]"
          >
            {slot.label || (
              <span className="text-[#9CA3AF]">Add a label…</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
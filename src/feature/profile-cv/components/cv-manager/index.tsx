import { useState } from "react";
import { useCvManager } from "../../hooks/use-cv-manager";
import EmptySlot from "./empty-slot";
import { UploadedSlot } from "./uploaded-slot";

const MAX_SLOTS = 5;

export function CvManager() {
  const { cvs, isLoading, uploadCv, removeCv, renameCv } = useCvManager();
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleUpload = async (file: File, index: number) => {
    setUploadingIndex(index);
    await uploadCv(file);
    setUploadingIndex(null);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  // ساختن ۵ اسلات
  const slots = Array.from({ length: MAX_SLOTS }).map((_, index) => {
    return cvs[index] ?? null;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#064E3B]">
          My CVs & Resumes
        </h2>

        <span className="text-xs font-bold">
          {cvs.length} / {MAX_SLOTS}
        </span>
      </div>

      {/* Slots */}
      <div className="space-y-4">
        {slots.map((cv, index) => {
          if (cv) {
            return (
              <UploadedSlot
                key={cv.id}
                slot={{
                  id: cv.id!,
                  filename: cv.document?.split("/").pop() ?? "CV",
                  label: cv.version_name,
                  size: null,
                  uploadedAt: cv.updated_at,
                }}
                onRemove={removeCv}
                onLabelChange={renameCv}
              />
            );
          }

          return (
            <EmptySlot
              key={index}
              slotNumber={index + 1}
              onUpload={(file) => handleUpload(file, index)}
              uploading={uploadingIndex === index}
            />
          );
        })}
      </div>
    </div>
  );
}
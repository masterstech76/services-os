import * as React from "react";
import { businessConfig } from "@config/business.config";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhotoUploader, type UploadedPhotoItem } from "@/components/booking/PhotoUploader";

export interface StepIssueProps {
  issueText: string;
  issueError: string | null;
  photos: UploadedPhotoItem[];
  onChangeIssueText: (text: string) => void;
  onChangePhotos: (photos: UploadedPhotoItem[]) => void;
}

export function StepIssue({
  issueText,
  issueError,
  photos,
  onChangeIssueText,
  onChangePhotos,
}: StepIssueProps) {
  return (
    <section aria-labelledby="step-3-heading" className="space-y-5">
      <div>
        <h1
          id="step-3-heading"
          className="font-heading text-[26px] sm:text-[30px] leading-tight font-extrabold text-white"
        >
          Tell us what&apos;s going on
        </h1>
        <p className="text-sm text-slate-300 mt-1">
          Sharing symptoms helps your technician bring the right parts on the truck.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label htmlFor="issue-textarea" className="text-slate-300 text-xs mb-0">
            Issue description
          </Label>
          <span className="text-xs tabular-nums text-slate-400">
            {issueText.length}/500
          </span>
        </div>
        <Textarea
          id="issue-textarea"
          data-testid="issue-textarea"
          maxLength={500}
          placeholder="AC is blowing warm air since last night…"
          value={issueText}
          onChange={(e) => onChangeIssueText(e.target.value)}
          aria-invalid={!!issueError}
          aria-describedby={issueError ? "issue-error" : undefined}
          className="bg-[#0B1320] border-white/15 text-white placeholder:text-slate-500 rounded-xl"
        />
        {issueError && (
          <p id="issue-error" role="alert" className="mt-1.5 text-xs font-medium text-red-400">
            {issueError}
          </p>
        )}
      </div>

      <div>
        <Label className="text-slate-300 text-xs mb-1 block">Add photos (optional, up to {businessConfig.booking.maxPhotos})</Label>
        <p className="text-xs text-slate-400 mb-3">
          Photos of the unit, thermostat, or error code label help us prepare.
        </p>
        <PhotoUploader
          photos={photos}
          maxPhotos={businessConfig.booking.maxPhotos}
          onChange={onChangePhotos}
        />
      </div>
    </section>
  );
}

"use client";

import { EditRecipe } from "@/lib/types";
import { Maximize2, Crop } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  recipe: EditRecipe;
  onChange: (patch: Partial<EditRecipe>) => void;
}

export default function FramingControl({ recipe, onChange }: Props) {
  const framePositionX = recipe.framePositionX ?? 50;
  const framePositionY = recipe.framePositionY ?? 50;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(["fit", "fill"] as const).map((mode) => {
          const Icon = mode === "fit" ? Maximize2 : Crop;
          const active = recipe.framing === mode;
          return (
            <button
              type="button"
              key={mode}
              title={mode === "fit" ? "Fit: Adds black bars (letterbox) to fill empty space" : "Fill: Crops the video to fill the entire frame"}
              onClick={() => onChange({ framing: mode })}
              className={cn(
                "flex-1 min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-2 py-4 rounded-lg border transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]",
                active
                  ? "border-film-500 bg-film-50 text-film-700"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-film-300 bg-[var(--surface)]"
              )}
            >
              <Icon size={18} aria-hidden="true" />
              <span className="sr-only">
                Set framing to {mode === "fit" ? "fit within frame" : "fill frame by cropping"}
              </span>
              <div className="text-center">
                <p className="text-xs font-heading font-semibold uppercase tracking-wider">
                  {mode === "fit" ? "Fit" : "Fill"}
                </p>
                <p className="text-[10px] text-[var(--muted)] mt-0.5">
                  {mode === "fit" ? "Letterbox / pillarbox" : "Crop to frame"}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {recipe.framing === "fill" && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--muted)]">
              Crop position
            </p>
            <button
              type="button"
              onClick={() => onChange({ framePositionX: 50, framePositionY: 50 })}
              className="text-[10px] font-heading font-bold uppercase tracking-wider text-film-500 hover:underline"
            >
              Center
            </button>
          </div>

          <label className="block space-y-1">
            <span className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>Horizontal</span>
              <span>{framePositionX}%</span>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={framePositionX}
              onChange={(event) => onChange({ framePositionX: Number(event.target.value) })}
              className="w-full accent-film-500"
              aria-label="Horizontal crop position"
            />
          </label>

          <label className="block space-y-1">
            <span className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>Vertical</span>
              <span>{framePositionY}%</span>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={framePositionY}
              onChange={(event) => onChange({ framePositionY: Number(event.target.value) })}
              className="w-full accent-film-500"
              aria-label="Vertical crop position"
            />
          </label>
        </div>
      )}
    </div>
  );
}

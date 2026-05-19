"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColorVariant, SizeGuideData } from "@/types";
import { cn } from "@/lib/utils";

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    colorVariants?: ColorVariant[];
    sizeGuideData?: SizeGuideData | null;
}

const sizeMapping: Record<string, string> = {
    XXS: "UK04 - XXS", XS: "UK06 - XS", S: "UK08 - S",
    M: "UK10 - M", L: "UK12 - L", XL: "UK14 - XL", XXL: "UK16 - XXL",
};
const displaySize = (s: string) => sizeMapping[s] || s;

function SlashOverlay() {
    return (
        <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-inherit pointer-events-none">
            <span className="block w-[140%] h-px bg-gray-400 rotate-[-45deg]" />
        </span>
    );
}

export function SizeGuideModal({ isOpen, onClose, colorVariants, sizeGuideData }: SizeGuideModalProps) {
    const hasColors = colorVariants && colorVariants.length > 0;
    const [activeColor, setActiveColor] = useState<string | null>(
        hasColors ? colorVariants![0].colorHex : null
    );
    const [unit, setUnit] = useState<'CM' | 'INCH'>(
        sizeGuideData?.unit === 'CM' ? 'CM' : 'INCH'
    );

    const activeVariant = hasColors
        ? colorVariants!.find(cv => cv.colorHex === activeColor) ?? colorVariants![0]
        : null;

    const isColorOos = (cv: ColorVariant) => cv.sizes.every(s => s.stock === 0);
    const showBothUnits = sizeGuideData?.unit === 'BOTH';

    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-foreground border border-gray-200">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold uppercase tracking-widest">
                        Sizes & Colors
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pb-2">

                    {/* ── Color toggles ── */}
                    {hasColors && (
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Select Color</p>
                                <div className="flex flex-wrap gap-4">
                                    {colorVariants!.map(cv => {
                                        const oos = isColorOos(cv);
                                        const isActive = activeColor === cv.colorHex;
                                        return (
                                            <button
                                                key={cv.colorHex}
                                                onClick={() => setActiveColor(cv.colorHex)}
                                                className="flex flex-col items-center gap-1.5"
                                            >
                                                {/* Circle with optional slash */}
                                                <span className={cn(
                                                    "relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                                                    isActive ? "border-black scale-110 shadow-md" : "border-gray-200 hover:border-gray-400 hover:scale-105",
                                                    oos && "opacity-60"
                                                )}
                                                    style={{ backgroundColor: cv.colorHex }}>
                                                    {oos && <SlashOverlay />}
                                                </span>
                                                <span className={cn(
                                                    "text-[10px] uppercase tracking-wide",
                                                    isActive ? "font-semibold text-black" : "text-gray-400",
                                                    oos && "line-through text-gray-300"
                                                )}>
                                                    {cv.colorName || cv.colorHex}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ── Sizes for active color ── */}
                            {activeVariant && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                                        Available Sizes — {activeVariant.colorName || activeVariant.colorHex}
                                    </p>
                                    {activeVariant.sizes.length === 0 ? (
                                        <p className="text-sm text-gray-400">No sizes set for this color.</p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {activeVariant.sizes.map(s => {
                                                const oos = s.stock === 0;
                                                return (
                                                    <div key={s.size} className={cn(
                                                        "relative flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-full border text-sm select-none overflow-hidden",
                                                        oos
                                                            ? "border-dashed border-gray-200 bg-gray-50"
                                                            : "border-gray-200 bg-white"
                                                    )}>
                                                        <span className={cn(
                                                            "font-medium text-xs",
                                                            oos ? "text-gray-300" : "text-gray-800"
                                                        )}>
                                                            {displaySize(s.size)}
                                                        </span>
                                                        <span className={cn(
                                                            "text-[9px] font-semibold",
                                                            oos ? "text-red-300" : "text-green-600"
                                                        )}>
                                                            {oos ? "Out of stock" : `${s.stock} left`}
                                                        </span>
                                                        {oos && <SlashOverlay />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {sizeGuideData && <hr className="border-gray-100" />}
                        </div>
                    )}

                    {/* ── Measurement chart ── */}
                    {sizeGuideData && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                    {sizeGuideData.name} — Measurements
                                </p>
                                {showBothUnits && (
                                    <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
                                        {(['CM', 'INCH'] as const).map(u => (
                                            <button key={u} onClick={() => setUnit(u)}
                                                className={cn(
                                                    "px-3 py-1 font-medium transition-colors",
                                                    unit === u ? "bg-black text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                                                )}>
                                                {u}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {sizeGuideData.note && (
                                <p className="text-xs text-gray-500 italic">{sizeGuideData.note}</p>
                            )}

                            {!showBothUnits && (
                                <span className="inline-block text-xs font-semibold px-2 py-0.5 bg-gray-100 rounded text-gray-600 uppercase">
                                    {sizeGuideData.unit}
                                </span>
                            )}

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-600">Size</th>
                                            {(sizeGuideData.columns as string[]).map((col, i) => (
                                                <th key={i} className="border border-gray-200 px-3 py-2 text-center text-xs font-semibold text-gray-600">
                                                    {col}{showBothUnits && <span className="ml-1 text-gray-400 font-normal">({unit})</span>}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(sizeGuideData.rows as { size: string; values: string[] }[]).map((row, i) => (
                                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                                <td className="border border-gray-200 px-3 py-2 font-semibold text-gray-800">
                                                    {displaySize(row.size)}
                                                </td>
                                                {row.values.map((val, j) => (
                                                    <td key={j} className="border border-gray-200 px-3 py-2 text-center text-gray-600">
                                                        {val || '—'}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {!hasColors && !sizeGuideData && (
                        <p className="text-center text-sm text-gray-400 py-4">
                            No size guide available for this product.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

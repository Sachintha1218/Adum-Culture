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

                    {/* ── Color availability section ── */}
                    {hasColors && (
                        <div className="space-y-4">
                            {/* Color toggles */}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Select Color</p>
                                <div className="flex flex-wrap gap-3">
                                    {colorVariants!.map(cv => (
                                        <button
                                            key={cv.colorHex}
                                            onClick={() => setActiveColor(cv.colorHex)}
                                            className={cn(
                                                "flex flex-col items-center gap-1.5 group"
                                            )}
                                        >
                                            <span className={cn(
                                                "w-9 h-9 rounded-full border-2 transition-all block",
                                                activeColor === cv.colorHex
                                                    ? "border-black scale-110 shadow-md"
                                                    : "border-gray-200 hover:border-gray-400 hover:scale-105"
                                            )}
                                                style={{ backgroundColor: cv.colorHex }}
                                            />
                                            <span className={cn(
                                                "text-[10px] uppercase tracking-wide",
                                                activeColor === cv.colorHex ? "font-semibold text-black" : "text-gray-400"
                                            )}>
                                                {cv.colorName || cv.colorHex}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size availability for selected color */}
                            {activeVariant && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                                        Available Sizes — {activeVariant.colorName || activeVariant.colorHex}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {activeVariant.sizes.length === 0 && (
                                            <p className="text-sm text-gray-400">No sizes set for this color.</p>
                                        )}
                                        {activeVariant.sizes.map(s => (
                                            <div key={s.size} className={cn(
                                                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg border text-sm",
                                                s.stock > 0
                                                    ? "border-gray-200 bg-white"
                                                    : "border-dashed border-gray-200 bg-gray-50 opacity-50"
                                            )}>
                                                <span className={cn(
                                                    "font-medium",
                                                    s.stock === 0 && "line-through text-gray-400"
                                                )}>{s.size}</span>
                                                <span className={cn(
                                                    "text-[10px] font-semibold",
                                                    s.stock > 0 ? "text-green-600" : "text-red-400"
                                                )}>
                                                    {s.stock > 0 ? `${s.stock} left` : "Out of stock"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {sizeGuideData && <hr className="border-gray-100" />}
                        </div>
                    )}

                    {/* ── Measurement chart section ── */}
                    {sizeGuideData && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                    {sizeGuideData.name} — Measurements
                                </p>
                                {/* CM / INCH toggle */}
                                {(showBothUnits) && (
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
                                                    {col}
                                                    {showBothUnits && <span className="ml-1 text-gray-400 font-normal">({unit})</span>}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(sizeGuideData.rows as { size: string; values: string[] }[]).map((row, i) => (
                                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                                <td className="border border-gray-200 px-3 py-2 font-semibold text-gray-800">{row.size}</td>
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

                    {/* Fallback if nothing set */}
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

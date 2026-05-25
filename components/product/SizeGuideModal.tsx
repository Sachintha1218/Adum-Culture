"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColorVariant, SizeGuideData } from "@/types";
import { cn } from "@/lib/utils";

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    colorVariants?: ColorVariant[];      // kept for API compat, no longer rendered
    sizeGuideData?: SizeGuideData | null;
}

const INCH_TO_CM = 2.54;

function convertValue(val: string, storedUnit: string, displayUnit: 'CM' | 'INCH'): string {
    const n = parseFloat(val);
    if (isNaN(n) || val.trim() === '') return val || '—';
    if (storedUnit === displayUnit) return String(n);
    if (storedUnit === 'INCH' && displayUnit === 'CM') return (n * INCH_TO_CM).toFixed(1);
    if (storedUnit === 'CM' && displayUnit === 'INCH') return (n / INCH_TO_CM).toFixed(1);
    return String(n);
}

export function SizeGuideModal({ isOpen, onClose, sizeGuideData }: SizeGuideModalProps) {
    // Normalise legacy "BOTH" → "INCH" so conversion always works
    const storedUnit: 'CM' | 'INCH' = sizeGuideData?.unit === 'CM' ? 'CM' : 'INCH';
    const [unit, setUnit] = useState<'CM' | 'INCH'>(storedUnit);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [hoveredCol, setHoveredCol] = useState<number | null>(null);

    const rows = (sizeGuideData?.rows ?? []) as { size: string; values: string[] }[];
    const columns = (sizeGuideData?.columns ?? []) as string[];

    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-foreground border border-gray-200">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold uppercase tracking-widest">
                        Sizes & Colors
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pb-2">
                    {sizeGuideData ? (
                        <div className="space-y-4">
                            {/* Header row: title + CM/INCH toggle */}
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                    {sizeGuideData.name} — Measurements
                                </p>
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
                            </div>

                            {sizeGuideData.note && (
                                <p className="text-xs text-gray-500 italic">{sizeGuideData.note}</p>
                            )}

                            {/* Measurement table with crosshair highlight */}
                            <div className="overflow-x-auto"
                                onMouseLeave={() => { setHoveredRow(null); setHoveredCol(null) }}>
                                <table className="w-full text-sm border-collapse select-none">
                                    <thead>
                                        <tr>
                                            {/* Size header cell — corner */}
                                            <th
                                                className="border border-gray-200 px-3 py-2.5 text-left text-xs font-semibold text-gray-600 bg-gray-50"
                                                onMouseEnter={() => { setHoveredRow(null); setHoveredCol(null) }}
                                            >
                                                Size
                                            </th>
                                            {columns.map((col, ci) => (
                                                <th
                                                    key={ci}
                                                    onMouseEnter={() => { setHoveredCol(ci); setHoveredRow(null) }}
                                                    className={cn(
                                                        "border border-gray-200 px-3 py-2.5 text-center text-xs font-semibold cursor-default transition-colors",
                                                        hoveredCol === ci
                                                            ? "bg-gray-900 text-white"
                                                            : "bg-gray-50 text-gray-600"
                                                    )}
                                                >
                                                    {col}
                                                    <span className={cn(
                                                        "ml-1 font-normal",
                                                        hoveredCol === ci ? "text-gray-300" : "text-gray-400"
                                                    )}>
                                                        ({unit})
                                                    </span>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, ri) => (
                                            <tr
                                                key={ri}
                                                onMouseEnter={() => { setHoveredRow(ri); setHoveredCol(null) }}
                                            >
                                                {/* Size label cell */}
                                                <td className={cn(
                                                    "border border-gray-200 px-3 py-2.5 font-semibold text-xs transition-colors",
                                                    hoveredRow === ri
                                                        ? "bg-gray-900 text-white"
                                                        : "bg-white text-gray-800"
                                                )}>
                                                    {row.size}
                                                </td>
                                                {/* Data cells */}
                                                {row.values.map((val, ci) => {
                                                    const isRowHovered = hoveredRow === ri;
                                                    const isColHovered = hoveredCol === ci;
                                                    return (
                                                        <td
                                                            key={ci}
                                                            onMouseEnter={() => { setHoveredRow(ri); setHoveredCol(ci) }}
                                                            className={cn(
                                                                "border border-gray-200 px-3 py-2.5 text-center text-sm transition-colors",
                                                                isRowHovered && isColHovered
                                                                    ? "bg-gray-900 text-white font-semibold"
                                                                    : isRowHovered
                                                                    ? "bg-gray-100 text-gray-900"
                                                                    : isColHovered
                                                                    ? "bg-gray-100 text-gray-900"
                                                                    : ri % 2 === 0
                                                                    ? "bg-white text-gray-600"
                                                                    : "bg-gray-50/50 text-gray-600"
                                                            )}
                                                        >
                                                            {convertValue(val, storedUnit, unit)}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-sm text-gray-400 py-4">
                            No size guide available for this product.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const sizeData = [
    { int: "XS", uk: "UK 6", bust: 30, waist: 26, hip: 34 },
    { int: "S", uk: "UK 8", bust: 32, waist: 28, hip: 36 },
    { int: "M", uk: "UK 10", bust: 34, waist: 30, hip: 38 },
    { int: "L", uk: "UK 12", bust: 36, waist: 32, hip: 40 },
    { int: "XL", uk: "UK 14", bust: 38, waist: 34, hip: 42 },
    { int: "2XL", uk: "UK 16", bust: 42, waist: 35.5, hip: 46 },
    { int: "3XL", uk: "UK 18", bust: 44, waist: 37.5, hip: 48 },
];

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl bg-zinc-950 text-zinc-50 border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-center font-serif text-3xl uppercase tracking-widest mb-6 mt-4">
                        ADUM CULTURE SIZE GUIDE
                    </DialogTitle>
                </DialogHeader>
                <div className="overflow-x-auto pb-4 px-2">
                    <table className="w-full text-base sm:text-lg text-center border-collapse border-[1px] border-zinc-200 dark:border-zinc-800">
                        <thead>
                            <tr className="border-[1px] border-zinc-200 dark:border-zinc-800">
                                <th className="py-4 px-2 font-medium tracking-wider uppercase border-[1px] border-zinc-200 dark:border-zinc-800">Size (INT)</th>
                                <th className="py-4 px-2 font-medium tracking-wider uppercase border-[1px] border-zinc-200 dark:border-zinc-800">Size (UK)</th>
                                <th className="py-4 px-2 font-medium tracking-wider uppercase border-[1px] border-zinc-200 dark:border-zinc-800">Bust</th>
                                <th className="py-4 px-2 font-medium tracking-wider uppercase border-[1px] border-zinc-200 dark:border-zinc-800">Waist</th>
                                <th className="py-4 px-2 font-medium tracking-wider uppercase border-[1px] border-zinc-200 dark:border-zinc-800">Hip</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sizeData.map((row) => (
                                <tr key={row.int}>
                                    <td className="py-4 px-2 border-[1px] border-zinc-200 dark:border-zinc-800">{row.int}</td>
                                    <td className="py-4 px-2 border-[1px] border-zinc-200 dark:border-zinc-800">{row.uk}</td>
                                    <td className="py-4 px-2 border-[1px] border-zinc-200 dark:border-zinc-800">{row.bust}</td>
                                    <td className="py-4 px-2 border-[1px] border-zinc-200 dark:border-zinc-800">{row.waist}</td>
                                    <td className="py-4 px-2 border-[1px] border-zinc-200 dark:border-zinc-800">{row.hip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DialogContent>
        </Dialog>
    );
}

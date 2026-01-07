import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Flame, Trophy, PlayCircle, RotateCcw, ScrollText } from "lucide-react";
import { cn } from "./PlayerCard"; // reusing cn

const LogIcon = ({ entry }) => {
    if (entry.includes("KEBAKAR")) return <Flame className="text-red-500" size={16} />;
    if (entry.includes("PEMENANG")) return <Trophy className="text-yellow-400" size={16} />;
    if (entry.includes("Game direset")) return <RotateCcw className="text-blue-400" size={16} />;
    if (entry.includes("GAME BARU")) return <PlayCircle className="text-green-400" size={16} />;
    return <ScrollText className="text-gray-400" size={16} />;
};

export const HistoryLog = ({ history, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl mt-6 overflow-hidden max-h-[500px] flex flex-col"
        >
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <History className="text-white/50" />
                    Log Aktivitas
                </h3>
                <button
                    onClick={onClose}
                    className="text-white/50 hover:text-white transition-colors text-sm"
                >
                    Tutup
                </button>
            </div>

            <div className="overflow-y-auto space-y-2 pr-2 custom-scrollbar flex-1">
                {history.length === 0 ? (
                    <div className="text-center py-10 text-white/20 italic">
                        Belum ada aktivitas tercatat
                    </div>
                ) : (
                    history.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-start gap-3 hover:bg-white/10 transition-colors"
                        >
                            <div className="mt-1 bg-white/5 p-1.5 rounded-lg">
                                <LogIcon entry={item.entry} />
                            </div>
                            <div className="flex-1">
                                <div className="text-white/80 text-sm leading-relaxed font-medium">
                                    {item.entry}
                                </div>
                                <div className="text-white/30 text-xs mt-1 font-mono">
                                    {item.time}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

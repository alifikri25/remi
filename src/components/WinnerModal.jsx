import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import { cn } from "./PlayerCard";

export const WinnerModal = ({ winner }) => {
    return (
        <AnimatePresence>
            {winner && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.5, y: 100 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.5, y: 100, opacity: 0 }}
                        className="relative max-w-lg w-full bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-xl border border-yellow-500/30 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(234,179,8,0.3)] overflow-hidden"
                    >
                        {/* Animated Background Elements */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent,rgba(234,179,8,0.1),transparent)]"
                            />
                        </div>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="relative z-10 mx-auto w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full flex items-center justify-center shadow-2xl mb-6"
                        >
                            <Trophy size={64} className="text-white drop-shadow-md" />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 mb-2 relative z-10"
                        >
                            PEMENANG!
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-2xl font-bold text-white mb-6 relative z-10"
                        >
                            {winner.name || `Pemain ${winner.id}`}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="inline-block bg-black/30 rounded-2xl px-8 py-4 border border-white/10 relative z-10"
                        >
                            <div className="text-sm text-white/50 uppercase tracking-wider mb-1">Total Score</div>
                            <div className="text-5xl font-black text-white tracking-tight">{winner.score}</div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-8 text-white/40 text-sm relative z-10"
                        >
                            Memulai game baru dalam beberapa detik...
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

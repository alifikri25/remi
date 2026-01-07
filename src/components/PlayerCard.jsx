import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Crown, Edit2, Plus, GripVertical } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const QuickButton = ({ value, onClick }) => (
    <button
        onClick={onClick}
        className="px-2 py-1 text-xs font-bold rounded bg-white/10 hover:bg-white/20 text-white/80 transition-colors border border-white/5"
    >
        +{value}
    </button>
);

export const PlayerCard = ({
    player,
    isHighest,
    inputValue,
    onInputChange,
    onBurn,
    onUpdateName,
    isBurning,
    disabled
}) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(player.name);

    const isDanger = player.score >= 100;

    const handleQuickAdd = (amount) => {
        const currentVal = parseInt(inputValue || "0", 10);
        if (isNaN(currentVal)) {
            onInputChange(amount.toString());
        } else {
            onInputChange((currentVal + amount).toString());
        }
    };

    const handleNameSubmit = () => {
        onUpdateName(player.id, tempName);
        setIsEditingName(false);
    };

    const burnVariants = {
        idle: { scale: 1, rotate: 0, opacity: 1, y: 0, filter: "brightness(1)" },
        burning: {
            scale: [1, 1.2, 0.8, 1.1, 0],
            rotate: [0, -10, 10, -20, 20, 720],
            y: [0, -30, -10, -100, -200],
            opacity: [1, 1, 0.8, 0.5, 0],
            filter: ["brightness(1)", "brightness(1.5)", "brightness(2)", "brightness(5)", "brightness(0)"],
            transition: { duration: 2.5, times: [0, 0.2, 0.4, 0.6, 1] }
        }
    };

    return (
        <motion.div
            layout
            variants={burnVariants}
            initial="idle"
            animate={isBurning ? "burning" : "idle"}
            className={cn(
                "relative overflow-hidden rounded-3xl backdrop-blur-xl border border-white/10 p-6 transition-all",
                isDanger ? "bg-red-900/10 shadow-[0_0_40px_-5px_rgba(220,38,38,0.3)] border-red-500/30" : "bg-white/5"
            )}
        >
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Leaderboard Badge */}
            <AnimatePresence>
                {isHighest && player.score > 0 && (
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="absolute top-0 right-8 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 text-yellow-300 px-3 py-1 rounded-b-xl shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center gap-1.5 z-20"
                    >
                        <Crown size={14} fill="currentColor" />
                        <span className="text-xs font-bold tracking-wider">LEADER</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 flex flex-col gap-6">
                {/* Header: Name & Edit */}
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        {isEditingName ? (
                            <input
                                autoFocus
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onBlur={handleNameSubmit}
                                onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                                className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white placeholder-white/30 outline-none focus:border-yellow-500/50 transition-colors"
                                placeholder="Nama Pemain"
                            />
                        ) : (
                            <div
                                className="group flex items-center gap-2 cursor-pointer"
                                onClick={() => !disabled && setIsEditingName(true)}
                            >
                                <h3 className="font-bold text-lg text-white/90 truncate max-w-[150px]">
                                    {player.name || `Pemain ${player.id}`}
                                </h3>
                                <Edit2 className="w-3 h-3 text-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Score Display */}
                <div className="text-center py-2 relative">
                    <motion.div
                        key={player.score}
                        initial={{ scale: 1.5, filter: "blur(10px)" }}
                        animate={{ scale: 1, filter: "blur(0px)" }}
                        className={cn(
                            "text-6xl font-black tracking-tighter",
                            isDanger
                                ? "text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-orange-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                                : "text-white drop-shadow-xl"
                        )}
                    >
                        {player.score}
                    </motion.div>
                    {isDanger && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute -bottom-4 left-0 right-0 flex justify-center items-center gap-1 text-red-500 text-xs font-bold uppercase tracking-widest"
                        >
                            <Flame size={12} className="animate-pulse" />
                            Siaga Terbakar
                            <Flame size={12} className="animate-pulse" />
                        </motion.div>
                    )}
                </div>

                {/* Input Section */}
                <div className="space-y-3 pt-2">
                    <div className="bg-black/20 rounded-xl p-1 flex items-center border border-white/5 focus-within:border-white/20 transition-colors">
                        <input
                            type="text"
                            inputMode="decimal"
                            value={inputValue}
                            onChange={(e) => onInputChange(e.target.value)}
                            disabled={disabled}
                            placeholder="0"
                            className="w-full bg-transparent text-center text-xl font-bold text-white placeholder-white/10 outline-none py-2"
                        />
                    </div>

                    {!disabled && (
                        <div className="flex justify-center gap-2">
                            <QuickButton value={10} onClick={() => handleQuickAdd(10)} />
                            <QuickButton value={25} onClick={() => handleQuickAdd(25)} />
                            <QuickButton value={50} onClick={() => handleQuickAdd(50)} />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
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
    isPunching, // New prop
    disabled
}) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(player.name);

    // Motion value for animated score
    const scoreMV = useMotionValue(player.score);
    const displayScore = useTransform(scoreMV, (latest) => Math.round(latest));

    useEffect(() => {
        if (isPunching) {
            // Countdown to 0 when punching starts
            const controls = animate(scoreMV, 0, { duration: 2, ease: "easeInOut" });
            return () => controls.stop();
        } else {
            // Sync with real score otherwise
            scoreMV.set(player.score);
        }
    }, [isPunching, player.score]);

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

    // Punch animation variants
    const puncherVariants = {
        hidden: { x: "150%", opacity: 0 },
        enter: { x: 0, opacity: 1, transition: { duration: 0.5, type: "spring" } },
        punching: {
            x: [-5, 40, -5], // Back up, punch forward, return
            transition: {
                repeat: Infinity,
                duration: 0.2,
                repeatType: "mirror"
            }
        },
        exit: { x: "150%", opacity: 0, transition: { duration: 0.3 } }
    };

    return (
        <motion.div
            layout
            variants={burnVariants}
            initial="idle"
            animate={
                isBurning
                    ? "burning"
                    : {
                        opacity: 1,
                        scale: 1,
                        // Shake effect when punching
                        x: isPunching ? [0, -5, 5, -5, 5, 0] : 0,
                        borderColor: isDanger ? "rgba(239, 68, 68, 0.5)" : "rgba(255, 255, 255, 0.1)",
                        boxShadow: isDanger
                            ? "0 0 40px -10px rgba(220, 38, 38, 0.5)"
                            : "0 10px 30px -10px rgba(0, 0, 0, 0.5)"
                    }
            }
            transition={{
                duration: isPunching ? 0.1 : 0.5,
                repeat: isPunching ? Infinity : 0
            }}
            className={cn(
                "relative overflow-hidden rounded-3xl backdrop-blur-xl border border-white/10 p-6 transition-all",
                isDanger ? "bg-red-900/10" : "bg-white/5"
            )}
        >
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Punisher Character */}
            <AnimatePresence>
                {isPunching && (
                    <motion.div
                        variants={puncherVariants}
                        initial="hidden"
                        animate="enter"
                        exit="exit"
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none flex items-center pr-4"
                        onAnimationComplete={(definition) => {
                            // When entrance completes, start punching loop. 
                            // Note: 'animate' prop handling in framer-motion usually overrides this, 
                            // but we can assume 'enter' just transitions in. 
                            // Using a secondary motion div for the punch action is often cleaner, 
                            // but here we can just let app controls handle timing or use keyframes in 'enter' if needed.
                            // Actually best approach for looping punch logic:
                        }}
                    >
                        <motion.div
                            animate={{ x: [10, -50, 10] }} // The actual punch motion relative to container
                            transition={{ repeat: Infinity, duration: 0.15, repeatDelay: 0.1, ease: "linear" }}
                            className="text-6xl filter drop-shadow-2xl"
                        >
                            🥊
                        </motion.div>
                        <motion.div
                            className="text-5xl absolute right-[-20px]"
                            animate={{ rotate: [0, 10, -10, 0] }}
                        >
                            👺
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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

                {/* Score Display (Updated to use displayScore) */}
                <div className="text-center py-2 relative">
                    <motion.div
                        key="score-display" // Stable key to prevent unmouting 
                        className={cn(
                            "text-6xl font-black tracking-tighter",
                            isDanger || isPunching
                                ? "text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-orange-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                                : "text-white drop-shadow-xl"
                        )}
                    >
                        <motion.span>{displayScore}</motion.span>
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

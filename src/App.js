import React, { useState } from "react";
import { PlayerCard } from "./components/PlayerCard";
import { HistoryLog } from "./components/HistoryLog";
import { WinnerModal } from "./components/WinnerModal";
import { RotateCcw, History, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function App() {
  const [players, setPlayers] = useState([
    { id: 1, name: "", score: 0 },
    { id: 2, name: "", score: 0 },
    { id: 3, name: "", score: 0 },
    { id: 4, name: "", score: 0 },
  ]);
  const [roundInputs, setRoundInputs] = useState({});
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [burning, setBurning] = useState([]);
  const [winner, setWinner] = useState(null);

  const updateName = (id, name) => {
    setPlayers(players.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const addHistory = (entry) => {
    const timestamp = new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
    setHistory((prev) => [{ time: timestamp, entry }, ...prev]);
  };

  const handleInputChange = (id, value) => {
    setRoundInputs({ ...roundInputs, [id]: value });
  };

  const finishRound = () => {
    const hasInput = Object.values(roundInputs).some((v) => v && v.toString().trim());
    if (!hasInput) {
      alert("Masukkan point untuk minimal 1 pemain!");
      return;
    }

    // 1. Identify players at risk (score >= 100 BEFORE round starts)
    const playersAtRisk = players.filter(p => p.score >= 100).map(p => p.id);

    const newPlayers = [...players];
    const changes = [];
    const activeMovingPlayerIds = [];

    // 2. Calculate input changes
    newPlayers.forEach((player) => {
      const input = roundInputs[player.id] || "";
      if (input.toString().trim()) {
        try {
          // Safe eval for math expressions
          const mathExpression = input.toString().replace(/[^0-9+\-*/().]/g, "");
          const change = Function('"use strict"; return (' + mathExpression + ")")();

          if (!isNaN(change) && change !== 0) {
            const oldScore = player.score;
            player.score = oldScore + change;
            activeMovingPlayerIds.push(player.id);

            changes.push({
              id: player.id,
              name: player.name || "Pemain " + player.id,
              oldScore,
              newScore: player.score,
              change,
            });
          }
        } catch (e) { }
      }
    });

    // 3. Determine who burns
    // A player burns if they were at risk AND someone else moved
    const playersToBurn = playersAtRisk.filter(riskId => {
      const otherPlayersMoved = activeMovingPlayerIds.some(moverId => moverId !== riskId);
      return otherPlayersMoved;
    });

    // 4. Handle Winners (Check based on potentially updated scores, but burning happens simultaneously/after?)
    // Usually burn takes precedence or happens alongside.
    // Let's apply burns to the state visually via 'burning' state first, then commit the zero score.

    if (playersToBurn.length > 0) {
      setBurning(playersToBurn);
      playersToBurn.forEach(burnId => {
        const victim = players.find(p => p.id === burnId);
        // Identify who caused the burn (the movers)
        const perpetrators = changes
          .filter(c => c.id !== burnId)
          .map(c => c.name)
          .join(", ");

        addHistory(`🔥 ${victim.name || "Pemain " + burnId} terbakar otomatis karena ${perpetrators} masuk poin!`);
      });

      // Delay the actual score reset to allow animation to play
      setTimeout(() => {
        setPlayers(prevPlayers => prevPlayers.map(p =>
          playersToBurn.includes(p.id) ? { ...p, score: 0 } : p
        ));
        setBurning([]);
      }, 2500);
    }

    // 5. Update State for non-burning (or burning, they will just get overwritten by timeout if they burned)
    // Actually, we should update the scores immediately so we see the "move" of others, 
    // and the "burn" animation of the victim.
    // If a victim also moved, their score currently updates in 'newPlayers' then gets reset to 0 in timeout.
    // This is correct behavior: shows them trying to move, then burning.

    setPlayers(newPlayers);

    changes.forEach((c) => {
      // Don't log normal moves for burning players if we want to reduce noise, 
      // but logging everything is safer for audit.
      addHistory(
        `Ronde ${roundNumber} - ${c.name}: ${c.oldScore} → ${c.newScore} (${c.change >= 0 ? "+" : ""}${c.change})`
      );
    });

    // Valid Winner Check
    // A winner is someone >= 1000 AND NOT burning.
    // If you burn, you can't win this round.
    const potentialWinners = newPlayers.filter((p) => p.score >= 1000 && !playersToBurn.includes(p.id));

    if (potentialWinners.length > 0) {
      const topWinner = potentialWinners.sort((a, b) => b.score - a.score)[0];
      setWinner(topWinner);
      addHistory(
        `🏆 PEMENANG: ${topWinner.name || "Pemain " + topWinner.id} dengan ${topWinner.score} point!`
      );
      setTimeout(() => {
        setPlayers(players.map((p) => ({ ...p, score: 0 })));
        setWinner(null);
        setRoundNumber(1);
        addHistory("=== GAME BARU DIMULAI ===");
      }, 5000);
      setRoundInputs({});
      return;
    }

    setRoundNumber(roundNumber + 1);
    setRoundInputs({});
  };

  const resetGame = () => {
    if (window.confirm("Reset semua point dan mulai dari awal?")) {
      setPlayers(players.map((p) => ({ ...p, score: 0 })));
      setHistory([]);
      setRoundNumber(1);
      setRoundInputs({});
      setBurning([]);
      setWinner(null);
      addHistory("Game direset");
    }
  };

  const highestScore = Math.max(...players.map(p => p.score));

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white p-4 md:p-8 font-sans overflow-x-hidden selection:bg-yellow-500/30 relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-orange-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-yellow-700/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block relative"
          >
            <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-orange-500 to-yellow-500 opacity-20" />
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-yellow-200 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl mb-2">
              REMI TELUK ANGSAN
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-lg uppercase tracking-widest font-medium"
          >
            Skor di atas 100? Hati-hati terbakar! 🔥
          </motion.p>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="mt-6 inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md"
          >
            <span className="text-yellow-500 font-bold">RONDE</span>
            <span className="bg-white/10 px-3 py-1 rounded-md font-mono font-bold text-xl">{roundNumber}</span>
          </motion.div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isHighest={player.score === highestScore && player.score > 0}
              inputValue={roundInputs[player.id] || ""}
              onInputChange={(val) => handleInputChange(player.id, val)}
              onUpdateName={updateName}
              isBurning={burning.includes(player.id)}
              disabled={!!winner}
            />
          ))}
        </div>

        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent z-40 md:relative md:bg-none md:p-0">
          <div className="max-w-6xl mx-auto flex gap-4 md:justify-center">
            <button
              onClick={finishRound}
              disabled={!!winner}
              className="flex-1 md:flex-none md:w-64 bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_30px_rgba(22,163,74,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 size={24} />
              Selesai Ronde
            </button>
            <button
              onClick={resetGame}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold backdrop-blur-md border border-white/10 transition-colors"
              title="Reset Game"
            >
              <RotateCcw size={24} />
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={cn(
                "px-6 py-4 rounded-xl font-bold backdrop-blur-md border border-white/10 transition-colors flex items-center gap-2",
                showHistory ? "bg-blue-600/80 text-white" : "bg-white/10 hover:bg-white/20 text-white"
              )}
              title="Riwayat"
            >
              <History size={24} />
              <span className="hidden md:inline">Riwayat</span>
            </button>
          </div>
        </div>

        {/* History Log Section */}
        <div className="mb-24 md:mb-12">
          <HistoryLog
            history={history}
            isOpen={showHistory}
            onClose={() => setShowHistory(false)}
          />
        </div>

        <WinnerModal winner={winner} />
      </div>

      {/* Helper function needed for inline class calculation if any remain */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
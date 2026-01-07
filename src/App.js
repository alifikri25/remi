import React, { useState } from "react";
import { Flame, Edit2, RotateCcw, History, Trophy } from "lucide-react";

export default function RemiTelukAngsan() {
  const [players, setPlayers] = useState([
    { id: 1, name: "", score: 0 },
    { id: 2, name: "", score: 0 },
    { id: 3, name: "", score: 0 },
    { id: 4, name: "", score: 0 },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [roundInputs, setRoundInputs] = useState({});
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [burning, setBurning] = useState([]);
  const [winner, setWinner] = useState(null);

  const updateName = (id, name) => {
    setPlayers(players.map((p) => (p.id === id ? { ...p, name } : p)));
    setEditingId(null);
  };

  const burnPlayer = (playerId) => {
    const player = players.find((p) => p.id === playerId);
    if (player.score === 0) return;

    setBurning([playerId]);
    addHistory(
      `🔥 ${player.name || "Pemain " + playerId} KEBAKAR MANUAL! (${
        player.score
      } → 0)`
    );

    setTimeout(() => {
      setPlayers(
        players.map((p) => (p.id === playerId ? { ...p, score: 0 } : p))
      );
      setBurning([]);
    }, 2500);
  };

  const finishRound = () => {
    const hasInput = Object.values(roundInputs).some((v) => v && v.trim());
    if (!hasInput) {
      alert("Masukkan point untuk minimal 1 pemain!");
      return;
    }

    const newPlayers = [...players];
    const changes = [];

    newPlayers.forEach((player) => {
      const input = roundInputs[player.id] || "";
      if (input.trim()) {
        try {
          const mathExpression = input.replace(/[^0-9+\-*/().]/g, "");
          const change = Function(
            '"use strict"; return (' + mathExpression + ")"
          )();

          if (!isNaN(change)) {
            const oldScore = player.score;
            player.score = oldScore + change;

            changes.push({
              id: player.id,
              name: player.name || "Pemain " + player.id,
              oldScore,
              newScore: player.score,
              change,
            });
          }
        } catch (e) {}
      }
    });

    const winners = newPlayers.filter((p) => p.score >= 1000);
    if (winners.length > 0) {
      const topWinner = winners.sort((a, b) => b.score - a.score)[0];
      setWinner(topWinner);
      addHistory(
        `🏆 PEMENANG: ${topWinner.name || "Pemain " + topWinner.id} dengan ${
          topWinner.score
        } point!`
      );
      setTimeout(() => {
        setPlayers(players.map((p) => ({ ...p, score: 0 })));
        setWinner(null);
        setRoundNumber(1);
        addHistory("=== GAME BARU DIMULAI ===");
      }, 4000);
      setRoundInputs({});
      return;
    }

    setPlayers(newPlayers);

    changes.forEach((c) => {
      addHistory(
        `Ronde ${roundNumber} - ${c.name}: ${c.oldScore} → ${c.newScore} (${
          c.change >= 0 ? "+" : ""
        }${c.change})`
      );
    });

    setRoundNumber(roundNumber + 1);
    setRoundInputs({});
  };

  const addHistory = (entry) => {
    const timestamp = new Date().toLocaleTimeString("id-ID");
    setHistory((prev) => [{ time: timestamp, entry }, ...prev]);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 blur-3xl bg-yellow-500/20 animate-pulse"></div>
          <h1 className="text-5xl font-bold text-white mb-2 relative drop-shadow-2xl animate-pulse">
            🔥 REMI TELUK ANGSAN 🔥
          </h1>
          <p className="text-yellow-200 text-lg relative">
            Hati-hati! Point di atas 100 bisa kebakar!
          </p>
          <div className="text-white text-2xl font-bold mt-4 bg-gray-900/50 inline-block px-6 py-2 rounded-full">
            RONDE {roundNumber}
          </div>
        </div>

        {winner && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-pulse">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-12 rounded-3xl text-center shadow-2xl">
              <Trophy className="w-32 h-32 text-white mx-auto mb-4 animate-bounce" />
              <h2 className="text-5xl font-bold text-white mb-4">PEMENANG!</h2>
              <p className="text-3xl font-bold text-gray-900">
                {winner.name || "Pemain " + winner.id}
              </p>
              <p className="text-6xl font-bold text-white mt-4">
                {winner.score}
              </p>
              <p className="text-xl text-white mt-4">Memulai game baru...</p>
            </div>
          </div>
        )}

        <style>{`
          @keyframes megaBurn {
            0% { transform: translateX(0) translateY(0) scale(1) rotate(0deg); filter: brightness(1); }
            5% { transform: translateX(-15px) translateY(-30px) scale(1.2) rotate(-10deg); filter: brightness(1.5); }
            10% { transform: translateX(15px) translateY(-50px) scale(0.7) rotate(10deg); filter: brightness(2); }
            15% { transform: translateX(-20px) translateY(-20px) scale(1.3) rotate(-15deg); filter: brightness(1.8); }
            20% { transform: translateX(20px) translateY(-60px) scale(0.6) rotate(15deg); filter: brightness(2.2); }
            25% { transform: translateX(-15px) translateY(-40px) scale(1.4) rotate(-20deg); filter: brightness(2); }
            30% { transform: translateX(10px) translateY(-70px) scale(0.5) rotate(180deg); filter: brightness(2.5); }
            35% { transform: translateX(-25px) translateY(-30px) scale(1.5) rotate(-180deg); filter: brightness(2.2); }
            40% { transform: translateX(25px) translateY(-80px) scale(0.4) rotate(270deg); filter: brightness(3); }
            45% { transform: translateX(-20px) translateY(-50px) scale(1.6) rotate(-270deg); filter: brightness(2.5); }
            50% { transform: translateX(0) translateY(-100px) scale(0.3) rotate(360deg); filter: brightness(3.5); }
            55% { transform: translateX(-30px) translateY(-60px) scale(1.7) rotate(-360deg); filter: brightness(3); }
            60% { transform: translateX(30px) translateY(-90px) scale(0.4) rotate(450deg); filter: brightness(3.2); }
            65% { transform: translateX(-25px) translateY(-70px) scale(1.5) rotate(-450deg); filter: brightness(2.8); }
            70% { transform: translateX(20px) translateY(-80px) scale(0.5) rotate(540deg); filter: brightness(3); }
            75% { transform: translateX(-15px) translateY(-50px) scale(1.3) rotate(-540deg); filter: brightness(2.5); }
            80% { transform: translateX(10px) translateY(-60px) scale(0.6) rotate(630deg); filter: brightness(2.2); }
            85% { transform: translateX(-10px) translateY(-40px) scale(1.1) rotate(-630deg); filter: brightness(2); }
            90% { transform: translateX(5px) translateY(-30px) scale(0.8) rotate(720deg); filter: brightness(1.5); }
            95% { transform: translateX(-5px) translateY(-10px) scale(0.9) rotate(-720deg); filter: brightness(1.2); }
            100% { transform: translateX(0) translateY(0) scale(0.1) rotate(0deg); filter: brightness(0); opacity: 0; }
          }
          
          @keyframes explosion {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(2); opacity: 1; }
            100% { transform: scale(4); opacity: 0; }
          }
          
          @keyframes stars {
            0% { transform: translateY(0) scale(0) rotate(0deg); opacity: 0; }
            20% { transform: translateY(-40px) scale(1.5) rotate(180deg); opacity: 1; }
            80% { transform: translateY(-80px) scale(1.2) rotate(360deg); opacity: 1; }
            100% { transform: translateY(-120px) scale(0) rotate(540deg); opacity: 0; }
          }
          
          @keyframes smoke {
            0% { transform: translateY(0) scale(1); opacity: 0.8; }
            100% { transform: translateY(-100px) scale(2); opacity: 0; }
          }
          
          .burn-animation {
            animation: megaBurn 2.5s ease-in-out forwards;
          }
          
          .explosion-ring {
            animation: explosion 0.8s ease-out infinite;
          }
          
          .star-pop {
            animation: stars 1.5s ease-out infinite;
          }
          
          .smoke-rise {
            animation: smoke 2s ease-out infinite;
          }
        `}</style>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {players.map((player) => (
            <div
              key={player.id}
              className={`bg-gradient-to-br ${
                burning.includes(player.id)
                  ? "from-red-600 to-orange-600 burn-animation"
                  : "from-gray-800 to-gray-900"
              } rounded-2xl p-6 shadow-2xl border-4 ${
                player.score >= 100
                  ? "border-yellow-400 animate-pulse"
                  : "border-gray-700"
              } transition-all duration-500 relative overflow-hidden`}
            >
              {burning.includes(player.id) && (
                <>
                  <div className="absolute inset-0 bg-yellow-400/30 explosion-ring z-5"></div>
                  <div
                    className="absolute inset-0 bg-orange-500/30 explosion-ring z-5"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-red-600/30 explosion-ring z-5"
                    style={{ animationDelay: "0.4s" }}
                  ></div>

                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Flame className="w-64 h-64 text-yellow-300 animate-ping" />
                  </div>

                  <div className="absolute top-5 left-5 z-10">
                    <Flame className="w-24 h-24 text-orange-400 animate-bounce" />
                  </div>
                  <div className="absolute top-5 right-5 z-10">
                    <Flame
                      className="w-28 h-28 text-red-500 animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                  </div>
                  <div className="absolute bottom-5 left-5 z-10">
                    <Flame className="w-32 h-32 text-yellow-500 animate-pulse" />
                  </div>
                  <div className="absolute bottom-5 right-5 z-10">
                    <Flame
                      className="w-28 h-28 text-orange-600 animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>

                  <div className="absolute top-1/4 left-1/4 z-10">
                    <Flame className="w-20 h-20 text-red-400 animate-spin" />
                  </div>
                  <div className="absolute top-1/4 right-1/4 z-10">
                    <Flame
                      className="w-20 h-20 text-yellow-400 animate-spin"
                      style={{ animationDirection: "reverse" }}
                    />
                  </div>
                  <div className="absolute bottom-1/4 left-1/4 z-10">
                    <Flame
                      className="w-24 h-24 text-orange-500 animate-spin"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                  <div className="absolute bottom-1/4 right-1/4 z-10">
                    <Flame
                      className="w-24 h-24 text-red-500 animate-spin"
                      style={{
                        animationDirection: "reverse",
                        animationDelay: "0.3s",
                      }}
                    />
                  </div>

                  <div className="absolute top-10 left-1/2 z-15 text-6xl star-pop">
                    ⭐
                  </div>
                  <div
                    className="absolute top-10 left-1/2 z-15 text-6xl star-pop"
                    style={{ animationDelay: "0.3s" }}
                  >
                    💫
                  </div>
                  <div
                    className="absolute top-10 left-1/2 z-15 text-6xl star-pop"
                    style={{ animationDelay: "0.6s" }}
                  >
                    ✨
                  </div>
                  <div
                    className="absolute top-10 left-1/3 z-15 text-6xl star-pop"
                    style={{ animationDelay: "0.2s" }}
                  >
                    💥
                  </div>
                  <div
                    className="absolute top-10 right-1/3 z-15 text-6xl star-pop"
                    style={{ animationDelay: "0.4s" }}
                  >
                    ⚡
                  </div>

                  <div className="absolute bottom-0 left-1/4 z-8 text-8xl smoke-rise">
                    💨
                  </div>
                  <div
                    className="absolute bottom-0 right-1/4 z-8 text-8xl smoke-rise"
                    style={{ animationDelay: "0.5s" }}
                  >
                    💨
                  </div>
                  <div
                    className="absolute bottom-0 left-1/2 z-8 text-9xl smoke-rise"
                    style={{ animationDelay: "0.3s" }}
                  >
                    ☁️
                  </div>
                </>
              )}

              <div className="relative z-20">
                <div className="flex items-center justify-between mb-4">
                  {editingId === player.id ? (
                    <input
                      type="text"
                      defaultValue={player.name}
                      onBlur={(e) => updateName(player.id, e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        updateName(player.id, e.target.value)
                      }
                      autoFocus
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg flex-1 mr-2"
                      placeholder={`Pemain ${player.id}`}
                    />
                  ) : (
                    <h3 className="text-2xl font-bold text-white flex-1">
                      {player.name || `Pemain ${player.id}`}
                    </h3>
                  )}
                  <button
                    onClick={() => setEditingId(player.id)}
                    className="text-yellow-300 hover:text-yellow-100 p-2"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center mb-4">
                  <div
                    className={`text-6xl font-bold ${
                      player.score >= 100
                        ? "text-yellow-300 animate-bounce"
                        : "text-white"
                    }`}
                  >
                    {player.score}
                  </div>
                  {player.score >= 100 && (
                    <div className="text-red-300 text-sm font-bold mt-2 flex items-center justify-center gap-2">
                      <Flame className="w-4 h-4 animate-pulse" />
                      ZONA BAHAYA!
                      <Flame className="w-4 h-4 animate-pulse" />
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  value={roundInputs[player.id] || ""}
                  onChange={(e) =>
                    setRoundInputs({
                      ...roundInputs,
                      [player.id]: e.target.value,
                    })
                  }
                  placeholder="misal: +50 atau -35"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg text-center mb-3"
                  disabled={burning.length > 0 || winner}
                />

                <button
                  onClick={() => burnPlayer(player.id)}
                  disabled={burning.length > 0 || winner || player.score === 0}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  <Flame className="w-5 h-5" />
                  KEBAKAR!
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={finishRound}
            className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-xl shadow-xl transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={burning.length > 0 || winner}
          >
            ✅ SELESAI RONDE {roundNumber}
          </button>
          <button
            onClick={resetGame}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-4 rounded-lg font-bold flex items-center gap-2 shadow-xl transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Reset Game
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-lg font-bold flex items-center gap-2 shadow-xl transition-all"
          >
            <History className="w-5 h-5" />
            {showHistory ? "Tutup" : "Lihat"} Riwayat
          </button>
        </div>

        {showHistory && (
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border-4 border-gray-700 max-h-96 overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              📜 Riwayat Game
            </h3>
            {history.length === 0 ? (
              <p className="text-gray-400 text-center">Belum ada riwayat</p>
            ) : (
              <div className="space-y-2">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-700 p-3 rounded-lg text-white"
                  >
                    <span className="text-yellow-300 text-sm">
                      [{item.time}]
                    </span>
                    <span className="ml-2">{item.entry}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
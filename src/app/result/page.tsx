"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type DifficultyLevel = "easy" | "hard" | "difficult";

export default function ResultPage() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState<DifficultyLevel>("easy");
  const [isPerfectScore, setIsPerfectScore] = useState(false);

  useEffect(() => {
    const savedScore = localStorage.getItem("gameScore");
    const savedLevel = localStorage.getItem("gameLevel") as DifficultyLevel | null;
    
    if (savedScore && savedLevel) {
      const finalScore = parseInt(savedScore);
      setScore(finalScore);
      setLevel(savedLevel);
      setIsPerfectScore(finalScore === 5);
    } else {
      router.push("/");
    }
  }, [router]);

  const getLevelName = () => {
    switch (level) {
      case "easy": return "Easy Level";
      case "hard": return "Hard Level";
      case "difficult": return "Difficult Level";
    }
  };

  const getPerfectMessage = () => {
    switch (level) {
      case "easy": return "Excellent! You have mastered the Easy Level!";
      case "hard": return "Awesome! You conquered the Hard Level!";
      case "difficult": return "Incredible! You dominated the Difficult Level!";
    }
  };

  const getEmoji = () => {
    if (isPerfectScore) return "🏆";
    if (score >= 4) return "🎉";
    if (score >= 3) return "👍";
    return "💪";
  };

  const getMessage = () => {
    if (isPerfectScore) return "Perfect Score!";
    if (score >= 4) return "Great Job!";
    if (score >= 3) return "Good Work!";
    return "Keep Practicing!";
  };

  const handlePlayAgain = () => {
    localStorage.removeItem("gameScore");
    localStorage.removeItem("gameLevel");
    router.push(`/game?level=${level}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <main className="flex flex-col items-center justify-center gap-8 text-center max-w-md w-full">
        <div className="bg-white rounded-3xl p-8 shadow-xl w-full">
          <div className="text-6xl mb-4 animate-bounce">{getEmoji()}</div>
          
          {isPerfectScore && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xl py-4 px-6 rounded-2xl mb-6 shadow-lg animate-pulse">
              {getPerfectMessage()}
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {getMessage()}
          </h1>
          <p className="text-gray-600 mb-2">{getLevelName()}</p>
          <p className="text-gray-600 mb-6">Your Final Score</p>
          <div className="text-7xl font-bold text-blue-600 mb-2">
            {score}/5
          </div>
          <p className="text-gray-500">
            {Math.round((score / 5) * 100)}% Correct
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={handlePlayAgain}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl py-6 px-8 rounded-2xl shadow-lg transition-all duration-200 active:scale-95"
          >
            Play Again (Same Level)
          </button>
          
          <Link
            href="/levels"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xl py-6 px-8 rounded-2xl shadow-lg transition-all duration-200 active:scale-95"
          >
            Choose Different Level
          </Link>
          
          <Link
            href="/"
            className="w-full bg-white hover:bg-gray-50 text-gray-800 font-bold text-xl py-6 px-8 rounded-2xl shadow-lg transition-all duration-200 active:scale-95 border-2 border-gray-200"
          >
            Go to Home
          </Link>
        </div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";

export default function LevelsPage() {
  const levels = [
    {
      id: "easy",
      name: "Easy Level",
      description: "Simple addition and subtraction",
      time: "20 seconds per question",
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
      icon: "😊",
      questions: 5
    },
    {
      id: "hard",
      name: "Hard Level",
      description: "Multiplication and medium operations",
      time: "15 seconds per question",
      color: "from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700",
      icon: "🔥",
      questions: 5
    },
    {
      id: "difficult",
      name: "Difficult Level",
      description: "Mixed tough calculations",
      time: "10 seconds per question",
      color: "from-red-500 to-red-600",
      hoverColor: "hover:from-red-600 hover:to-red-700",
      icon: "🚀",
      questions: 5
    }
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-8">
      <main className="flex flex-col gap-8 max-w-2xl w-full">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-gray-800">
            Choose Your Level
          </h1>
          <p className="text-lg text-gray-600">
            Select a difficulty level to begin
          </p>
        </div>

        <div className="grid gap-6">
          {levels.map((level) => (
            <Link
              key={level.id}
              href={`/game?level=${level.id}`}
              className={`bg-gradient-to-r ${level.color} ${level.hoverColor} text-white rounded-2xl p-6 shadow-xl transition-all duration-200 active:scale-95 hover:shadow-2xl`}
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">{level.icon}</div>
                <div className="flex-1 text-left">
                  <h2 className="text-3xl font-bold mb-1">{level.name}</h2>
                  <p className="text-white/90 text-lg mb-1">{level.description}</p>
                  <div className="flex gap-4 text-sm text-white/80">
                    <span>⏱️ {level.time}</span>
                    <span>📝 {level.questions} questions</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="w-full bg-white hover:bg-gray-50 text-gray-800 font-bold text-xl py-4 px-8 rounded-2xl shadow-lg transition-all duration-200 active:scale-95 border-2 border-gray-300 text-center"
        >
          ← Back to Home
        </Link>
      </main>
    </div>
  );
}

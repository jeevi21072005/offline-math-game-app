"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <main className="flex flex-col items-center justify-center gap-8 text-center max-w-md w-full">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-blue-600 animate-bounce">
            NeuroCalc
          </h1>
          <p className="text-2xl text-purple-600 font-bold">
            Challenge Your Brain Power
          </p>
          <p className="text-lg text-gray-600 font-medium">
            Challenge Your Mind with Timed Math
          </p>
        </div>
        
        <div className="flex flex-col gap-4 w-full">
          <Link
            href="/levels"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-2xl py-7 px-8 rounded-2xl shadow-xl transition-all duration-200 active:scale-95 animate-pulse"
          >
            Play Now 🚀
          </Link>
          
          <Link
            href="/levels"
            className="w-full bg-white hover:bg-gray-50 text-gray-800 font-bold text-xl py-6 px-8 rounded-2xl shadow-lg transition-all duration-200 active:scale-95 border-2 border-gray-300"
          >
            Level Selection 🎯
          </Link>
        </div>
      </main>
    </div>
  );
}
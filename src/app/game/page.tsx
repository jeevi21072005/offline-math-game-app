"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type DifficultyLevel = "easy" | "hard" | "difficult";

type QuestionType = {
  question: string;
  correctAnswer: number;
  options: number[];
};

export default function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const levelParam = searchParams.get("level") as DifficultyLevel | null;
  
  const [level] = useState<DifficultyLevel>(levelParam || "easy");
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(20);
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const getLevelConfig = (level: DifficultyLevel) => {
    switch (level) {
      case "easy":
        return { 
          timer: 20, 
          operations: ["+", "-"], 
          minRange: 1, 
          maxRange: 20,
          name: "Easy Level",
          totalQuestions: 5
        };
      case "hard":
        return { 
          timer: 15, 
          operations: ["+", "-", "×"], 
          minRange: 10, 
          maxRange: 50,
          name: "Hard Level",
          totalQuestions: 5
        };
      case "difficult":
        return { 
          timer: 10, 
          operations: ["×", "mixed"], 
          minRange: 20, 
          maxRange: 100,
          name: "Difficult Level",
          totalQuestions: 5
        };
    }
  };

  const config = getLevelConfig(level);

  const generateQuestion = (level: DifficultyLevel): QuestionType => {
    const config = getLevelConfig(level);
    const operation = config.operations[Math.floor(Math.random() * config.operations.length)];
    
    let num1: number, num2: number, correctAnswer: number, questionText: string;
    
    if (operation === "+") {
      num1 = Math.floor(Math.random() * (config.maxRange - config.minRange + 1)) + config.minRange;
      num2 = Math.floor(Math.random() * (config.maxRange - config.minRange + 1)) + config.minRange;
      correctAnswer = num1 + num2;
      questionText = `${num1} + ${num2} = ?`;
    } else if (operation === "-") {
      num1 = Math.floor(Math.random() * (config.maxRange - config.minRange + 1)) + config.minRange;
      num2 = Math.floor(Math.random() * num1) + 1;
      correctAnswer = num1 - num2;
      questionText = `${num1} - ${num2} = ?`;
    } else if (operation === "×") {
      const multiplier = level === "difficult" ? 
        Math.floor(Math.random() * 8) + 3 : 
        Math.floor(Math.random() * 10) + 2;
      num1 = Math.floor(Math.random() * (config.maxRange - config.minRange + 1)) + config.minRange;
      num2 = multiplier;
      correctAnswer = num1 * num2;
      questionText = `${num1} × ${num2} = ?`;
    } else { // mixed (two-step for Difficult)
      const op1 = ["+", "-", "×"][Math.floor(Math.random() * 3)];
      const op2 = ["+", "-"][Math.floor(Math.random() * 2)];
      
      num1 = Math.floor(Math.random() * 30) + 20;
      num2 = Math.floor(Math.random() * 5) + 2;
      const num3 = Math.floor(Math.random() * 20) + 10;
      
      let intermediate: number;
      if (op1 === "+") intermediate = num1 + num2;
      else if (op1 === "-") intermediate = num1 - num2;
      else intermediate = num1 * num2;
      
      if (op2 === "+") correctAnswer = intermediate + num3;
      else correctAnswer = intermediate - num3;
      
      questionText = `(${num1} ${op1} ${num2}) ${op2} ${num3} = ?`;
    }
    
    // Generate wrong options
    const options = [correctAnswer];
    const variance = level === "difficult" ? 30 : level === "hard" ? 20 : 10;
    
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * variance * 2) - variance;
      const wrongAnswer = correctAnswer + offset;
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    return {
      question: questionText,
      correctAnswer,
      options,
    };
  };

  useEffect(() => {
    if (!levelParam) {
      router.push("/levels");
      return;
    }
    const newQuestion = generateQuestion(level);
    setQuestion(newQuestion);
    setTimeLeft(config.timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !isAnswered) {
      handleNextQuestion();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered]);

  const handleAnswer = (answer: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    if (answer === question?.correctAnswer) {
      setScore((prev) => prev + 1);
    }
    
    setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion >= config.totalQuestions) {
      localStorage.setItem("gameScore", score.toString());
      localStorage.setItem("gameLevel", level);
      router.push("/result");
      return;
    }
    
    setCurrentQuestion((prev) => prev + 1);
    const newQuestion = generateQuestion(level);
    setQuestion(newQuestion);
    setTimeLeft(config.timer);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  if (!question) return null;

  const getLevelColor = () => {
    switch (level) {
      case "easy": return "text-green-600 bg-green-100";
      case "hard": return "text-orange-600 bg-orange-100";
      case "difficult": return "text-red-600 bg-red-100";
    }
  };

  const getTimerColor = () => {
    const percentage = (timeLeft / config.timer) * 100;
    if (percentage <= 30) return "text-red-600";
    if (percentage <= 60) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-8">
      <main className="flex flex-col gap-6 max-w-md w-full">
        {/* Level Badge */}
        <div className="flex justify-center">
          <div className={`${getLevelColor()} px-6 py-3 rounded-full font-bold text-xl shadow-lg capitalize`}>
            {config.name}
          </div>
        </div>

        {/* Score and Timer */}
        <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-md">
          <div className="text-lg font-bold text-gray-700">
            Score: <span className="text-blue-600">{score}/{config.totalQuestions}</span>
          </div>
          <div className="text-lg font-bold text-gray-700">
            Question: <span className="text-purple-600">{currentQuestion}/{config.totalQuestions}</span>
          </div>
          <div className={`text-lg font-bold ${getTimerColor()}`}>
            ⏱️ {timeLeft}s
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 break-words">
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option, index) => {
            const isCorrect = option === question.correctAnswer;
            const isSelected = selectedAnswer === option;
            
            let bgColor = "bg-white hover:bg-gray-50";
            if (isAnswered) {
              if (isSelected && isCorrect) bgColor = "bg-green-500 text-white";
              else if (isSelected && !isCorrect) bgColor = "bg-red-500 text-white";
              else if (isCorrect) bgColor = "bg-green-500 text-white";
            }
            
            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={`${bgColor} font-bold text-2xl py-8 px-6 rounded-2xl shadow-md transition-all duration-200 active:scale-95 disabled:cursor-not-allowed`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
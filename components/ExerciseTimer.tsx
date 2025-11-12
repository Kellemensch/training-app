"use client";

import { useEffect, useState } from "react";
import ButtonNextExercise from "./ButtonNextExercise";

interface ExerciseTimerProps {
  duration: string;
  onComplete: () => void;
  pause: string;
  onPauseStart?: () => void;
  onPauseEnd?: () => void;
}

export default function ExerciseTimer({
  duration,
  onComplete,
  pause,
  onPauseStart,
  onPauseEnd,
}: ExerciseTimerProps) {
  const parseTimeToSeconds = (timeString: string): number => {
    if (!timeString || typeof timeString !== "string") return 0;

    const parts = timeString.split(":");
    if (parts.length !== 2) return 0;

    const [minutes, seconds] = parts.map(Number);
    if (isNaN(minutes) || isNaN(seconds)) return 0;

    return minutes * 60 + seconds;
  };

  const [timeLeft, setTimeLeft] = useState(parseTimeToSeconds(duration));
  const [isRunning, setIsRunning] = useState(true);
  const [isPauseTimer, setIsPauseTimer] = useState(false);

  const pauseDuration = parseTimeToSeconds(pause);
  const hasValidPause = pauseDuration > 0;

  useEffect(() => {
    const newDuration = parseTimeToSeconds(duration);
    setTimeLeft(newDuration);
    setIsRunning(true);
    setIsPauseTimer(false);
  }, [duration]);

  useEffect(() => {
    let interval: any;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }

    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);

      if (!isPauseTimer && hasValidPause) {
        setIsPauseTimer(true);
        if (onPauseStart) onPauseStart();
        setTimeLeft(pauseDuration);
        setIsRunning(true);
      } else {
        if (onPauseEnd) onPauseEnd();
        setIsPauseTimer(false);
        onComplete();
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsPauseTimer(false);
    setTimeLeft(parseTimeToSeconds(duration));
    setIsRunning(false);
  };

  const handleNextExercise = () => {
    if (hasValidPause && !isPauseTimer) {
      if (onPauseStart) onPauseStart();
      setIsPauseTimer(true);
      setTimeLeft(pauseDuration);
      setIsRunning(true);
    } else {
      if (onPauseEnd) onPauseEnd();
      onComplete();
    }
  };

  return (
    <div>
      <h1 className="text-7xl p-10 font-bold">{formatTime(timeLeft)}</h1>

      <div>
        {isRunning ? (
          <button
            onClick={handleStop}
            className="cursor-pointer text-2xl font-medium p-4 bg-rose-poudre hover:bg-rose-poudre-hover rounded-2xl mr-5"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="cursor-pointer text-2xl font-medium p-4 bg-bleu-canard hover:bg-bleu-canard-hover rounded-2xl ml-5"
          >
            Démarrer
          </button>
        )}
        <button
          onClick={handleReset}
          className="cursor-pointer p-4 text-2xl font-medium rounded-2xl ml-5 bg-jaune-moutarde hover:bg-jaune-moutarde-hover"
          disabled={timeLeft === parseTimeToSeconds(duration)}
        >
          Reset
        </button>
      </div>
      <div>
        <ButtonNextExercise onComplete={handleNextExercise} />
      </div>
    </div>
  );
}

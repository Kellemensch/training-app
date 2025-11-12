"use client";

import { useState } from "react";
import ButtonNextExercise from "./ButtonNextExercise";
import ExerciseTimer from "./ExerciseTimer";

interface ExerciseRepetitionsProps {
  nb: number;
  onComplete: () => void;
  pause: string;
  onPauseStart?: () => void;
  onPauseEnd?: () => void;
}

export default function ExerciseRepetitions({
  nb,
  onComplete,
  pause,
  onPauseStart,
  onPauseEnd,
}: ExerciseRepetitionsProps) {
  const [isPauseMode, setIsPauseMode] = useState(false);

  const parseTimeToSeconds = (timeString: string): number => {
    if (!timeString || typeof timeString !== "string") return 0;

    const parts = timeString.split(":");
    if (parts.length !== 2) return 0;

    const [minutes, seconds] = parts.map(Number);
    if (isNaN(minutes) || isNaN(seconds)) return 0;

    return minutes * 60 + seconds;
  };

  const pauseDuration = parseTimeToSeconds(pause);
  const hasValidPause = pauseDuration > 0;

  const handleNextExercise = () => {
    if (hasValidPause && !isPauseMode) {
      setIsPauseMode(true);
      if (onPauseStart) onPauseStart();
    } else {
      setIsPauseMode(false);
      if (onPauseEnd) onPauseEnd();
      onComplete();
    }
  };

  if (isPauseMode && hasValidPause)
    return (
      <ExerciseTimer
        duration={pause}
        onComplete={handleNextExercise}
        pause=""
        onPauseEnd={onPauseEnd}
      />
    );

  return (
    <div>
      <p className="text-6xl font-bold p-10">{nb} répétitions</p>
      <ButtonNextExercise onComplete={handleNextExercise} />
    </div>
  );
}

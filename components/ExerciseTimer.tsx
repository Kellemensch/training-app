"use client";

import { useEffect, useState } from "react";
import ButtonNextExercise from "./ButtonNextExercise";

interface ExerciseTimerProps {
    duration: string;
    onComplete: () => void;
}

export default function ExerciseTimer({duration, onComplete}: ExerciseTimerProps) {
    const parseTimeToSeconds = (timeString: string): number => {
        const [minutes, seconds] = timeString.split(':').map(Number);
        return minutes * 60 + seconds;
    };

    const [timeLeft, setTimeLeft] = useState(parseTimeToSeconds(duration));
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        const newDuration = parseTimeToSeconds(duration);
        setTimeLeft(newDuration);
        setIsRunning(true);
    }, [duration]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if(isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => {
                    if (time < 1) {
                        setIsRunning(false);
                        setTimeout(onComplete, 0);
                        return 0;
                    }
                    return time - 1;
                })
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => setIsRunning(true);
    const handleStop = () => setIsRunning(false);
    const handleReset = () => {
        setTimeLeft(parseTimeToSeconds(duration));
        setIsRunning(false);
    }

    return (
        <div>
            <h1 className="text-7xl p-10 font-bold">{formatTime(timeLeft)}</h1>

            <div>
                {isRunning 
                    ? (
                        <button onClick={handleStop} 
                            className="cursor-pointer text-2xl font-medium p-4 bg-rose-poudre hover:bg-rose-poudre-hover rounded-2xl mr-5">
                            Pause
                        </button>
                )
                    : (
                        <button onClick={handleStart} 
                            className="cursor-pointer text-2xl font-medium p-4 bg-bleu-canard hover:bg-bleu-canard-hover rounded-2xl ml-5">
                            Démarrer
                        </button>
                    )}
                <button onClick={handleReset} 
                    className="cursor-pointer p-4 text-2xl font-medium rounded-2xl ml-5 bg-jaune-moutarde hover:bg-jaune-moutarde-hover" disabled={timeLeft === parseTimeToSeconds(duration)}>
                        Reset
                </button>
            </div>
            <div>
                <ButtonNextExercise onComplete={onComplete}/>
            </div>
        </div>
    )
}
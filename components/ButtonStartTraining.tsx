"use client";

import { useRouter } from "next/navigation";

export default function ButtonStartTraining() {
    const router = useRouter();
    return (
        <button 
            className="rounded-2xl py-5 px-5 bg-bleu-canard cursor-pointer hover:bg-bleu-canard-hover text-white font-bold"
            onClick={() => router.push("/start-training-choice")}
        >Lancer un entraînement</button>
    )
}
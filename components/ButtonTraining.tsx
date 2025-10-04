"use client";

import { useRouter } from "next/navigation"

export default function ButtonTraining() {
    const router = useRouter();
    return (
        <button 
            className="rounded-2xl py-5 px-5 bg-green-400 hover:bg-green-600 cursor-pointer text-white font-bold"
            onClick={() => router.push("/create-training")}>
                Créer un entraînement
        </button>
    )
}
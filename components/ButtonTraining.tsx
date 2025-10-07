"use client";

import { useRouter } from "next/navigation"

export default function ButtonTraining() {
    const router = useRouter();
    return (
        <button 
            className="rounded-2xl py-5 px-5 bg-rose-poudre hover:bg-rose-poudre-hover cursor-pointer text-gray-800 font-bold"
            onClick={() => router.push("/create-training")}>
                Créer un entraînement
        </button>
    )
}
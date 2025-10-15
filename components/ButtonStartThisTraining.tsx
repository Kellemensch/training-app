"use client";

import { useRouter } from "next/navigation";

export default function ButtonStartThistraining({id}: {id: string}) {
    const router = useRouter();
    
    return (
        <button onClick={() => router.push(`/start-training/${id}`)}
        type="button"
            className="absolute right-10 bottom-10 cursor-pointer rounded-2xl bg-rose-poudre hover:bg-rose-poudre-hover text-2xl font-bold p-5">
            Lancer l'entraînement
        </button>
    )
}
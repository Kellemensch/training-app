"use client";

import { useRouter } from "next/navigation";

export default function ButtonProgram() {
    const router = useRouter();
    return (
        <button 
            className="rounded-2xl py-5 px-5 bg-green-400 cursor-pointer hover:bg-green-600 text-white font-bold"
            onClick={() => router.push("/trainings")}
        >Créer un programme</button>
    )
}
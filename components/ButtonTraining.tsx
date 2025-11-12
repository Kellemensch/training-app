"use client";

import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa6";

export default function ButtonTraining() {
  const router = useRouter();
  return (
    <button
      className="flex gap-2 items-center rounded-2xl py-5 px-5 bg-rose-poudre hover:bg-rose-poudre-hover cursor-pointer text-gray-800 font-bold"
      onClick={() => router.push("/create-training")}
    >
      <FaPlus size={20} /> Créer un entraînement
    </button>
  );
}

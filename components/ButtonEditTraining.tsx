"use client";

import { FaEdit } from "react-icons/fa";

interface ButtonEditTrainingProps {
  click: () => void;
}

export default function ButtonEditTraining(params: ButtonEditTrainingProps) {
  return (
    <button
      onClick={params.click}
      className="border-2 border-gray-200 bg-gray-100 hover:bg-bleu-canard/70 hover:border-bleu-canard cursor-pointer text-xl rounded-md p-3 shadow-sm hover:shadow-md hover:text-white"
    >
      <div className="flex items-center gap-2">
        <FaEdit size={20} />
        <h1>Modifier</h1>
      </div>
    </button>
  );
}

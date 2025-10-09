"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ButtonCancelTraining() {
    const router = useRouter();
    const [modal, setModal] = useState(false);

    const handleConfirm = () => {
        setModal(false);
        router.back();
    }

    const handleClose = () => {
        setModal(false);
    }

    return (
        <>
            <button 
                onClick={() => setModal(true)} 
                className="cursor-pointer bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded-lg"
            >
                Annuler l'entraînement
            </button>

            {modal && (
                <div 
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={handleClose} // Ferme en cliquant sur l'overlay
                >
                    <div 
                        className="rounded-lg bg-white shadow-lg w-full max-w-md p-6"
                        onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique dans la modal
                    >
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Annuler l'entraînement
                        </h3>
                        
                        <p className="text-gray-600 mb-6">
                            Sûre d'annuler l'entraînement ?<br />
                            Ta progression sera perdue.
                        </p>
                        
                        <div className="flex justify-end space-x-3">
                            <button 
                                onClick={handleClose}
                                className="cursor-pointer px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Reprendre l'entraînement
                            </button>
                            <button 
                                onClick={handleConfirm}
                                className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Oui, annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
"use client";

import { Training } from "@/lib/interfaces";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaEllipsis } from "react-icons/fa6";

interface TrainingCardProps {
    training: Training;
    param: string;
    onTrainingDeleted: (trainingId: string) => void; // Callback pour rafraichir liste parente
}

export default function TrainingCard({training, param, onTrainingDeleted}: TrainingCardProps) {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    let linkTo = `/training/${training.id}`;
    if (param === "start") {
        linkTo = `start-training/${training.id}`;
    }

    // Fermer le menu en cliquant à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        router.push(`training/${training.id}`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        setShowDeleteConfirm(true);
    }

     const confirmDelete = () => {
        setShowDeleteConfirm(false);
        setShowMenu(false);
        onTrainingDeleted(training.id);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <>
        <div onClick={() => router.push(linkTo)} 
                className="flex break-inside-avoid rounded-2xl border border-gray-600 cursor-pointer text-gray-900 hover:text-white shadow-md bg-white hover:bg-bleu-canard hover:shadow-xl m-3 relative transition-all duration-200">
            <div className="flex-1 flex items-center justify-center p-4 text-5xl">
                {training.emoji}
            </div>
            <div className="flex-1 flex flex-col relative p-3">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="flex-1 pr-2 line-clamp-3 text-lg text-center font-bold mt-1">
                        {training.name}
                    </h2>

                <div className="relative flex-shrink-0" ref={menuRef}>
                    <div className="cursor-pointer ml-2 p-1 rounded text-black hover:text-white transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}>
                        <FaEllipsis size={20}/>
                    </div>

                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-400 z-50">
                            <button onClick={handleEdit}
                                className="cursor-pointer w-full flex items-center text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 rounded-t-lg transition-colors">
                                    <FaEdit className="mr-2 text-blue-500"/>
                                    Modifier
                            </button>
                            <button onClick={handleDelete}
                                className="cursor-pointer w-full flex items-center text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 rounded-t-lg transition-colors">
                                    <FaTrash className="mr-2 text-red-500"/>
                                    Supprimer
                            </button>
                        </div>
                    )}
                </div>
                </div>
                <div className="mt-auto pt-2">
                    <p className="font-light text-sm text-right">{training.exercises.length} exercices</p>
                </div>
            </div>
        </div>
        
        {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex item-center justify-center z-50 p-4">
                <div className="rounded-lg bg-white shadow-lg mt-[20%] h-fit mr-[35%] ml-[35%] p-6"
                    onClick={(e) => e.stopPropagation()}> 
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Confirmer la suppression
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Es-tu sûre de supprimer l'entraînement <strong>{training.name}</strong>?
                        Cette action est irréversible.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button onClick={cancelDelete}
                            className="cursor-pointer p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                Annuler
                        </button>
                        <button onClick={confirmDelete}
                            className="cursor-pointer p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                Supprimer
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}
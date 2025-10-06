import { Training } from "@/lib/interfaces";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { FaEllipsis } from "react-icons/fa6";

interface TrainingCardProps {
    training: Training;
    param: string;
}

export default function TrainingCard({training, param}: TrainingCardProps) {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    let linkTo = `/training/${training.id}`;
    if (param === "start") {
        linkTo = `start-training/${training.id}`;
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        router.push(`training/${training.id}`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        const storedTrainings = localStorage.getItem("trainings");
        if (storedTrainings) {
            const trainings: Training[] = JSON.parse(storedTrainings);
            const updatedTrainings = trainings.filter((e) => e.id != training.id);
            localStorage.setItem("trainings", JSON.stringify(updatedTrainings));
            console.log(`supprimé le training: ${training.id}`);
        }
        router.refresh();
    }


    return (
        <div onClick={() => router.push(linkTo)} 
                className="break-inside-avoid rounded-2xl border border-gray-600 cursor-pointer text-gray-900 hover:text-white shadow-md bg-white hover:bg-bleu-canard hover:shadow-lg m-3 relative">
            <div className="flex justify-between items-start p-3">
                <div className="flex-1 flex justify-center">
                    <h2 className="text-lg text-center font-bold mt-1 ml-2 pl-5">
                        {training.name}
                    </h2>
                </div>

                <div className="relative" ref={menuRef}>
                    <div className="cursor-pointer ml-2 p-1 rounded text-black hover:text-white transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}>
                        <FaEllipsis size={20}/>
                    </div>

                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-400 z-10">
                            <button onClick={handleEdit}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg transition-colors">
                                    Modifier
                            </button>
                            <button onClick={handleDelete}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg transition-colors">
                                Supprimer
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <p className="font-light text-center pb-3">{training.exercises.length} exercices</p>
            <span>{training.emoji}</span>
        </div>
    )
}
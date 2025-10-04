import { Training } from "@/lib/interfaces";
import Link from "next/link";

export default function TrainingCard({training, param}) {
    let linkTo = `/training/${training.id}`;
    if (param === "start") {
        linkTo = `start-training/${training.id}`;
    }
    return (
        <Link href={linkTo} 
                className="break-inside-avoid rounded-2xl cursor-pointer shadow-md bg-green-300 hover:bg-green-400 hover:shadow-lg">
            <h2 className="text-center text-lg font-bold text-black">
                {training.name}
            </h2>
            <p className="text-gray-500 font-light">{training.exercises.length} exercices</p>
        </Link>
    )
}
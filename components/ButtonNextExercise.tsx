export default function ButtonNextExercise({onComplete}: {onComplete: () => void}) {
    return (
        <button onClick={onComplete} 
                    className="cursor-pointer p-4 text-2xl font-semibold rounded-2xl mt-10 bg-green-500 hover:bg-green-600" >
                    Exercice suivant
        </button>
    )
}
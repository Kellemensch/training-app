"use client";

import { useState } from "react";
import ButtonStartThistraining from "./ButtonStartThisTraining";
import ButtonEditTraining from "./ButtonEditTraining";
import { useTrainings } from "@/hooks/useTrainings";
import { MdNumbers } from "react-icons/md";
import { BsFillPauseFill } from "react-icons/bs";
import { Training } from "@/lib/interfaces";
import Loading from "@/app/loading";

interface TrainingPageProps {
  id: string;
}

export default function TrainingPage({ id }: TrainingPageProps) {
  const { trainings, isLoading, updateTraining } = useTrainings();
  const [isEditMode, setIsEditMode] = useState(false);
  const [newTraining, setNewTraining] = useState<Training | null>(null);

  const training = trainings.find((e) => e.id === id);
  if (!training) return <div>Not Found</div>;

  const nbExercises = training.exercises.length;
  const nbPauses = training.exercises.filter((e) => !!e.pause).length;

  if (isLoading) return <Loading />;

  // Initialize edit state when entering edit mode
  const handleEditClick = () => {
    setNewTraining(training);
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    if (newTraining) {
      if (newTraining.exercises.length == 0) {
        return alert("L'entraînement doit avoir au moins 1 exercice");
      } else if (!newTraining.name) {
        return alert("L'entraînement doit avoir un nom");
      }
      if (newTraining.emoji === "") {
        training.emoji = "🏋";
        setNewTraining({ ...training, emoji: "🏋" });
      }
      updateTraining(training.id, newTraining);
      setIsEditMode(false);
      setNewTraining(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setNewTraining(null);
  };

  const secureInput = (value: string, nbDigit: number): string => {
    if (!value || nbDigit < 1) return "";

    // Remove non-digit characters
    value = value.replace(/\D/g, "");

    // Limit length to nbDigit
    value = value.slice(0, nbDigit);

    return value;
  };

  // Handlers for edit mode
  const updateExerciseName = (index: number, newName: string) => {
    if (!newTraining) return;
    const updatedExercises = newTraining.exercises.map((ex, i) =>
      i === index ? { ...ex, name: newName } : ex
    );
    setNewTraining({ ...newTraining, exercises: updatedExercises });
  };

  const updateExerciseDescription = (index: number, newDesc: string) => {
    if (!newTraining) return;
    const updatedExercises = newTraining.exercises.map((ex, i) =>
      i === index ? { ...ex, description: newDesc } : ex
    );
    setNewTraining({ ...newTraining, exercises: updatedExercises });
  };

  const updateExerciseTime = (index: number, newTime: string) => {
    if (!newTraining) return;
    newTime = secureInput(newTime, 4);

    // Format as MM:SS
    if (newTime.length > 2) {
      newTime = `${newTime.slice(0, 2)}:${newTime.slice(2, 4)}`;
    }
    const updatedExercises = newTraining.exercises.map((ex, i) =>
      i === index ? { ...ex, time: newTime } : ex
    );
    setNewTraining({ ...newTraining, exercises: updatedExercises });
  };

  const updateExerciseRepetitions = (index: number, newReps: string) => {
    if (!newTraining) return;
    newReps = secureInput(newReps, 5);

    const updatedExercises = newTraining.exercises.map((ex, i) =>
      i === index ? { ...ex, repetitions: newReps } : ex
    );
    setNewTraining({ ...newTraining, exercises: updatedExercises });
  };

  const updateExercisePause = (index: number, newPause: string) => {
    if (!newTraining) return;
    newPause = secureInput(newPause, 4);

    // Format as MM:SS
    if (newPause.length > 2) {
      newPause = `${newPause.slice(0, 2)}:${newPause.slice(2, 4)}`;
    }
    const updatedExercises = newTraining.exercises.map((ex, i) =>
      i === index ? { ...ex, pause: newPause } : ex
    );
    setNewTraining({ ...newTraining, exercises: updatedExercises });
  };

  const deleteExercise = (index: number) => {
    if (!newTraining) return;
    const updatedExercises = newTraining.exercises.filter(
      (_, i) => i !== index
    );
    setNewTraining({ ...newTraining, exercises: updatedExercises });
  };

  const addExercise = () => {
    if (!newTraining) return;
    const newExercise = [
      ...newTraining.exercises,
      {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        type: "",
        repetitions: "",
        pause: "",
      },
    ];
    setNewTraining({ ...newTraining, exercises: newExercise });
  };

  // Edit mode view
  if (isEditMode && newTraining)
    return (
      <div className="p-3 mx-10 md:mx-30">
        <div className="p-3">
          {/* Header: Title, Description, Emoji, Day */}
          <div className="mb-8">
            <div className="flex gap-4 items-start mb-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={newTraining.name}
                  maxLength={100}
                  required
                  onChange={(e) =>
                    setNewTraining({ ...newTraining, name: e.target.value })
                  }
                  className="w-full text-4xl font-semibold text-gray-900 border-2 rounded-lg p-3 border-gray-300 focus:border-bleu-canard focus:outline-none"
                  placeholder="Nom de l'entraînement"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Emoji
                </label>
                <input
                  type="text"
                  value={newTraining.emoji}
                  maxLength={2}
                  onChange={(e) =>
                    setNewTraining({ ...newTraining, emoji: e.target.value })
                  }
                  className="w-full text-5xl text-center border-2 rounded-lg p-2 border-gray-300 focus:border-bleu-canard focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newTraining.description}
                maxLength={500}
                onChange={(e) =>
                  setNewTraining({
                    ...newTraining,
                    description: e.target.value,
                  })
                }
                className="w-full text-lg text-gray-600 border-2 rounded-lg p-3 border-gray-300 focus:border-bleu-canard focus:outline-none resize-none"
                rows={3}
                placeholder="Description de l'entraînement"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jour
              </label>
              <select
                value={newTraining.day}
                onChange={(e) =>
                  setNewTraining({ ...newTraining, day: e.target.value })
                }
                className="w-full text-lg border-2 rounded-lg p-3 border-gray-300 focus:border-bleu-canard focus:outline-none"
              >
                <option value="">Sélectionner un jour</option>
                <option value="Monday">Lundi</option>
                <option value="Tuesday">Mardi</option>
                <option value="Wednesday">Mercredi</option>
                <option value="Thursday">Jeudi</option>
                <option value="Friday">Vendredi</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div> */}
          </div>

          {/* Exercises Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Exercises
            </h2>

            {newTraining.exercises.length !== 0 ? (
              <div className="space-y-4">
                {newTraining.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="p-5 border-2 rounded-xl bg-white border-bleu-canard/30 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex gap-4 mb-4 items-start">
                      <div className="text-3xl font-bold p-3 rounded-full bg-bleu-canard/10 text-bleu-canard w-16 h-16 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Exercise Name
                        </label>
                        <input
                          type="text"
                          maxLength={100}
                          value={exercise.name}
                          onChange={(e) =>
                            updateExerciseName(index, e.target.value)
                          }
                          className="w-full text-2xl font-semibold text-gray-800 border-2 rounded-lg p-3 border-gray-300 focus:border-bleu-canard focus:outline-none"
                          placeholder="Exercise name"
                        />
                      </div>
                      <button
                        onClick={() => deleteExercise(index)}
                        className="text-3xl text-red-500 hover:text-red-700 font-bold px-4 py-2 transition-colors cursor-pointer"
                        title="Delete exercise"
                      >
                        &times;
                      </button>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        maxLength={250}
                        value={exercise.description}
                        onChange={(e) =>
                          updateExerciseDescription(index, e.target.value)
                        }
                        className="w-full text-lg text-gray-600 border-2 rounded-lg p-3 border-gray-300 focus:border-bleu-canard focus:outline-none resize-none"
                        rows={2}
                        placeholder="Exercise description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={exercise.type}
                          onChange={(e) => {
                            const updatedExercises = newTraining.exercises.map(
                              (ex, i) =>
                                i === index
                                  ? { ...ex, type: e.target.value }
                                  : ex
                            );
                            setNewTraining({
                              ...newTraining,
                              exercises: updatedExercises,
                            });
                          }}
                          className="w-full text-lg border-2 rounded-lg p-3 border-gray-300 focus:border-bleu-canard focus:outline-none"
                        >
                          <option value="Temps">Temps</option>
                          <option value="Repetitions">Répétitions</option>
                        </select>
                      </div>

                      {exercise.type === "Temps" ? (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Durée
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            value={exercise.time || ""}
                            onChange={(e) =>
                              updateExerciseTime(index, e.target.value)
                            }
                            className="w-full text-lg border-2 rounded-lg p-3 border-gray-300 focus:border-bleu-canard focus:outline-none"
                            placeholder="00:30"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Repetitions
                          </label>
                          <input
                            type="text"
                            maxLength={4}
                            value={exercise.repetitions || ""}
                            onChange={(e) =>
                              updateExerciseRepetitions(index, e.target.value)
                            }
                            className="w-full text-lg border-2 rounded-lg p-3 border-gray-300 focus:border-bleu-canard focus:outline-none"
                            placeholder="10"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Pause après (optionnel)
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={exercise.pause || ""}
                        onChange={(e) =>
                          updateExercisePause(index, e.target.value)
                        }
                        className="w-full text-lg border-2 rounded-lg p-3 border-gray-300 focus:border-bleu-canard focus:outline-none"
                        placeholder="00:30"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">Pas d'exercices ajoutés</p>
            )}
            <button
              type="button"
              className="rounded-xl mt-3 bg-bleu-canard/30 hover:bg-bleu-canard/40 p-4 text-xl cursor-pointer font-semibold text-gray-800"
              onClick={addExercise}
            >
              Ajouter un exercice
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={handleCancelEdit}
              className="px-6 py-3 text-xl font-semibold bg-gray-400 hover:bg-gray-500 text-white rounded-xl cursor-pointer transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-6 py-3 text-2xl font-semibold bg-bleu-canard hover:bg-bleu-canard-hover text-white rounded-xl cursor-pointer transition-all"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    );

  // View mode
  return (
    <div className="p-3 mx-10 md:mx-30">
      <div className="p-3">
        <div className="flex gap-10 items-center">
          <h1 className="text-5xl font-semibold text-gray-900">
            {training.emoji}
          </h1>
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              {training.name}
            </h1>
            <p className="flex text-xl p-2 font-extralight text-gray-500">
              {training.description}
            </p>
          </div>
          <div className="flex-3 text-end p-4 mx-5">
            <ButtonEditTraining click={handleEditClick} />
          </div>
        </div>

        <div className="flex gap-10 w-full p-5">
          <div className="flex-1 flex items-center border border-gray-300 bg-white rounded-xl p-3 gap-5">
            <MdNumbers
              size={50}
              className="text-bleu-canard rounded-xl p-3 w-auto bg-blue-300/20 "
            />
            <div>
              <h1 className="text-gray-500 font-extralight text-xl p-1">
                Exercices
              </h1>
              <h2 className="text-gray-800 font-bold text-2xl p-2">
                {nbExercises}
              </h2>
            </div>
          </div>
          <div className="flex-1 flex items-center border border-gray-300 bg-white rounded-xl p-3 gap-5">
            <BsFillPauseFill
              size={50}
              className="text-bleu-canard rounded-xl p-3 bg-blue-300/20"
            />
            <div>
              <h1 className="text-gray-500 font-extralight text-xl p-1">
                Pauses
              </h1>
              <h2 className="text-gray-800 font-bold text-2xl p-2">
                {nbPauses}
              </h2>
            </div>
          </div>
        </div>

        {training.exercises.length != 0 ? (
          <div className="py-2">
            {training.exercises.map((exercise, index) => (
              <div
                key={index}
                className="text-2xl mb-4 p-3 border-2 rounded-xl bg-white border-bleu-canard/30"
              >
                <div className="flex items-center">
                  <div className="flex text-3xl text-bleu-canard font-bold p-3 rounded-full w-16 h-16 items-center justify-center bg-bleu-canard/10">
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="font-semibold text-3xl p-2 text-gray-800">
                      {exercise.name}
                    </h2>
                    <h3 className="text-2xl text-gray-500 font-light p-2">
                      {exercise.description}
                    </h3>
                  </div>
                  {exercise.type === "Temps" && (
                    <p className="flex-3 text-end p-5">
                      Durée: {exercise.time}
                    </p>
                  )}
                  {exercise.type === "Repetitions" && (
                    <p className="flex-3 text-end p-5">
                      Répétitions: {exercise.repetitions}
                    </p>
                  )}
                </div>

                {exercise.pause && (
                  <div className="text-center mt-2 py-2 border-t-2 border-bleu-canard/30">
                    <h2 className="p-2 text-3xl font-semibold text-bleu-canard text-shadow-2xs">
                      Pause - {exercise.pause}
                    </h2>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Pas d'exercices</p>
        )}
        <ButtonStartThistraining id={id} />
      </div>
    </div>
  );
}

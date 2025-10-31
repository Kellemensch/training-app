"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiSolidHomeHeart } from "react-icons/bi";
import { FaFlagCheckered, FaRegCalendarAlt } from "react-icons/fa";
import {
  MdClose,
  MdHistory,
  MdMenu,
  MdOutlineSportsGymnastics,
} from "react-icons/md";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    {
      icon: <BiSolidHomeHeart size={25} className="mr-4" />,
      text: "Accueil",
      link: "/",
    },
    {
      icon: <MdOutlineSportsGymnastics size={25} className="mr-4" />,
      text: "Entraînements",
      link: "/trainings",
    },
    {
      icon: <FaFlagCheckered size={25} className="mr-4" />,
      text: "S'entraîner",
      link: "/start-training-choice",
    },
    {
      icon: <MdHistory size={25} className="mr-4" />,
      text: "Historique",
      link: "/history",
    },
    {
      icon: <FaRegCalendarAlt size={25} className="mr-4" />,
      text: "Calendrier",
      link: "/calendar",
    },
  ];

  return (
    <>
      {/* Bouton hamburger pour mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMenu}
          className="p-2 bg-bleu-canard text-white rounded-md"
        >
          {isMenuOpen ? <MdClose size={25} /> : <MdMenu size={25} />}
        </button>
      </div>

      {/* Side menu */}
      <div
        className={`
                fixed top-0 left-0 h-screen bg-bleu-canard z-40 shadow-sm transition-transform duration-300 ease-in-out ${
                  isMenuOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 w-100 lg:w-[25%]`}
      >
        <h2 className="text-2xl lg:text-4xl p-4 text-rose-poudre-hover font-extrabold">
          Trainiii
        </h2>
        <nav>
          <ul className="flex flex-col p-4 text-blanc-casse">
            {menuItems.map(({ icon, text, link }, index) => {
              return (
                <div key={index} className="py-2">
                  <li
                    className="text-sm md:text-lg lg:text-2xl flex cursor-pointer w-[80%] rounded-full mx-auto p-3 lg:p-4 hover:text-gray-800 hover:bg-rose-poudre hover:w-[90%] hover:font-bold transition-all duration-200"
                    onClick={() => {
                      router.push(link);
                      setIsMenuOpen(false);
                    }}
                  >
                    {icon} {text}
                  </li>
                </div>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Overlay pour mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}

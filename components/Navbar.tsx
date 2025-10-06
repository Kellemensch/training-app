"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { BiSolidHomeHeart } from "react-icons/bi";
import { FaFlagCheckered } from "react-icons/fa";
import { MdHistory, MdOutlineSportsGymnastics } from "react-icons/md";

export default function Navbar() {
    const router = useRouter();

    const menuItems = [
        {icon: <BiSolidHomeHeart size={25} className="mr-4"/>, text: "Accueil", link: "/"},
        {icon: <MdOutlineSportsGymnastics size={25} className="mr-4"/>, text: "Entraînements", link: "/trainings"},
        {icon: <FaFlagCheckered size={25} className="mr-4"/>, text: "S'entraîner", link: "/start-training-choice"},
        {icon: <MdHistory size={25} className="mr-4"/>, text: "Historique", link: "/history"}
    ];

    return (
        <div className="flex justify-between items-center shadow-sm">
            {/* Coté gauche
            <div className="flex items-center">
                <h1 className="text-2xl lg:text-4xl px-2">
                    Training <span className="font-bold">Coach</span>
                </h1>
            </div> */}

            {/* Side menu */}
            <div
                className={"fixed top-0 left-0 w-[20%] h-screen bg-[#048B9A] z-10 shadow-sm"}>
                <h2 className="text-4xl p-4 text-[#F8F8FF]">
                    Training <span className="font-extrabold text-rose-poudre">Coach</span>
                </h2>
                <nav>
                    <ul className="flex flex-col p-4 text-[#F8F8FF]">
                        {menuItems.map(({icon, text, link}, index) => {
                            return (
                                <div key={index} className="py-4">
                                    <li className="text-2xl flex cursor-pointer w-[80%] rounded-full mx-auto p-2 hover:text-gray-800 hover:bg-[#D8BFD8] hover:w-[90%] hover:font-bold" 
                                        onClick={() => {
                                            router.push(link);
                                        }}>
                                        {icon} {text}
                                    </li>
                                </div>
                            )
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    )
}
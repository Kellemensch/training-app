"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { BiSolidHomeHeart } from "react-icons/bi";
import { FaFlagCheckered } from "react-icons/fa";
import { MdHistory, MdOutlineSportsGymnastics } from "react-icons/md";

export default function Navbar() {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const menuItems = [
        {icon: <BiSolidHomeHeart size={25} className="mr-4"/>, text: "Accueil", link: "/"},
        {icon: <MdOutlineSportsGymnastics size={25} className="mr-4"/>, text: "Entraînements", link: "/trainings"},
        {icon: <FaFlagCheckered size={25} className="mr-4"/>, text: "S'entraîner", link: "/start-training"},
        {icon: <MdHistory size={25} className="mr-4"/>, text: "Historique", link: "/history"}
    ];

    return (
        <div className="max-w-full mx-auto flex justify-between items-center p-4 shadow-sm">
            {/* Coté gauche */}
            <div className="flex items-center">
                <div onClick={() => setOpen(!open)} className="cursor-pointer">
                    <AiOutlineMenu size={30}/>
                </div>
                <h1 className="text-2xl lg:text-4xl px-2">
                    Training <span className="font-bold">Coach</span>
                </h1>
            </div>

            {/* Overlay */}
            {open ? (
                <div className="bg-black/80 fixed w-full h-screen z-10 top-0 left-0"></div>
            ) : (
                ""
            )}

            {/* Side menu */}
            <div
                className={
                open ? "fixed top-0 left-0 w-[400px] h-screen bg-white z-10 duration-200"
                    : "fixed top-0 left-[-100%] w-[400px] h-screen bg-white z-10 duration-200"
            }>
                <AiOutlineClose onClick={() => setOpen(!open)} size={30} className="absolute right-4 top-4 cursor-pointer"/>
                <h2 className="text-2xl p-4">
                    Training <span className="font-bold">Coach</span>
                </h2>
                <nav>
                    <ul className="flex flex-col p-4 text-gray-800">
                        {menuItems.map(({icon, text, link}, index) => {
                            return (
                                <div key={index} className="py-4">
                                    <li className="text-xl flex cursor-pointer w-[80%] rounded-full mx-auto p-2 hover:text-white hover:bg-black" 
                                        onClick={() => {
                                            router.push(link);
                                            setOpen(!open);
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
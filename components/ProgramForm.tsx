"use client";

import { Program } from "@/lib/interfaces";
import { useState } from "react";

export default function ProgramForm() {
    const [programme, setProgramme] = useState<Program>();
    const [openPanel, setOpenPanel] = useState(false);


    return (
        <form >
            <input type="text" value={programme?.name} required placeholder="Nom du programme"></input> 
        </form>
    )
}
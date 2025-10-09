"use client";

export default function ShowDate() {
    const today = new Date();
    const date = today.getDate();
    const day = today.getDay();
    
    const actualDay = () => {
        switch (day) {
            case 0:
                return "Dimanche"
            case 1:
                return "Lundi";
            case 2:
                return "Mardi";
            case 3:
                return "Mercredi";
            case 4:
                return "Jeudi";
            case 5:
                return "Vendredi";
            case 6:
                return "Samedi";
        
            default:
                return ""
        }
    }

    return (
        <div className="text-center font-semibold text-2xl p-3 mt-5 text-rose-poudre-hover">
            {actualDay()} {date}
        </div>
    )
}
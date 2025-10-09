import ButtonTraining from "@/components/ButtonTraining";
import ButtonStartTraining from "@/components/ButtonStartTraining";
import ShowDate from "@/components/ShowDate";

export default function Home() {
    return (
        <div>
            <h1 className="text-4xl font-bold text-center text-gray-800 p-4">
                Bonjour !
            </h1>
            <ShowDate/>


            {/* <div className="fixed right-5 bottom-15">
                <ButtonSchedule/>
            </div> */}
            <div className="fixed right-5 bottom-30">
                <ButtonStartTraining/>
            </div>
            <div className="fixed right-5 bottom-5">
                <ButtonTraining/>
            </div>
        </div>
    )
}
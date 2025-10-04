import ButtonProgram from "@/components/ButtonProgram";
import ButtonTraining from "@/components/ButtonTraining";
import ButtonSchedule from "@/components/ButtonSchedule";
import ButtonStartTraining from "@/components/ButtonStartTraining";

export default function Home() {
    return (
        <div className="">
            Hello


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
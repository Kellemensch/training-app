import Navbar from "@/components/Navbar";

export default function WithNavbarLayout({
    children
}: {children: React.ReactNode}) {
    return (
        <>
            <Navbar/>
            <div className="ml-[21%]">
                {children}
            </div>
        </>
    )
}
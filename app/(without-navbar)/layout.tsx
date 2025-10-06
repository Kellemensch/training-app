export default function WithNavbarLayout({
    children
}: {children: React.ReactNode}) {
    return (
        <>
            <div>
                {children}
            </div>
        </>
    )
}
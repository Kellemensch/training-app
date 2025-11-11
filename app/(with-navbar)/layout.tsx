import Navbar from "@/components/Navbar";

export default function WithNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Navbar />
      <div className="p-4 md:ml-60 lg:ml-[15%]">{children}</div>
    </div>
  );
}

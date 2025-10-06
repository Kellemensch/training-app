export default function StartTrainingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className="items-center text-center">
          {children}
        </div>
  );
}

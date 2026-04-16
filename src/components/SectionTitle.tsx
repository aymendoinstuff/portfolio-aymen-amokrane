export default function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2 className="text-4xl md:text-6xl tracking-tight mb-6 leading-[0.95]">
      {children}
    </h2>
  );
}

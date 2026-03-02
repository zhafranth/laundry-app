interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  gray?: boolean;
}

export function SectionWrapper({
  children,
  className = "",
  id,
  gray,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`py-20 lg:py-24 ${gray ? "bg-gray-100" : "bg-white"} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

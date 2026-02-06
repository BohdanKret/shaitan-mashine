export default function ContentContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full max-w-[1400px] px-4 mx-auto">{children}</div>;
}

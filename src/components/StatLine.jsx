export default function StatLine({ label, children }) {
  return (
    children && (
      <p className="text-[#4a2800]">
        <span className="font-bold">{label}</span> {children}
      </p>
    )
  );
}

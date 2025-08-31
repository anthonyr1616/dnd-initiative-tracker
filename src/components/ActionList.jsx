export default function ActionList({ title, items }) {
  return (
    <>
      {title && (
        <>
          <p className="font-bold text-lg  text-[#8d2e1e]">{title}</p>
          <hr className="border-1  border-[#8d2e1e] mb-2" />
        </>
      )}

      <ul className="flex flex-col">
        {items.map((item) => (
          <li key={item.name} className="mb-2">
            <span className="font-bold">{item.name}.</span> {item.desc}
          </li>
        ))}
      </ul>
    </>
  );
}

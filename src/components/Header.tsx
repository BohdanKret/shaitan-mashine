interface HeaderProps {
  productsAll: number;
  selected: number;
}

export default function Header({ productsAll, selected }: HeaderProps) {
  return (
    <header className="pt-4 pb-4">
      <div className="flex gap-2">
        <h3 className="text-[#08a] p-1.5 rounded-lg m-0 bg-white">
          Всього товарів: {productsAll}
        </h3>
        <h3 className="text-[#08a] p-1.5 rounded-lg m-0 bg-white">
          Вибрано товарів: {selected}
        </h3>
      </div>
    </header>
  );
}

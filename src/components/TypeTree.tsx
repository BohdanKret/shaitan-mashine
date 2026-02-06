import type { DataType } from "./types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import CheckedButton from "./checked-button";

interface TypeTreeProps {
  title: string;
  dataType: DataType[];
  filteredValue: Set<string>;
  isActiveType: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  prevTypeActive?: string;
}

export default function TypeTree({
  title,
  dataType,
  filteredValue,
  isActiveType,
  onChange,
  prevTypeActive,
}: TypeTreeProps) {
  const filteredDataType = prevTypeActive
    ? dataType.filter((item) => item.parentId === prevTypeActive)
    : dataType;

  return (
    <Card>
      <CardContent>
        <CardTitle className="text-2xl font-bold pb-4">{title}</CardTitle>

        <ul className="flex flex-wrap gap-1">
          {filteredDataType.map((item) => {
            const isDisabled = !filteredValue.has(item.id);
            const isActive = isActiveType === item.id;

            return (
              <li key={item.id}>
                <CheckedButton
                  onClick={() => {
                    if (isDisabled) return;
                    onChange((prev) => (prev === item.id ? "" : item.id));
                  }}
                  isActive={isActive}
                  isDisabled={isDisabled}
                >
                  {item.name}
                </CheckedButton>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

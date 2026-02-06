import { Card, CardContent, CardTitle } from "@/components/ui/card";
import CheckedButton from "./checked-button";

interface BrandType {
  id: string;
  name: string;
}

interface BrandTreeProps {
  brands: BrandType[];
  availableBrandsFiltered: Set<string>;
  brandActive: string;
  setBrandActive: React.Dispatch<React.SetStateAction<string>>;
}

export default function BrandTree({
  brands,
  availableBrandsFiltered,
  brandActive,
  setBrandActive,
}: BrandTreeProps) {
  return (
    <Card className="mb-4">
      <CardContent>
        <CardTitle className="text-2xl font-semibold pb-1">Бренди</CardTitle>

        <ul className="flex flex-wrap gap-1">
          {brands.map(({ id, name }) => {
            const isDisabled = !availableBrandsFiltered.has(name);
            const isActive = brandActive === name;

            return (
              <li key={id}>
                <CheckedButton
                  onClick={() => {
                    if (isDisabled) return;
                    setBrandActive((prev) => (prev === name ? "" : name));
                  }}
                  isActive={isActive}
                  isDisabled={isDisabled}
                >
                  {name}
                </CheckedButton>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

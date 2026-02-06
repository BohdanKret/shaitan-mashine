import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Product = {
  sku: string;
  name: string;
  brand: string;
  specializations?: {
    L1_id?: string[] | null;
    L2_id?: string[] | null;
    L3_id?: string[] | null;
  };
  type?: {
    L1_id?: string | null;
    L2_id?: string | null;
    L3_id?: string | null;
  };
};

export default function ProductGallery({
  dataProducts,
}: {
  dataProducts: Product[];
}) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pb-8">
      {dataProducts.map((item: Product, index: number) => (
        <li
          key={`${item.sku}-${index}`}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
        >
          <Card className="flex flex-col h-full gap-4 py-4">
            <CardHeader className="px-4">
              <img
                src={`https://api.dicebear.com/9.x/shapes/svg?seed=${item.sku}`}
                alt="example"
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="px-4 flex flex-col justify-between flex-grow">
              <CardTitle className="text-lg font-bold break-words">
                {item.name}
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <strong>SKU:</strong> {item.sku}
                </div>
                <div>
                  <strong>Бренд:</strong> {item.brand}
                </div>
              </CardDescription>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { DataType, Product } from "./types";
import spl1 from "../data/SPL1.json";
import spl2 from "../data/SPL2.json";
import spl3 from "../data/SPL3.json";
import t1 from "../data/T1.json";
import t2 from "../data/T2.json";
import t3 from "../data/T3.json";

interface SearchModalProps {
  isOpen: boolean;
  onOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataProducts: Product[];
  isActive: string;
}

export default function SkySearchAndModal({
  isOpen,
  onOpen,
  dataProducts,
  isActive,
}: SearchModalProps) {
  const brandRef = useRef(isActive);
  const [skuSearch, setSkuSearch] = useState("");
  const [skuSearchResults, setSkuSearchResults] = useState<Product[]>([]);

  useEffect(() => {
    brandRef.current = isActive;
  }, [isActive]);
  const handleSearchBySku = () => {
    const search = skuSearch.trim().toLowerCase();
    if (!search) return;
    const found = dataProducts.filter((p) => {
      return p.sku?.toLowerCase().includes(search);
    });

    setSkuSearchResults(found);
  };

  const getNameById = (arr: DataType[], id: string) => {
    const found = arr.find((item) => item.id === id);
    return found ? found.name : id;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpen}>
      <DialogContent className="  max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Пошук товару по SKU</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Введіть SKU"
          value={skuSearch}
          onChange={(e) => setSkuSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchBySku();
          }}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="secondary"
            onClick={() => {
              onOpen(false);
              setSkuSearch("");
              setSkuSearchResults([]);
            }}
          >
            Скасувати
          </Button>
          <Button onClick={handleSearchBySku}>Пошук</Button>
        </div>

        {skuSearch && (
          <>
            <Separator className="my-4 bg-gray-700" />
            {skuSearchResults.length > 0 ? (
              <div className="space-y-4">
                {skuSearchResults.map((item) => (
                  <Card key={item.sku}>
                    <CardHeader>
                      <img
                        alt="product"
                        src={`https://robohash.org/${item.sku}`}
                        className="w-full h-48 object-contain rounded-t-lg"
                      />
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-semibold text-lg mb-2">
                        {item.name}
                      </h3>
                      <div className="text-sm space-y-1">
                        <div>
                          <strong>SKU:</strong> {item.sku}
                        </div>
                        <div>
                          <strong>Бренд:</strong> {item.brand}
                        </div>
                        <div>
                          <strong>Типи:</strong>
                        </div>
                        <ul className="ml-4 list-disc">
                          {item.type?.L1_id && (
                            <li>Тип 1: {getNameById(t1, item.type.L1_id)}</li>
                          )}
                          {item.type?.L2_id && (
                            <li>Тип 2: {getNameById(t2, item.type.L2_id)}</li>
                          )}
                          {item.type?.L3_id && (
                            <li>Тип 3: {getNameById(t3, item.type.L3_id)}</li>
                          )}
                        </ul>
                        <div>
                          <strong>Спеціалізації:</strong>
                        </div>
                        <ul className="ml-4 list-disc">
                          {item.specializations?.L1_id?.map((id) => (
                            <li key={`sp-l1-${id}`}>
                              L1: {getNameById(spl1, id)}
                            </li>
                          ))}
                          {item.specializations?.L2_id?.map((id) => (
                            <li key={`sp-l2-${id}`}>
                              L2: {getNameById(spl2, id)}
                            </li>
                          ))}
                          {item.specializations?.L3_id?.map((id) => (
                            <li key={`sp-l3-${id}`}>
                              L3: {getNameById(spl3, id)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mt-2">
                Нічого не знайдено за цим SKU
              </p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

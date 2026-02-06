import "dayjs/locale/uk"; // Додайте підтримку української локалізації для dayjs, якщо потрібно
import spl1 from "../data/SPL1.json";
import spl2 from "../data/SPL2.json";
import spl3 from "../data/SPL3.json";
import t1 from "../data/T1.json";
import t2 from "../data/T2.json";
import t3 from "../data/T3.json";
import brands from "../data/brands.json";
import rawProducts from "../data/Baush.json";
import { buildTreeData } from "@/helpers/buildTreeData.ts";
import "../../App.scss";
import { useEffect, useState } from "react"; // викинув useRef
// змінені компоненти
import Header from "./Header.tsx";
import ContentContainer from "./content-container.tsx";
import SpecializationTree from "./specialization-tree.tsx";
import BrandTree from "./brand-tree.tsx";
import TypeTree from "./TypeTree.tsx";
import { Button } from "@/components/ui/button.tsx";
import Footer from "./Footer.tsx";
import ProductGallery from "./product-gallery.tsx";
import SkySearchAndModal from "./skysearch-modal.tsx";
import type { Product } from "./types.ts";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx"; // export some type

const products = rawProducts as unknown as Product[];

const App = () => {
  const [t1Active, setT1Active] = useState("");
  const [t2Active, setT2Active] = useState("");
  const [t3Active, setT3Active] = useState("");
  const [spActive, setSpActive] = useState("");
  const [availableT1Filtered, setAvailableT1Filtered] = useState(
    new Set<string>(),
  );
  const [availableT2Filtered, setAvailableT2Filtered] = useState(
    new Set<string>(),
  );
  const [availableT3Filtered, setAvailableT3Filtered] = useState(
    new Set<string>(),
  );
  const [brandActive, setBrandActive] = useState("");
  const [availableBrandsFiltered, setAvailableBrandsFiltered] = useState(
    new Set<string>(),
  );
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSkuSearchMode, setIsSkuSearchMode] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const downloadFilteredProducts = () => {
    const dataStr = JSON.stringify(filteredProducts, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `filtered_products_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const t1Set = new Set<string>();
    const t2Set = new Set<string>();
    const t3Set = new Set<string>();
    const brandSet = new Set<string>();

    const isFilteringT1 = !!t1Active;
    const isFilteringT2 = !!t2Active;
    const isFilteringT3 = !!t3Active;

    products.forEach((product) => {
      const matchSpecialization =
        !spActive ||
        product.specializations?.L1_id?.includes(spActive) ||
        product.specializations?.L2_id?.includes(spActive) ||
        product.specializations?.L3_id?.includes(spActive);

      const matchT1 = !isFilteringT1 || product.type?.L1_id === t1Active;
      const matchT2 = !isFilteringT2 || product.type?.L2_id === t2Active;
      const matchT3 = !isFilteringT3 || product.type?.L3_id === t3Active;

      // const matchBrand = !brandActive || product.brand === brandActive;
      const matchTypes = matchT1 && matchT2 && matchT3;

      if (matchSpecialization && matchTypes && product.brand) {
        brandSet.add(product.brand);
      }

      if (
        matchSpecialization &&
        (!brandActive || product.brand === brandActive)
      ) {
        if (product.type?.L1_id) t1Set.add(product.type.L1_id);
        if (product.type?.L1_id === t1Active && product.type?.L2_id) {
          t2Set.add(product.type.L2_id);
        }
        if (product.type?.L2_id === t2Active && product.type?.L3_id) {
          t3Set.add(product.type.L3_id);
        }
      }
    });

    setAvailableT1Filtered(t1Set);
    setAvailableT2Filtered(t2Set);
    setAvailableT3Filtered(t3Set);
    setAvailableBrandsFiltered(brandSet);

    if (t1Active && !t1Set.has(t1Active)) setT1Active("");
    if (t2Active && !t2Set.has(t2Active)) setT2Active("");
    if (t3Active && !t3Set.has(t3Active)) setT3Active("");
  }, [spActive, t1Active, t2Active, t3Active, brandActive]);

  useEffect(() => {
    if (!brandActive || !spActive) return;

    const brandStillExistsWithSpec = products.some((product) => {
      const matchSpecialization =
        product.specializations?.L1_id?.includes(spActive) ||
        product.specializations?.L2_id?.includes(spActive) ||
        product.specializations?.L3_id?.includes(spActive);

      return matchSpecialization && product.brand === brandActive;
    });

    if (!brandStillExistsWithSpec) {
      setBrandActive("");
    }
  }, [brandActive, spActive]);

  const availableSpecializations = new Set<string>();
  const availableT1 = new Set<string>();
  const availableT2 = new Set<string>();
  const availableT3 = new Set<string>();

  products.forEach((product: any) => {
    product.specializations?.L1_id?.forEach((id: string) =>
      availableSpecializations.add(id),
    );
    product.specializations?.L2_id?.forEach((id: string) =>
      availableSpecializations.add(id),
    );
    product.specializations?.L3_id?.forEach((id: string) =>
      availableSpecializations.add(id),
    );

    if (product.type?.L1_id) availableT1.add(product.type.L1_id);
    if (product.type?.L2_id) availableT2.add(product.type.L2_id);
    if (product.type?.L3_id) availableT3.add(product.type.L3_id);
  });

  const filterTreeData = (nodes: any[]): any[] => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const filteredChildren = hasChildren ? filterTreeData(node.children) : [];

      const isUsed = availableSpecializations.has(node.value);
      const hasEnabledChild = filteredChildren.some((child) => !child.disabled);

      return {
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : undefined,
        disabled: !isUsed && !hasEnabledChild,
      };
    });
  };
  const resetFilters = () => {
    setSpActive("");
    setT1Active("");
    setT2Active("");
    setT3Active("");
    setBrandActive("");
    setIsSkuSearchMode(false); // ← додай це
  };
  useEffect(() => {
    setT2Active("");
  }, [t1Active]);
  useEffect(() => {
    setT3Active("");
  }, [t2Active]);
  // useEffect(() => {
  //   console.log(spActive);
  // }, [spActive]);
  const treeData = buildTreeData(spl1, spl2, spl3);
  const treeDataFiltered = filterTreeData(treeData);
  useEffect(() => {
    if (isSkuSearchMode) return; // Не перезаписуй при активному SKU-пошуку

    const filtered = products.filter((product) => {
      const matchSpecialization =
        !spActive ||
        product.specializations?.L1_id?.includes(spActive) ||
        product.specializations?.L2_id?.includes(spActive) ||
        product.specializations?.L3_id?.includes(spActive);

      const matchT1 = !t1Active || product.type?.L1_id === t1Active;
      const matchT2 = !t2Active || product.type?.L2_id === t2Active;
      const matchT3 = !t3Active || product.type?.L3_id === t3Active;
      const matchBrand = !brandActive || product.brand === brandActive;

      return matchSpecialization && matchT1 && matchT2 && matchT3 && matchBrand;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [spActive, t1Active, t2Active, t3Active, brandActive, isSkuSearchMode]);

  // елементи до пагінації
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const getPaginationRange = () => {
    const visiblePages = 3; // Кількість кнопок у пагінації одночасно
    const total = totalPages;

    const startPage = Math.max(1, currentPage);
    let endPage = startPage + visiblePages - 1;

    // обмежити endPage до totalPages
    if (endPage > total) {
      endPage = total;
    }

    // якщо ми на останніх сторінках і вікно менше 3 — зсуваємо назад
    const start = Math.max(1, endPage - visiblePages + 1);

    const pages: number[] = [];
    for (let i = start; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <>
      <ContentContainer>
        <Header
          productsAll={products.length}
          selected={filteredProducts.length}
        />

        <div className="flex gap-2">
          <div className="w-76 flex flex-col gap-2 shrink-0">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={resetFilters}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
              >
                Скинути всі фільтри
              </Button>
              <Button onClick={downloadFilteredProducts}>
                Завантажити JSON
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700 transition cursor-pointer"
              >
                Пошук по SKU
              </Button>
            </div>

            <SpecializationTree
              specializationDate={treeDataFiltered}
              spActive={spActive}
              onChange={setSpActive}
            />

            <BrandTree
              brands={brands}
              availableBrandsFiltered={availableBrandsFiltered}
              brandActive={brandActive}
              setBrandActive={setBrandActive}
            />
          </div>

          <div className="flex flex-col gap-2">
            <TypeTree
              title="Тип 1"
              dataType={t1}
              filteredValue={availableT1Filtered}
              isActiveType={t1Active}
              onChange={setT1Active}
            />
            {t1Active && (
              <TypeTree
                title="Тип 2"
                dataType={t2}
                filteredValue={availableT2Filtered}
                isActiveType={t2Active}
                onChange={setT2Active}
                prevTypeActive={t1Active}
              />
            )}
            {t2Active && availableT3Filtered.size > 0 && (
              <TypeTree
                title="Тип 3"
                dataType={t3}
                filteredValue={availableT3Filtered}
                isActiveType={t3Active}
                onChange={setT3Active}
                prevTypeActive={t2Active}
              />
            )}

            <ProductGallery dataProducts={paginatedProducts} />

            {filteredProducts.length > itemsPerPage && (
              <Pagination className="flex justify-center pb-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {getPaginationRange().map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {totalPages > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
        <SkySearchAndModal
          isOpen={isModalOpen}
          onOpen={setIsModalOpen}
          dataProducts={products}
          isActive={brandActive}
        />
      </ContentContainer>
      <Footer />
    </>
  );
};

export default App;

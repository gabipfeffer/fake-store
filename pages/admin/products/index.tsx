import AdminLayout from "src/components/AdminLayout";
import Link from "next/link";
import { InferGetStaticPropsType } from "next";
import { getProducts } from "src/utils/firestore";
import { Product, SortDirection } from "../../../typings";
import { ChangeEvent, useState } from "react";
import { UYUPeso } from "src/utils/currency";
import { PencilIcon } from "@heroicons/react/24/solid";
import { searchProperties } from "src/constants/product";
import { ProductStatus } from "../../../enums";

export default function ProductsPage({
  products: initialProducts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentSortKey, setCurrentSortKey] = useState<keyof Product | null>(
    null
  );
  const [activeSearchFilter, setActiveSearchFilter] = useState<string>(
    searchProperties[0].name
  );

  const filterProducts = (searchInput: string) => {
    if (!searchInput.length) {
      setProducts(initialProducts);
    }

    if (activeSearchFilter) {
      const filteredList = initialProducts.filter((product: Product) =>
        product[activeSearchFilter]
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      );
      setProducts(filteredList);
    }
  };

  const sortColumn = (sortKey: keyof Product) => {
    setCurrentSortKey(sortKey);
    const sortedProducts = [...products];

    sortedProducts.sort((a, b) => {
      const relevantValueA = a[sortKey];
      const relevantValueB = b[sortKey];

      if (currentSortKey === sortKey) {
        if (sortDirection === "desc") {
          if (relevantValueA < relevantValueB) return -1;
          if (relevantValueA > relevantValueB) return 1;
          return 0;
        } else if (sortDirection === "asc") {
          if (relevantValueA > relevantValueB) return -1;
          if (relevantValueA < relevantValueB) return 1;
          return 0;
        }
      } else {
        if (relevantValueA < relevantValueB) return -1;
        if (relevantValueA > relevantValueB) return 1;
        return 0;
      }
    });

    if (currentSortKey === sortKey) {
      if (sortDirection === "desc") {
        setSortDirection("asc");
      } else if (sortDirection === "asc") {
        setSortDirection("desc");
      }
    } else {
      setSortDirection("asc");
    }

    setProducts(sortedProducts);
  };

  return (
    <AdminLayout>
      <div className={"flex items-center justify-between"}>
        <Link href={"/admin/products/new"} className={"adminButton"}>
          Add new product
        </Link>
        <div className={"flex items-center gap-1"}>
          <input
            placeholder={"Search..."}
            className={"input"}
            type={"text"}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              filterProducts(e.target.value)
            }
          />
          <select
            className={"input w-auto"}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setActiveSearchFilter(event.target.value)
            }
          >
            {searchProperties.map((searchProp) => (
              <option key={searchProp.name} value={searchProp.name}>
                {searchProp.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <table className={"productsTable"}>
        <thead>
          <tr>
            <td>
              <button onClick={() => sortColumn("title")}>
                Title{" "}
                {currentSortKey === "title" && (
                  <span className="pl-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </td>
            <td>
              <button onClick={() => sortColumn("category")}>
                Category{" "}
                {currentSortKey === "category" && (
                  <span className="pl-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </td>
            <td>
              <button onClick={() => sortColumn("price")}>
                Price{" "}
                {currentSortKey === "price" && (
                  <span className="pl-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </td>
            <td>
              <button onClick={() => sortColumn("status")}>
                Status{" "}
                {currentSortKey === "status" && (
                  <span className="pl-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </td>
            <td>Edit</td>
          </tr>
        </thead>
        <tbody className={"border"}>
          {products.map((product) => (
            <tr key={product.id} className={"border"}>
              <td>
                <span>{product.title}</span>
              </td>
              <td>
                <span>{product.category}</span>
              </td>
              <td>
                <span>{UYUPeso.format(product.price)}</span>
              </td>
              <td>
                <span>{ProductStatus[product.status]}</span>
              </td>
              <td>
                <Link href={`/admin/products/${product.id}`}>
                  <PencilIcon className={"w-5 h-5"} /> Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
export async function getStaticProps() {
  const products: Product[] = await getProducts();
  return {
    props: {
      products,
    },
    revalidate: 20,
  };
}

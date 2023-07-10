import AdminLayout from "src/components/AdminLayout";
import Link from "next/link";
import { InferGetStaticPropsType } from "next";
import { getCategories } from "src/utils/firestore";
import { Category, SortDirection } from "../../../typings";
import { ChangeEvent, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { searchProperties } from "src/constants/category";
import { DocumentStatus } from "../../../enums";

export default function CategoriesPage({
  categories: initialCategories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentSortKey, setCurrentSortKey] = useState<keyof Category | null>(
    null
  );
  const [activeSearchFilter, setActiveSearchFilter] = useState<keyof Category>(
    searchProperties[0].name
  );

  const filterCategories = (searchInput: keyof Category) => {
    if (!searchInput.length) {
      setCategories(initialCategories);
    }

    if (activeSearchFilter) {
      const filteredList = initialCategories.filter((product: Category) => {
        const propValue: any = product[activeSearchFilter];

        return propValue.toLowerCase().includes(searchInput.toLowerCase());
      });
      setCategories(filteredList);
    }
  };

  const sortColumn = (sortKey: keyof Category): void => {
    setCurrentSortKey(sortKey);
    const sortedCategories = [...categories];

    sortedCategories.sort((a, b) => {
      const relevantValueA = a[sortKey] || "";
      const relevantValueB = b[sortKey] || "";

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
      return 0;
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

    setCategories(sortedCategories);
  };

  return (
    <AdminLayout>
      <div className={"flex items-center justify-between"}>
        <Link href={"/admin/categories/new"} className={"adminButton"}>
          Add new category
        </Link>
        <div className={"flex items-center gap-1"}>
          <input
            placeholder={"Search..."}
            className={"input"}
            type={"text"}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              filterCategories(e.target.value as keyof Category)
            }
          />
          <select
            className={"input w-auto"}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setActiveSearchFilter(event.target.value as keyof Category)
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
      <table className={"adminTable"}>
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
              <button onClick={() => sortColumn("status")}>
                Status{" "}
                {currentSortKey === "status" && (
                  <span className="pl-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </td>
            <td>
              <button onClick={() => sortColumn("ranking")}>
                Ranking{" "}
                {currentSortKey === "ranking" && (
                  <span className="pl-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </td>

            <td></td>
          </tr>
        </thead>
        <tbody className={"border"}>
          {categories.map((category) => (
            <tr key={category.id} className={"border"}>
              <td>
                <span>{category.title}</span>
              </td>
              <td>
                <span>{DocumentStatus[category.status]}</span>
              </td>
              <td>
                <span>{category.ranking}</span>
              </td>
              <td className={"flex items-center gap-2"}>
                <Link href={`/admin/categories/${category.id}`}>
                  <PencilIcon className={"w-5 h-5"} /> Edit
                </Link>
                <Link href={`/admin/categories/${category.id}/delete`}>
                  <TrashIcon className={"w-5 h-5"} /> Delete
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
  const categories: Category[] = await getCategories();
  return {
    props: {
      categories,
    },
    revalidate: 20,
  };
}

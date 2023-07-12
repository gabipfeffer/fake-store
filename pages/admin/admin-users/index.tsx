import AdminLayout from "src/components/AdminLayout";
import Link from "next/link";
import { InferGetStaticPropsType } from "next";
import { getAdminUsers } from "src/utils/firestore";
import { User, SortDirection } from "../../../typings";
import { ChangeEvent, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { searchProperties } from "src/constants/user";

export default function UsersPage({
  users: initialUsers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentSortKey, setCurrentSortKey] = useState<keyof User | null>(null);
  const [activeSearchFilter, setActiveSearchFilter] = useState<keyof User>(
    searchProperties[0].name
  );

  const filterUsers = (searchInput: keyof User) => {
    if (!searchInput.length) {
      setUsers(initialUsers);
    }

    if (activeSearchFilter) {
      const filteredList = initialUsers.filter((user: User) => {
        const propValue: any = user[activeSearchFilter];

        return propValue.toLowerCase().includes(searchInput.toLowerCase());
      });
      setUsers(filteredList);
    }
  };

  const sortColumn = (sortKey: keyof User): void => {
    setCurrentSortKey(sortKey);
    const sortedUsers = [...users];

    sortedUsers.sort((a, b) => {
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

    setUsers(sortedUsers);
  };

  return (
    <AdminLayout>
      <div className={"flex items-center justify-between"}>
        <Link href={"/admin/admin-users/new"} className={"adminButton"}>
          Add new user
        </Link>
        <div className={"flex items-center gap-1"}>
          <input
            placeholder={"Search..."}
            className={"input"}
            type={"text"}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              filterUsers(e.target.value as keyof User)
            }
          />
          <select
            className={"input w-auto"}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setActiveSearchFilter(event.target.value as keyof User)
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
              <button onClick={() => sortColumn("name")}>
                Name{" "}
                {currentSortKey === "name" && (
                  <span className="pl-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </td>
            <td>
              <button onClick={() => sortColumn("email")}>
                Email{" "}
                {currentSortKey === "email" && (
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
          {users.map((user) => (
            <tr key={user.id} className={"border"}>
              <td>
                <span>{user.name}</span>
              </td>
              <td>
                <span>{user.email}</span>
              </td>

              <td className={"flex items-center gap-2"}>
                <Link href={`/admin/admin-users/${user.id}`}>
                  <PencilIcon className={"w-5 h-5"} /> Edit
                </Link>
                <Link href={`/admin/admin-users/${user.id}/delete`}>
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
  const users: User[] = await getAdminUsers();
  return {
    props: {
      users,
    },
    revalidate: 20,
  };
}

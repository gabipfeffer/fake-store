import {
  ArrowLeftOnRectangleIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "../../typings";
import { signOut } from "next-auth/react";

type Props = {
  navigation: NavItem[];
};

export default function AdminNav({ navigation }: Props) {
  const pathname = usePathname();
  return (
    <aside className={"text-white"}>
      <Link href={"/admin/dashboard"} className={"inactiveAdminNavLink"}>
        <BuildingStorefrontIcon className={"h-6"} />
        <span>eCommerce Admin</span>
      </Link>
      <nav className={"flex flex-col space-y-4 mt-4"}>
        {navigation.map((navItem: NavItem) => {
          const Icon = navItem.icon;
          return (
            <Link
              key={navItem.url}
              href={navItem.url}
              className={
                pathname === navItem.url
                  ? "activeAdminNavLink"
                  : "inactiveAdminNavLink"
              }
            >
              <Icon className={"h-6"} /> {navItem.title}
            </Link>
          );
        })}
        <button className={"inactiveAdminNavLink"} onClick={() => signOut()}>
          <ArrowLeftOnRectangleIcon className={"h-6"} /> Logout
        </button>
      </nav>
    </aside>
  );
}

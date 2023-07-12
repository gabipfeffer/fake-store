import {
  ArchiveBoxIcon,
  CogIcon,
  HomeIcon,
  QueueListIcon,
  TagIcon,
} from "@heroicons/react/24/solid";
import { NavItem } from "../../typings";

export const adminNavigation: NavItem[] = [
  { url: "/admin/dashboard", title: "Dashboard", icon: HomeIcon },
  { url: "/admin/orders", title: "Orders", icon: QueueListIcon },
  { url: "/admin/products", title: "Products", icon: ArchiveBoxIcon },
  { url: "/admin/categories", title: "Categories", icon: TagIcon },
  { url: "/admin/settings", title: "Settings", icon: CogIcon },
];

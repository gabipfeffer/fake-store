import {
  ArchiveBoxIcon,
  CogIcon,
  HomeIcon,
  QueueListIcon,
} from "@heroicons/react/24/solid";
import { NavItem } from "../../typings";

export const adminNavigation: NavItem[] = [
  { url: "/admin", title: "Dashboard", icon: HomeIcon },
  { url: "/admin/orders", title: "Orders", icon: QueueListIcon },
  { url: "/admin/products", title: "Products", icon: ArchiveBoxIcon },
  { url: "/admin/settings", title: "Settings", icon: CogIcon },
];

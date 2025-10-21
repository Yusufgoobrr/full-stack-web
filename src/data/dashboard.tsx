import {
  Cog6ToothIcon,
  CubeIcon,
  HomeIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

export const DashboardTabs = [
  {
    label: "Home",
    icon: <HomeIcon className="w-5 h-5" />,
    link: "/dashboard",
  },
  {
    label: "Transactions",
    icon: <TagIcon className="w-5 h-5" />,
    link: "/dashboard/transactions",
  },
  {
    label: "My Products",
    icon: <CubeIcon className="w-5 h-5" />,
    link: "/dashboard/my-products",
  },
  {
    label: "Settings",
    icon: <Cog6ToothIcon className="w-5 h-5" />,
    link: "/dashboard/settings",
  },
];

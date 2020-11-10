import { Home, Users, ShoppingBag, FolderPlus, Server } from "react-feather";
import auth from "../services/authService";
const user = auth.getCurrentUser() ? auth.getCurrentUser() : {};

export const MENUITEMS = [
  {
    path: "/dashboard/",
    title: "Dashboard",
    icon: Home,
    type: "link",
    badgeType: "primary",
    active: true,
  },
  (user.is_superuser || user.is_staff) && {
    path: "/dashboard/hotels",
    title: "Hotels",
    icon: Server,
    type: "link",
    active: false,
    children: [
      {
        path: "/dashboard/home/hotels/new-hotel",
        title: "New Hotel",
        type: "link",
      },
      {
        path: "/dashboard/home/hotel-rooms/new-room",
        title: "New Room",
        type: "link",
      },
    ],
  },

  user.is_superuser && {
    path: "/dashboard/packages",
    title: "Packages",
    icon: FolderPlus,
    type: "link",
    active: false,
    children: [
      {
        path: "/dashboard/packages/new-package",
        title: "New package",
        type: "link",
      },
    ],
  },
  (user.is_superuser || user.is_staff) && {
    path: "/dashboard/users/",
    title: "Users",
    icon: Users,
    type: "link",
    active: false,
    children: [
      {
        path: "/dashboard/account/new-user",
        title: "New user",
        type: "link",
      },
    ],
  },

  {
    path: "/dashboard/bookings/",
    title: "Bookings",
    icon: ShoppingBag,
    type: "link",
    active: false,
    children: [
      {
        path: "/dashboard/bookings/new-booking",
        title: "New booking",
        type: "link",
      },
    ],
  },
];

// Import the required icons here
import { MdOutlineCalendarMonth } from "react-icons/md";
import { MdOutlineWorkOff } from "react-icons/md";
import { MdOutlineWorkHistory } from "react-icons/md";
import { RiBodyScanLine } from "react-icons/ri";
import { MdPayments } from "react-icons/md";
import { TbPackages } from "react-icons/tb";
import { FaChalkboardUser } from "react-icons/fa6";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { RiAccountPinCircleFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { TbPasswordFingerprint } from "react-icons/tb";
import { RiDashboard3Fill } from "react-icons/ri";
import { CgDatabase } from "react-icons/cg";
import { MdOutlineForest } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { IoTicketOutline } from "react-icons/io5";
import useAuthStore from "../store/authStore";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: RiDashboard3Fill,
    path: "/dashboard",
    gradientClass:
      "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
    subItems: [],
  },
  {
    title: "Masters",
    icon: CgDatabase,
    path: "",
    gradientClass:
      "bg-blue-v2 from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
    subItems: [
      {
        title: "Departments",
        icon: MdOutlineForest,
        path: "/departments",
      },
      {
        title: "Location Category",
        icon: MdOutlineForest,
        path: "/entity-types",
      },
      {
        title: "Locations",
        icon: MdOutlineForest,
        path: "/entities",
      },
      {
        title: "Location Admins",
        icon: FaUsers,
        path: "/entity-admins",
      },
      {
        title: "Nodal Officer",
        icon: FaUsers,
        path: "/nodal-officer",
      },
      {
        title: "Facilites",
        icon: TbPackages,
        path: "/facilites",
      },
      {
        title: "Service ",
        icon: TbPackages,
        path: "/service",
      },
      {
        title: "Service Varient ",
        icon: FaUsers,
        path: "/service-varient",
      },
      {
        title: "facility-unified-create ",
        icon: FaUsers,
        path: "/facility/unified-create",
      },

      {
        title: "Gate Keeper ",
        icon: RiBodyScanLine,
        path: "/gate-keepers",
      },
      {
        title: "Payments",
        icon: MdPayments,
        path: "/payments",
      },
    ],
  },
  {
    title: "Reports",
    icon: HiOutlineDocumentReport,
    path: "",
    gradientClass:
      "bg-blue-v2 from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
    subItems: [
      {
        title: "Bookings",
        icon: RiDashboard3Fill,
        path: "/entity-bookings",
        gradientClass:
          "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
        subItems: [],
        roles: ["Admin", "Super Admin"],
      },
      {
        title: "User Wise",
        icon: FaChalkboardUser,
        path: "/user-wise",
      },
      {
        title: "RTC Bookings",
        icon: FaUsers,
        path: "/rtc-bookings",
      },
      {
        title: "Metro Bookings",
        icon: FaUsers,
        path: "/metro-bookings",
      },
    ],
  },
  {
    title: "Dates",
    icon: MdOutlineCalendarMonth,
    path: "",
    gradientClass:
      "bg-blue-v2 from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
    subItems: [
      {
        title: "Holidays",
        icon: MdOutlineWorkOff,
        path: "/holidays",
      },
    ],
  },
  // {
  //   title: "Book Tickets",
  //   icon: RiDashboard3Fill,
  //   path: "/entity-bookings",
  //   gradientClass:
  //     "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
  //   subItems: [],
  //   roles: ["Admin", "Super Admin"],
  // },
  {
    title: "My Account",
    icon: RiAccountPinCircleFill,
    path: "",
    gradientClass:
      "bg-blue-v2 from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
    subItems: [
      {
        title: "Profile",
        icon: CgProfile,
        path: "/my-profile",
      },
      {
        title: "Change Password",
        icon: TbPasswordFingerprint,
        path: "/change-password",
      },
    ],
  },
];

export default sidebarItems;

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
import { MdOutlineLocalFireDepartment } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdLocationCity } from "react-icons/md";
import { TbTrain } from "react-icons/tb";
import { GrTransaction } from "react-icons/gr";
import { GrUserPolice } from "react-icons/gr";
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
  // Mastres
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
        title: "Location Categories",
        icon:  MdOutlineLocalFireDepartment,
        path: "/entity-types",
      },
      {
        title: "Nodal Officers",
        icon: GrUserPolice,
        path: "/nodal-officer",
      },
      {
        title: "Locations",
        icon: MdLocationCity,
        path: "/entities",
      },

      {
        title: " Master Facilities",
        icon: MdOutlineForest,
        path: "/super-admin-facilites",
      },

      {
        title: "Location Admins",
        icon: FaUsers,
        path: "/entity-admins",
      },
      {
        title: "Facilites",
        icon: TbPackages,
        path: "/facilites",
      },
      {
        title: "Sub Facilities",
        icon: TbPackages,
        path: "/service",
      },
      {
        title: "Ticket Types ",
        icon: FaUsers,
        path: "/service-varient",
      },
      {
        title: "Facilities ",
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
    title: "Bookings Reports",
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
        title: "Completed Bookings",
        icon: FaChalkboardUser,
        path: "/completed-bookings",
      },
      {
        title: "Payment Transactions",
        icon: FaUsers,
        path: "/payment-transaction-report",
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

  {
    title: "Metro Reports",
    icon: TbTrain,
    path: "",
    gradientClass:
      "bg-blue-v2 from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
    subItems: [
      {
        title: "Transaction Details",
        icon: GrTransaction,
        path: "/transaction-report",
      },
      // {
      //   title: "Transaction Report",
      //   icon: RiDashboard3Fill,
      //   path: "/transaction-general-report",
      // },
      // {
      //   title: "Settlement Report",
      //   icon: RiDashboard3Fill,
      //   path: "/summary-report",
      // },
    ],
  },
];

export default sidebarItems;

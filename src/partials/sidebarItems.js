// Import the required icons here
import { MdOutlineCalendarMonth } from "react-icons/md";
import { MdOutlineWorkOff } from "react-icons/md";
import { MdOutlineWorkHistory } from "react-icons/md";
import {
  RiBankFill,
  RiBodyScanLine,
  RiPassPendingLine,
  RiPassValidFill,
} from "react-icons/ri";
import { MdPayments } from "react-icons/md";
import { TbPackages } from "react-icons/tb";
import { FaBus, FaChalkboardUser, FaUser } from "react-icons/fa6";
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
import { TbReportSearch } from "react-icons/tb";
import { TbReportAnalytics } from "react-icons/tb";
import { IoTicketOutline, IoTodayOutline } from "react-icons/io5";
import { SiReacthookform } from "react-icons/si";
import useAuthStore from "../store/authStore";
import { FaCalendarCheck } from "react-icons/fa";
import { BsPassport } from "react-icons/bs";
import { VscCompassActive } from "react-icons/vsc";
import { MdEventAvailable } from "react-icons/md";

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
        icon: MdOutlineLocalFireDepartment,
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
        title: "Consolidated Booking Details",
        icon: TbReportSearch,
        path: "/completed-bookings",
      },
      {
        title: "Individual Booking Details",
        icon: RiDashboard3Fill,
        path: "/entity-bookings",
        gradientClass:
          "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
        subItems: [],
        roles: ["Admin", "Super Admin"],
      },
      {
        title: "Payment Transactions",
        icon: TbReportAnalytics,
        path: "/payment-transaction-report",
      },
      {
        title: "Consolidated Booking Details",
        icon: TbReportSearch,
        path: "/pos-consolidated-booking-reports",
      },
      {
        title: "Individual Booking Details",
        icon: RiDashboard3Fill,
        path: "/pos-individual-booking-reports",
        gradientClass:
          "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
        subItems: [],
        roles: ["Admin", "Super Admin"],
      },
      {
        title: "Payment Transactions",
        icon: TbReportAnalytics,
        path: "/pos-payment-transactions-reports",
      },
      {
        title: "Bank Payments",
        icon: RiBankFill,
        path: "/bank-transactions",
      },
      {
        title: "Metro Bookings",
        icon: FaUsers,
        path: "/metro-bookings",
      },
      //  {
      //   title: "Failed Transactions",
      //   icon: FaUsers,
      //   path: "/transactions-dashboard",
      // },
      {
        title: "Total Transactions",
        icon: FaUsers,
        path: "/total-transactions-dashboard",
      },
      {
        title: "User Report",
        icon: FaUsers,
        path: "/user-report",
      },
      {
        title: "Refund Transactions",
        icon: RiBankFill,
        path: "/refund-transactions",
      },
    ],
  },
  // facilities
  {
    title: "Facility Reports",
    icon: HiOutlineDocumentReport,
    path: "",
    gradientClass:
      "bg-blue-v2 from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
    subItems: [
      {
        title: "Facility Bookings",
        icon: TbReportAnalytics,
        path: "/facility-bookings",
      },

      {
        title: "Consolidated Facility Booking",
        icon: TbReportAnalytics,
        path: "/day-wise-bookings",
      },
      {
        title: "Individual Facility Booking",
        icon: TbReportAnalytics,
        path: "/application-day-wise-bookings",
      },
    ],
  },
  // ---------
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
        title: "Consolidated Ticket Details",
        icon: TbReportSearch,
        path: "/booking-details",
      },
      {
        title: "Individual Ticket Details",
        icon: RiDashboard3Fill,
        path: "/transaction-report",
      },
      {
        title: "Payment Transactions",
        icon: TbReportAnalytics,
        path: "/pending-transaction-details",
      },
      {
        title: "Bank Payments",
        icon: RiBankFill,
        path: "/metro-cumulative-bookings",
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

      {
        title: "Total Transactions",
        icon: RiDashboard3Fill,
        path: "/metro-total-transaction",
      },
      {
        title: "User Report",
        icon: FaUsers,
        path: "/metro-user-report",
      },
      {
        title: "Refund Transactions",
        icon: FaUsers,
        path: "/metro-refund-transactions",
      },
    ],
  },
  // griveance
  {
    title: "Grievance",
    icon: SiReacthookform,
    path: "",
    gradientClass:
      "bg-blue-v2 from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
    subItems: [
      {
        title: "Consolidated Incident Details",
        icon: TbReportSearch,
        path: "/Grievance-consolidate",
      },
      {
        title: "Overall Incident Details",
        icon: TbReportSearch,
        path: "/Grievance-Incident",
      },
      {
        title: "Individual Incident Details",
        icon: TbReportSearch,
        path: "/Grievance-individual",
      },
    ],
  },
  // rtc
  {
    title: "Bus Pass Reports",
    icon: FaBus,
    path: "",
    gradientClass:
      "bg-blue-v2 from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
    subItems: [
      {
        title: "Day Pass",
        icon: IoTodayOutline,
        path: "/day-pass",
      },
      {
        title: "Ordinary pass",
        icon: RiPassPendingLine,
        path: "/ordinary-pass",
      },
      {
        title: "MST Pass",
        icon: BsPassport,
        path: "/mst-pass",
      },
      {
        title: "Express Pass",
        icon: VscCompassActive,
        path: "/express-pass",
      },
      {
        title: "Student Pass",
        icon: RiPassValidFill,
        path: "/student-pass",
      },
      {
        title: "Pending Pass",
        icon: RiPassPendingLine,
        path: "/pending-pass",
      },
      {
        title: "Booking Report",
        icon: MdEventAvailable,
        path: "/bus-pass-booking-report",
      },
      {
        title: "Total Transactions",
        icon: RiDashboard3Fill,
        path: "/bus-pass-total-transaction",
      },
      {
        title: "User Report",
        icon: MdEventAvailable,
        path: "/bus-pass-user-report",
      },
      {
        title: "Refund Transactions",
        icon: RiDashboard3Fill,
        path: "/bus-pass-refund-report",
      },

    ],
  },
  //intercity
  {
    title: "Intercity Reports",
    icon: FaBus,
    path: "",
    gradientClass:
      "bg-blue-v2 from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
    subItems: [
      {
        title: "Consolidated Report",
        icon: RiDashboard3Fill,
        path: "/intercity-consolidated-report",
      },
      {
        title: "Individual Report",
        icon: RiDashboard3Fill,
        path: "/intercity-individual-report",
      },
      {
        title: "Total Transactions",
        icon: RiDashboard3Fill,
        path: "/intercity-total-transaction",
      },
      {     
        title: "User Report",
        icon: MdEventAvailable,
        path: "/intercity-user-report",
      },
      {
        title: "Refund Transactions",
        icon: RiDashboard3Fill,
        path: "/intercity-refund-report",
      },
      {
        title: "Payment Transactions",
        icon: TbReportAnalytics,
        path: "/intercity-payment-transactions",
      },
    ],

  },
  // Tourism
  {
    title: "Tourism",
    icon: FaCalendarCheck,
    path: "",
    gradientClass:
      "bg-blue-v2 from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
    subItems: [
      {
        title: "Consolidated Details",
        icon: TbReportSearch,
        path: "/tourism-consolidate",
      },
      {
        title: "Individual Details",
        icon: TbReportSearch,
        path: "/tourism-individual",
      },
      {
        title: "Payment Transaction Details",
        icon: TbReportSearch,
        path: "/tourism-payment-transaction",
      },
      {
        title: "Bank Payment Details",
        icon: TbReportSearch,
        path: "/toursim-bank-payments",
      },
    ],
  },
  // User Transaction
  {
    title: "User Transaction",
    icon: FaUser,
    path: "/user-transaction",
    gradientClass:
      "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
    subItems: [],
  },
  // book tickets on counter bookings
  {
    title: "Book Tickets",
    icon: IoTicketOutline,
    path: "/book-tickets",
    gradientClass:
      "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
    subItems: [],
  },

  {
    title: "Monthly Reports",
    icon: FaCalendarCheck,
    path: "",
    gradientClass:
      "bg-blue-v2 from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
    subItems: [
      {
        title: "Monthly Reports",
        icon: TbReportSearch,
        path: "/monthly-reports",
      },
    ],
  },

  {
    title: "Masters",
    icon: FaCalendarCheck,
    path: "",
    gradientClass:
      "bg-blue-v2 from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
    subItems: [
      {
        title: "Packages",
        icon: TbReportSearch,
        path: "/amrabad-packages",
      },
    ],
  },
  // amrabad
  {
    title: "Reports",
    icon: HiOutlineDocumentReport,
    path: "",
    gradientClass:
      "bg-blue-v2 from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]",
    subItems: [
      {
        title: "Booking Reports",
        icon: TbReportSearch,
        path: "/amrabad-booking-reports",
      },
      {
        title: "POS Reports",
        icon: TbReportAnalytics,
        path: "/amrabad-pos-reports",
      },
      {
        title: "House Wise Reports",
        icon: RiDashboard3Fill,
        path: "/amrabad-house-wise-reports",
      },
      {
        title: "Payment Transactions",
        icon: TbReportAnalytics,
        path: "/amrabad-payment-transactions",
      },
      {
        title: "Availability Report",
        icon: MdEventAvailable,
        path: "/amrabad-availability-report",
      },
      {
        title: "User Report",
        icon: MdEventAvailable,
        path: "/amrabad-user-report",
      },
      {
        title: "Refund Transaction Report",
        icon: MdEventAvailable,
        path: "/amrabad-refund-transaction-report",
      },
      {
        title: "Total Transactions",
        icon: RiDashboard3Fill,
        path: "/amarabad-total-transaction",
      },
     
    ],
  },
];

export default sidebarItems;

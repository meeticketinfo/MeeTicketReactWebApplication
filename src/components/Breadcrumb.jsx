import React from "react";
import { Link, useLocation } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";

const Breadcrumb = ({
  customItems = [],
  showHome = false,
  className = "",
  separator = <IoChevronForward className="w-4 h-4 text-gray-400" />,
}) => {
  const location = useLocation();

  // Generate breadcrumb items from current path
  const generateBreadcrumbItems = () => {
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment);
    const items = [];

    if (showHome) {
      items.push({
        label: "Dashboard",
        path: "/dashboard",
        icon: <IoHomeOutline className="w-4 h-4" />,
      });
    }

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Convert segment to readable label
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      items.push({
        label,
        path: currentPath,
        isLast: index === pathSegments.length - 1,
      });
    });

    return items;
  };

  // Use custom items if provided, otherwise generate from path
  const breadcrumbItems =
    customItems.length > 0 ? customItems : generateBreadcrumbItems();

  return (
    <nav
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="flex items-center text-gray-400">{separator}</span>
          )}

          {item.isLast || index === breadcrumbItems.length - 1 ? (
            // Current page (not clickable)
            <span
              className="flex items-center text-gray-600 dark:text-gray-300 font-medium"
              onClick={item.onclick}
            >
              {item.icon && <span className="mr-1">{item.icon}</span>}
              {item.label}
            </span>
          ) : (
            // Clickable breadcrumb item
            <Link
              to={item.path}
              className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              onClick={item.onclick}
            >
              {item.icon && <span className="mr-1">{item.icon}</span>}
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;

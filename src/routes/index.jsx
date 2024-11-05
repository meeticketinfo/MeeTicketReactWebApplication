// src/routes/index.tsx

import React, { useEffect } from "react";
import { useLocation, useRoutes } from "react-router-dom";
import { routes } from "./routesConfig";

const AppRoutes = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Automatically scrolls to top whenever pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  const element = useRoutes(routes);
  return element;
};

export default AppRoutes;

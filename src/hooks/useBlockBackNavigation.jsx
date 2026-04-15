import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useBlockBackNavigation(routes = []) {
  const location = useLocation();

  useEffect(() => {
    const shouldBlock = routes.some(r => location.pathname.includes(r));
    if (!shouldBlock) return;

    const block = () => window.history.pushState(null, "", window.location.href);

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", block);

    return () => window.removeEventListener("popstate", block);
  }, [location.pathname, routes]);
}
// src/components/ScrollToTop.jsx

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const el = document.getElementById("dashboard-scroll-container");
    if (el) {
      el.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto", // keep auto for dashboards
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;

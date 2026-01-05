import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Breadcrumb item shape:
 * {
 *   label: string,
 *   to?: string   // optional; if omitted, item is rendered as active
 * }
 */

const BreadcrumbContext = createContext(null);

export const BreadcrumbProvider = ({ children }) => {
  const location = useLocation();

  const [items, setItems] = useState([]);

  /**
   * Public API for pages
   * Call inside useEffect of each page
   */
  const setBreadcrumb = (breadcrumbItems = []) => {
    if (!Array.isArray(breadcrumbItems)) {
      console.warn("Breadcrumb must be an array");
      return;
    }
    setItems(breadcrumbItems);
  };

  /**
   * Auto-reset breadcrumb on route change
   * Pages are expected to re-set their breadcrumb
   */
  useEffect(() => {
    setItems([]);
  }, [location.pathname]);

  return (
    <BreadcrumbContext.Provider
      value={{
        items,
        setBreadcrumb,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => {
  const ctx = useContext(BreadcrumbContext);

  if (!ctx) {
    throw new Error("useBreadcrumb must be used inside <BreadcrumbProvider>");
  }

  return ctx;
};

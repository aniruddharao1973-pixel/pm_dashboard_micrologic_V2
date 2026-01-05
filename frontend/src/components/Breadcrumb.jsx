// src/components/Breadcrumb.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ items = [] }) {
  return (
    <div className="flex items-center gap-1.5 text-sm mb-6 px-4 py-2.5
      bg-gradient-to-r from-white via-indigo-50/20 to-white 
      backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-sm
      hover:shadow-md hover:border-indigo-200/70 transition-all duration-300
      relative overflow-hidden
      before:absolute before:inset-0 before:bg-gradient-to-r 
      before:from-transparent before:via-indigo-100/10 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%]
      before:transition-transform before:duration-1000">

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5 relative z-10">
          
          {/* Link or Active Text */}
          {item.to ? (
            <Link
              to={item.to}
              className="
                text-gray-700 font-semibold text-sm
                hover:text-indigo-600 
                transition-all duration-300
                relative
                px-2.5 py-1 rounded-lg
                hover:bg-white/80
                hover:shadow-sm
                after:content-['']
                after:absolute
                after:bottom-0.5
                after:left-2.5
                after:right-2.5
                after:h-0.5
                after:bg-gradient-to-r
                after:from-indigo-400
                after:via-indigo-600
                after:to-indigo-400
                after:scale-x-0
                after:transition-transform
                after:duration-300
                after:rounded-full
                hover:after:scale-x-100
              "
            >
              {item.label}
            </Link>
          ) : (
            <span className="
              text-indigo-600 font-bold text-sm
              relative px-2.5 py-1 rounded-lg
              bg-gradient-to-br from-indigo-50 via-white to-indigo-50
              shadow-sm border border-indigo-100/50
              hover:shadow-md transition-all duration-300
            ">
              {item.label}
              <span className="
                absolute bottom-0.5 left-2.5 right-2.5 h-0.5 
                bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-500
                rounded-full shadow-sm
              "></span>
            </span>
          )}

          {/* Arrow with animation */}
          {index < items.length - 1 && (
            <span className="
              text-gray-400 font-medium
              transition-all duration-300
              hover:text-indigo-500 hover:scale-110
              cursor-default
            ">›</span>
          )}
        </div>
      ))}
    </div>
  );
}
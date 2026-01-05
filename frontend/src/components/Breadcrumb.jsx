// src/components/Breadcrumb.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ items = [] }) {
  return (
    <div
      className="flex flex-col sm:flex-row gap-1.5 text-base sm:text-[15px] mb-6 px-4 py-2.5

  bg-gradient-to-r from-white via-indigo-50/20 to-white 
  backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-sm
  hover:shadow-md hover:border-indigo-200/70 transition-all duration-300
  relative
  before:absolute before:inset-0 before:bg-gradient-to-r 
  before:from-transparent before:via-indigo-100/10 before:to-transparent
  before:translate-x-[-100%] hover:before:translate-x-[100%]
  before:transition-transform before:duration-1000"
    >
      {/* LINE 1 — all except last (mobile + desktop) */}
      <div className="flex flex-wrap items-center gap-1.5 relative z-10">
        {items.slice(0, -1).map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            {item.to ? (
              <Link
                to={item.to}
                className="
            text-gray-700 font-semibold text-base sm:text-[15px]

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
              <span
                className="
          text-indigo-600 font-bold text-base sm:text-[15px]

          relative px-2.5 py-1 rounded-lg
          bg-gradient-to-br from-indigo-50 via-white to-indigo-50
          shadow-sm border border-indigo-100/50
        "
              >
                {item.label}
              </span>
            )}

            <span className="text-gray-400 font-medium">›</span>
          </div>
        ))}
      </div>

      {/* LINE 2 — last item (mobile only) */}
      <div className="flex items-center gap-1.5 sm:hidden relative z-10">
        <span className="text-gray-400 font-medium">›</span>
        <span
          className="
    text-indigo-600 font-bold text-base sm:text-[15px]

    relative px-2.5 py-1 rounded-lg
    bg-gradient-to-br from-indigo-50 via-white to-indigo-50
    shadow-sm border border-indigo-100/50
  "
        >
          {items[items.length - 1]?.label}
        </span>
      </div>
      {/* LAST ITEM — desktop only */}
      <div className="hidden sm:flex items-center gap-1.5">
        {items[items.length - 1]?.to ? (
          <Link
            to={items[items.length - 1].to}
            className="
        text-gray-700 font-semibold text-base sm:text-[15px]

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
            {items[items.length - 1].label}
          </Link>
        ) : (
          <span
            className="
        text-indigo-600 font-bold text-base sm:text-[15px]

        relative px-2.5 py-1 rounded-lg
        bg-gradient-to-br from-indigo-50 via-white to-indigo-50
        shadow-sm border border-indigo-100/50
      "
          >
            {items[items.length - 1].label}
          </span>
        )}
      </div>
    </div>
  );
}

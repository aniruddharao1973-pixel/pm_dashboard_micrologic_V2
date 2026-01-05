// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };



// frontend\tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Custom breakpoints for better responsive design
      screens: {
        xs: "475px", // Extra small screens
        sm: "640px", // Small screens
        md: "768px", // Medium screens (tablets)
        lg: "1024px", // Large screens (small desktops)
        xl: "1280px", // Extra large screens
        "2xl": "1536px", // 2X large screens
        "3xl": "1920px", // 4K screens
      },

      // Responsive font sizes
      fontSize: {
        xxs: ["0.625rem", { lineHeight: "0.75rem" }], // 10px
        "2xs": ["0.5rem", { lineHeight: "0.625rem" }], // 8px
      },

      // Custom spacing for mobile/desktop differences
      spacing: {
        18: "4.5rem", // 72px
        88: "22rem", // 352px
        112: "28rem", // 448px
        128: "32rem", // 512px
      },

      // Responsive animations
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
        slideInLeft: "slideInLeft 0.3s ease-out",
        slideInRight: "slideInRight 0.3s ease-out",
        slideInUp: "slideInUp 0.3s ease-out",
        slideInDown: "slideInDown 0.3s ease-out",
        "bounce-slow": "bounce 2s infinite",
        "pulse-slow": "pulse 3s infinite",
        "spin-slow": "spin 3s linear infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },

      // Responsive container padding
      padding: {
        safe: "env(safe-area-inset-top)",
      },

      // Mobile-first max-widths
      maxWidth: {
        "screen-3xl": "1920px",
        "8xl": "90rem",
        "9xl": "100rem",
      },

      // Responsive gradients
      backgroundImage: {
        "gradient-mobile": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-desktop":
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        "gradient-sidebar":
          "linear-gradient(180deg, #6366f1 0%, #7c3aed 50%, #6366f1 100%)",
        "gradient-header":
          "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)",
      },

      // Responsive shadows
      boxShadow: {
        "mobile-card":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "tablet-card":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "desktop-card":
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "inner-lg": "inset 0 4px 12px 0 rgba(0, 0, 0, 0.05)",
        glow: "0 0 20px rgba(99, 102, 241, 0.3)",
        "glow-md": "0 0 30px rgba(99, 102, 241, 0.4)",
        "glow-lg": "0 0 40px rgba(99, 102, 241, 0.5)",
      },

      // Responsive border radius
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
      },

      // Responsive z-index layers
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },

      // Custom colors for your specific design
      colors: {
        "sidebar-start": "#6366f1",
        "sidebar-middle": "#7c3aed",
        "sidebar-end": "#6366f1",
        glass: "rgba(255, 255, 255, 0.1)",
        "glass-dark": "rgba(0, 0, 0, 0.1)",
        "glass-white": "rgba(255, 255, 255, 0.05)",
        "glass-border": "rgba(255, 255, 255, 0.2)",
      },

      // Responsive typography
      lineHeight: {
        tight: "1.1",
        snug: "1.25",
      },

      // Responsive min/max heights
      minHeight: {
        "screen-75": "75vh",
        "screen-50": "50vh",
        "screen-25": "25vh",
      },
      maxHeight: {
        "screen-90": "90vh",
        "screen-80": "80vh",
        "screen-75": "75vh",
      },

      // Responsive grid columns
      gridTemplateColumns: {
        responsive: "repeat(auto-fit, minmax(280px, 1fr))",
        "responsive-sm": "repeat(auto-fit, minmax(200px, 1fr))",
        "responsive-lg": "repeat(auto-fit, minmax(320px, 1fr))",
      },

      // Responsive aspect ratios
      aspectRatio: {
        card: "4 / 3",
        wide: "16 / 9",
        square: "1 / 1",
      },
    },
  },

  // Responsive variants
  variants: {
    extend: {
      display: ["responsive", "group-hover", "group-focus"],
      visibility: ["responsive", "group-hover", "group-focus"],
      transform: ["responsive", "hover", "focus", "group-hover"],
      scale: ["responsive", "hover", "focus", "group-hover", "active"],
      translate: ["responsive", "hover", "focus", "group-hover"],
      opacity: ["responsive", "hover", "focus", "group-hover", "disabled"],
      backgroundColor: [
        "responsive",
        "hover",
        "focus",
        "group-hover",
        "active",
      ],
      textColor: ["responsive", "hover", "focus", "group-hover", "active"],
      borderColor: ["responsive", "hover", "focus", "group-hover"],
      borderRadius: ["responsive", "hover", "focus"],
      boxShadow: ["responsive", "hover", "focus", "group-hover"],
      width: ["responsive", "hover", "focus"],
      height: ["responsive", "hover", "focus"],
      padding: ["responsive", "hover", "focus"],
      margin: ["responsive", "hover", "focus"],
    },
  },

  plugins: [
    // You can add these plugins if needed
    // require('@tailwindcss/forms'), // Better form styling
    // require('@tailwindcss/typography'), // Prose styling
    // require('@tailwindcss/aspect-ratio'), // Aspect ratio utilities
  ],
};

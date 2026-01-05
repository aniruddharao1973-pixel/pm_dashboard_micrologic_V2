// // src/components/FolderCard.jsx
// import React from "react";

// const FolderCard = ({ folder, onClick }) => {
//   const colors = [
//     "from-yellow-400 to-yellow-500",
//     "from-blue-500 to-blue-600",
//     "from-purple-500 to-purple-600",
//     "from-teal-500 to-teal-600",
//     "from-pink-500 to-pink-600",
//   ];

//   // Convert UUID → numeric hash
//   const hashString = (str) => {
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) {
//       hash = str.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     return Math.abs(hash);
//   };

//   const color = colors[hashString(folder.id) % colors.length];

//   const formatDate = (dateString) => {
//     if (!dateString) return "—";

//     const d = new Date(dateString);
//     if (isNaN(d.getTime())) return "—";

//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();

//     return `${day}/${month}/${year}`;
//   };

//   return (
//     <div
//       onClick={onClick}
//       className="
//         cursor-pointer 
//         bg-white 
//         border border-gray-200 
//         rounded-xl sm:rounded-2xl 
//         p-3 sm:p-4 md:p-5 
//         shadow-sm 
//         hover:shadow-lg 
//         hover:-translate-y-1 
//         transition-all duration-300
//       "
//     >
//       {/* Folder Icon */}
//       <div
//         className="
//           h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 
//           rounded-lg sm:rounded-xl 
//           bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600
//           flex items-center justify-center 
//           shadow-md
//         "
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6 sm:h-6.5 sm:w-6.5 md:h-7 md:w-7 text-white"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M3 7h4l2 2h11v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7z"
//           />
//         </svg>
//       </div>

//       {/* Folder Name */}
//       <h3 className="mt-3 sm:mt-3.5 md:mt-4 text-base sm:text-base md:text-lg font-semibold text-gray-800">
//         {folder.name}
//       </h3>

//       {/* Created Date */}
//       <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
//         Created: {formatDate(folder.created_at)}
//       </p>
//     </div>
//   );
// };

// export default FolderCard;


// src/components/FolderCard.jsx
import React from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const FolderCard = ({ folder, onClick, onDelete }) => {
  const { user } = useAuth();
  const isAdminLike = user?.role === "admin" || user?.role === "techsales";

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  return (
    <div
      onClick={onClick}
      className="
        relative cursor-pointer 
        bg-white 
        border border-gray-200 
        rounded-xl sm:rounded-2xl 
        p-3 sm:p-4 md:p-5 
        shadow-sm 
        hover:shadow-lg 
        hover:-translate-y-1 
        transition-all duration-300
      "
    >
      {isAdminLike && !folder.is_default && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(folder.id);
          }}
          className="
            absolute top-3 right-3
            p-1.5 rounded-lg
            text-red-500 hover:text-red-700
            hover:bg-red-50
            transition
          "
          title="Move folder to recycle bin"
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* Folder Icon */}
      <div
        className="
          h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 
          rounded-lg sm:rounded-xl 
          bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600
          flex items-center justify-center 
          shadow-md
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7h4l2 2h11v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7z"
          />
        </svg>
      </div>

      <h3 className="mt-3 font-semibold text-gray-800">{folder.name}</h3>

      <p className="text-gray-400 text-xs mt-1">
        Created: {formatDate(folder.created_at)}
      </p>
    </div>
  );
};

export default FolderCard;

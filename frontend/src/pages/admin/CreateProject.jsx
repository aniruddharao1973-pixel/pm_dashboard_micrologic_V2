// // src/pages/admin/CreateProject.jsx
// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAdminApi } from "../../api/adminApi";
// import { toast } from "react-toastify";

// export default function CreateProject() {
//   const { customerId } = useParams();  // <-- IMPORTANT
//   const navigate = useNavigate();
//   const { createProject } = useAdminApi();

//   const [name, setName] = useState("");

//   const handleCreate = async () => {
//     if (!name.trim()) {
//       toast.error("Project name is required");
//       return;
//     }

//     try {
//       await createProject({ name, customerId });
//       toast.success("Project created successfully!");
//       navigate(`/admin/customers/${customerId}`);

//     } catch (err) {
//       console.error("Create Project Error:", err);
//       toast.error(err.response?.data?.message || "Failed to create project");
//     }
//   };

//   return (
// <div className="min-h-screen flex items-start justify-center px-6 pt-20 bg-gray-50">

//   <div className="w-full max-w-xl
//                   bg-white/90 shadow-xl rounded-2xl
//                   p-8 border border-gray-300">

//     <h1 className="text-3xl font-extrabold
//                    bg-gradient-to-r from-purple-600 to-blue-600
//                    bg-clip-text text-transparent
//                    text-center mb-8">
//       Create Project
//     </h1>

//     {/* Label */}
//     <label className="text-gray-700 font-semibold mb-2 block">
//       Project Name
//     </label>

//     {/* Input */}
//     <input
//       type="text"
//       className="w-full px-4 py-3 rounded-xl
//                  bg-gray-100 border-2 border-gray-300
//                  focus:border-purple-500 focus:ring-4 focus:ring-purple-100
//                  outline-none transition-all"
//       placeholder="Enter project name"
//       value={name}
//       onChange={(e) => setName(e.target.value)}
//     />

//     {/* Button */}
// <button
//   onClick={handleCreate}
//   className="w-full mt-6 py-3 rounded-xl text-white font-bold text-lg
//              bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600
//              shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-95
//              transition-all duration-300"
// >
//   Create Project →
// </button>

//   </div>

// </div>

//   );
// }

// src/pages/admin/CreateProject.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminApi } from "../../api/adminApi";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

export default function CreateProject() {
  const { customerId } = useParams(); // <-- IMPORTANT
  const navigate = useNavigate();
  const { createProject } = useAdminApi();
  const { user } = useAuth();

  const [name, setName] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      await createProject({ name, customerId });
      toast.success("Project created successfully!");
      // navigate(`/admin/customers/${customerId}`);

      if (user.role === "admin" || user.role === "techsales") {
        navigate(`/admin/customers/${customerId}`);
      } else {
        navigate("/projects");
      }
    } catch (err) {
      console.error("Create Project Error:", err);
      toast.error(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 sm:px-6 pt-10 sm:pt-16 md:pt-20 bg-gray-50">
      <div
        className="w-full max-w-xl 
                      bg-white/90 shadow-xl rounded-2xl 
                      p-6 sm:p-8 border border-gray-300"
      >
        <h1
          className="text-2xl sm:text-3xl font-extrabold 
                       bg-gradient-to-r from-purple-600 to-blue-600 
                       bg-clip-text text-transparent 
                       text-center mb-6 sm:mb-8"
        >
          Create Project
        </h1>

        {/* Label */}
        <label className="text-sm sm:text-base text-gray-700 font-semibold mb-2 block">
          Project Name
        </label>

        {/* Input */}
        <input
          type="text"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl 
                     bg-gray-100 border-2 border-gray-300
                     focus:border-purple-500 focus:ring-4 focus:ring-purple-100
                     outline-none transition-all
                     text-sm sm:text-base"
          placeholder="Enter project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleCreate}
          className="w-full mt-5 sm:mt-6 py-2.5 sm:py-3 rounded-xl text-white font-bold 
                     text-base sm:text-lg
                     bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600
                     shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-95
                     transition-all duration-300"
        >
          Create Project →
        </button>
      </div>
    </div>
  );
}

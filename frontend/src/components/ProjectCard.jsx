// src/components/ProjectCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const colors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-green-500 to-green-600",
    "from-pink-500 to-pink-600",
    "from-teal-500 to-sky-500",
  ];

  // Fix: UUID cannot use % → create numeric hash
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const color = colors[hashString(project.id) % colors.length];

  return (
<div
  onClick={() => navigate(`/projects/${project.id}/folders`)}
  className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-purple-400 hover:-translate-y-2"
>
  {/* Top colored strip with gradient */}
  <div className={`h-2 bg-gradient-to-r ${color}`}></div>
  
  <div className="p-6">
    {/* Icon and Badge Row */}
    <div className="flex items-center justify-between mb-4">
      {/* Project Icon */}
      <div
        className={`h-14 w-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7l9-4 9 4-9 4-9-4zm0 7l9 4 9-4"
          />
        </svg>
      </div>

      {/* Status Badge */}
      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
        Active
      </span>
    </div>

    {/* Project Name */}
    <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300 mb-3">
      {project.name}
    </h3>

    {/* Divider */}
    <div className="h-px bg-gradient-to-r from-purple-200 via-blue-200 to-transparent mb-4"></div>

    {/* Details Section */}
    <div className="space-y-2.5">
      {/* Customer */}
      {project.customer_name && (
        <div className="flex items-center gap-2.5 text-sm">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Customer</p>
            <p className="text-gray-800 font-semibold">{project.customer_name}</p>
          </div>
        </div>
      )}

      {/* Created Date */}
      <div className="flex items-center gap-2.5 text-sm">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-medium">Created</p>
          <p className="text-gray-800 font-semibold">
            {new Date(project.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>

    {/* Arrow Icon - appears on hover */}
    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
      <span className="text-gray-600 font-medium group-hover:text-purple-600 transition-colors">
        View Details
      </span>
      <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </div>
  </div>
</div>
  );
};

export default ProjectCard;

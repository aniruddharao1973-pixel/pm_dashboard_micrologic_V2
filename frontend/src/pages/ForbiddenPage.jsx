// // src/pages/ForbiddenPage.jsx
// import React from "react";
// import { Link } from "react-router-dom";

// export default function ForbiddenPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
//       <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 text-center">
//         <h1 className="text-4xl font-bold mb-3 text-red-600">403 Forbidden</h1>
//         <p className="text-lg text-slate-600 mb-6">
//           You don't have permission to access this resource.
//         </p>
//         <div className="flex justify-center gap-3">
//           <Link
//             to="/"
//             className="px-5 py-2 rounded-md border border-slate-200 hover:bg-slate-100"
//           >
//             Go to Dashboard
//           </Link>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
//           >
//             Reload
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




// // src/pages/ForbiddenPage.jsx
// import React from "react";
// import { Link } from "react-router-dom";

// export default function ForbiddenPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
//       <div className="max-w-md w-full">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-8 py-10">
//           <div className="text-center">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
//               <svg 
//                 className="w-8 h-8 text-red-600" 
//                 fill="none" 
//                 stroke="currentColor" 
//                 viewBox="0 0 24 24"
//               >
//                 <path 
//                   strokeLinecap="round" 
//                   strokeLinejoin="round" 
//                   strokeWidth={2} 
//                   d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
//                 />
//               </svg>
//             </div>
            
//             <h1 className="text-2xl font-semibold text-gray-900 mb-2">
//               Access Denied
//             </h1>
            
//             <p className="text-sm text-gray-600 mb-1">
//               Error 403 - Forbidden
//             </p>
            
//             <p className="text-gray-500 mb-8">
//               You do not have permission to access this resource. Please contact your administrator if you believe this is an error.
//             </p>
            
//             <div className="flex flex-col sm:flex-row gap-3 justify-center">
//               <Link
//                 to="/"
//                 className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
//               >
//                 Return to Dashboard
//               </Link>
              
//               {/* <button
//                 onClick={() => window.location.reload()}
//                 className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
//               >
//                 Retry
//               </button> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// src/pages/ForbiddenPage.jsx
import React from "react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 px-8 py-12 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5 pointer-events-none"></div>
          
          <div className="text-center relative">
            {/* Icon container with glow effect */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-700 mb-6 relative shadow-lg shadow-red-500/50">
              <div className="absolute inset-0 rounded-full bg-red-500 blur-xl opacity-50 animate-pulse"></div>
              <svg 
                className="w-12 h-12 text-white relative z-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Access Denied
            </h1>
            
            <div className="inline-block px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <p className="text-sm font-semibold text-red-600">
                Error 403 - Forbidden
              </p>
            </div>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              You do not have permission to access this resource. Please contact your administrator if you believe this is an error.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/"
                className="group inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Return to Login
              </a>
              
              {/* <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 border border-transparent rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-transparent transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50"
              >
                Retry
              </button> */}
            </div>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-tr-full"></div>
        </div>

        {/* Additional decorative elements */}
        <div className="mt-8 text-center">
          {/* <p className="text-gray-500 text-sm">
            Need help? Contact{" "}
            <a href="#" className="text-red-600 hover:text-red-700 underline transition-colors">
              support
            </a>
          </p> */}
        </div>
      </div>
    </div>
  );
}
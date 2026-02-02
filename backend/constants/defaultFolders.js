// // backend/constants/defaultFolders.js

// export const DEFAULT_PROJECT_FOLDERS = [
//   // 🔹 CUSTOMER + COMMON (10)
//   {
//     name: "Customer Documents",
//     customer_can_view: true,
//     customer_can_download: true,
//     customer_can_upload: false,
//     customer_can_delete: false,
//     subfolders: [{ name: "Customer Media Assets" }, { name: "Documents" }],
//   },
//   { name: "Proposal" },
//   { name: "Software Documents" },
//   { name: "DAP" },
//   { name: "Media Assets" },
//   { name: "Design Documents" },
//   { name: "User Manual" },
//   { name: "M O M" },
//   { name: "Dispatch Clearance" },
//   { name: "I & C" },

//   // 🔒 ADMIN ONLY (2)
//   {
//     name: "Project Status Update",
//     customer_can_view: false,
//     customer_can_download: false,
//     customer_can_upload: false,
//     customer_can_delete: false,
//   },
//   {
//     name: "Internal Documents",
//     customer_can_view: false,
//     customer_can_download: false,
//     customer_can_upload: false,
//     customer_can_delete: false,
//   },
// ];

// backend/constants/defaultFolders.js

export const DEFAULT_PROJECT_FOLDERS = [
  // 🔹 CUSTOMER + COMMON (10)
  {
    name: "Customer Documents",
    visibility: "shared",
    customer_can_view: true,
    customer_can_download: true,
    customer_can_upload: false,
    customer_can_delete: false,
    subfolders: [{ name: "Customer Media Assets" }, { name: "Documents" }],
  },
  {
    name: "Proposal",
    visibility: "shared",
  },
  {
    name: "Software Documents",
    visibility: "shared",
  },
  {
    name: "DAP",
    visibility: "shared",
  },
  {
    name: "Media Assets",
    visibility: "shared",
  },
  {
    name: "Design Documents",
    visibility: "shared",
  },
  {
    name: "User Manual",
    visibility: "shared",
  },
  {
    name: "M O M",
    visibility: "shared",
  },
  {
    name: "Dispatch Clearance",
    visibility: "shared",
  },
  {
    name: "I & C",
    visibility: "shared",
  },

  // 🔒 ADMIN ONLY (2)
  {
    name: "Project Status Update",
    visibility: "private",
    customer_can_view: false,
    customer_can_download: false,
    customer_can_upload: false,
    customer_can_delete: false,
  },
  {
    name: "Internal Documents",
    visibility: "private",
    customer_can_view: false,
    customer_can_download: false,
    customer_can_upload: false,
    customer_can_delete: false,
  },
];

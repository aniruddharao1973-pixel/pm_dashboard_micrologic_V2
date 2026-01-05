// src/utils/fileIcons.js

export const getFileIcon = (type) => {
  const fileType = type?.toLowerCase();

  switch (fileType) {
    case "pdf":
      return (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h8l6-6V4a2 2 0 00-2-2H4z" />
        </svg>
      );

    case "doc":
    case "docx":
      return (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a2 2 0 012-2h6l6 6v8a2 2 0 01-2 2H5a2 2 0 01-2-2V4z" />
        </svg>
      );

    case "jpg":
    case "jpeg":
    case "png":
      return (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" />
        </svg>
      );

    case "zip":
    case "rar":
      return (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3h8l4 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" />
        </svg>
      );

    default:
      return null;
  }
};

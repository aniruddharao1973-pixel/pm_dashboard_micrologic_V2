// // src/components/toast/AppToast.jsx
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./toast.css";

// export default function AppToast() {
//   return (
//     <ToastContainer
//       position="top-center"
//       autoClose={2500}
//       hideProgressBar={false}
//       newestOnTop
//       closeOnClick
//       pauseOnHover
//       draggable
//       theme="light"
//       limit={3}
//     />
//   );
// }

// src/components/toast/AppToast.jsx
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toast.css";

export default function AppToast() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick={false}
      pauseOnHover
      draggable
      theme="light"
      limit={false}
    />
  );
}

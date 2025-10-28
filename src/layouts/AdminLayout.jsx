// import { useState } from "react";
// import { Outlet } from "react-router-dom";
// import Header from "../components/Header/Header";
// import Sidebar from "../components/sidebar/Sidebar";
// import "../styles/style.css";

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   return (
//     <div className="bg-bg_color text-text_color min-h-screen ">
//       <Sidebar
//         isOpen={sidebarOpen}
//         setIsOpen={setSidebarOpen}
//         toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
//       />

//       <div
//         className={`flex flex-col flex-1 transition-all duration-300 ${
//           sidebarOpen ? "md:ml-64" : "md:ml-20"
//         }`}
//       >
//         <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
//         <main className="flex-1 px-3 py-6 overflow-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

// import { useState, useEffect } from "react";
// import { Outlet } from "react-router-dom";
// import Header from "../components/Header/Header";
// import Sidebar from "../components/sidebar/Sidebar";
// import "../styles/style.css";

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

//   // Apply theme on load or change
//   useEffect(() => {
//     const html = document.documentElement;

//     // Remove all theme classes
//     html.classList.remove("light", "dark", "blue", "green", "orange");

//     // Add the current theme class
//     html.classList.add(theme);
//   }, [theme]);

//   return (
//     <div
//       className="min-h-screen transition-all duration-300"
//       style={{
//         backgroundColor: "var(--bg-color)",
//         color: "var(--text-color)",
//       }}
//     >
//       {/* Sidebar */}
//       <Sidebar
//         isOpen={sidebarOpen}
//         setIsOpen={setSidebarOpen}
//         toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
//       />

//       {/* Main Content */}
//       <div
//         className={`flex flex-col flex-1 transition-all duration-300 ${
//           sidebarOpen ? "md:ml-64" : "md:ml-20"
//         }`}
//       >
//         <Header
//           toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
//           theme={theme}
//           setTheme={setTheme} // Pass theme setter to Header if needed
//         />
//         <main className="flex-1 px-3 py-6 overflow-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

// import { useState, useEffect } from "react";
// import { Outlet } from "react-router-dom";
// import Header from "../components/Header/Header";
// import Sidebar from "../components/sidebar/Sidebar";
// import Themes from "../components/themes/Themes";
// import "../styles/style.css";

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

//   useEffect(() => {
//     const html = document.documentElement;
//     html.classList.remove("light", "dark", "blue", "green", "orange");
//     html.classList.add(theme);
//   }, [theme]);

//   return (
//     <div
//       className="min-h-screen transition-all duration-300"
//       style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
//     >
//       <Sidebar
//         isOpen={sidebarOpen}
//         setIsOpen={setSidebarOpen}
//         toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
//       />

//       <div
//         className={`flex flex-col flex-1 transition-all duration-300 ${
//           sidebarOpen ? "md:ml-64" : "md:ml-20"
//         }`}
//       >
//         <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
//         <div className="p-3 flex justify-end">
//           <Themes />
//         </div>
//         <main className="flex-1 px-3 py-6 overflow-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import Themes from "../components/themes/Themes";
import "../styles/style.css";
import Footer from "../components/footer/Footer";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col transition-all duration-300">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;

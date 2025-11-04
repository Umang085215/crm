// import { useState, useEffect, useRef } from "react";
// import { Check } from "lucide-react";

// const colorThemes = [
//   { name: "Light", value: "light", dark: "#fb6506", light: "#fff4e6" },
//   { name: "Dark", value: "dark", dark: "#fb6506", light: "#fff4e6" },
//   {
//     name: "Bottle Green",
//     value: "bottelGreen",
//     dark: "#007672",
//     light: "#b2f1e89c",
//   },
//   { name: "Blue", value: "blue", dark: "#2b4acb", light: "#d2e0fa" },
//   { name: "Red", value: "red", dark: "#ff0008", light: "#fff4e6" },
//   { name: "Purple", value: "purple", dark: "#642ab5", light: "#ebd7fa" },
// ];

// const Themes = () => {
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
//   const dropdownRef = useRef(null);
//   useEffect(() => {
//     const html = document.documentElement;
//     html.classList.remove(
//       "light",
//       "dark",
//       "bottelGreen",
//       "blue",
//       "red",
//       "purple"
//     );
//     html.classList.add(theme);
//     const selected = colorThemes.find((t) => t.value === theme);
//     if (selected) {
//       html.style.setProperty("--light", selected.light);
//       html.style.setProperty("--dark", selected.dark);
//     }
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const handleTheme = (themeValue) => {
//     setTheme(themeValue);
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <div className=" right-0 mt-3   border border-lightGray dark:border-darkGray rounded-xl  z-50 overflow-hidden">
//         <div className="px-4 py-3 border-b border-lightGray dark:border-darkGray">
//           <h3 className="text-sm font-semibold ">Select Theme</h3>
//           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//             Choose a color scheme for your dashboard.
//           </p>
//         </div>

//         {/* Theme Options Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
//           {colorThemes.map((c) => (
//             <button
//               key={c.value}
//               onClick={() => handleTheme(c.value)}
//               className={`relative group flex  items-center gap-4 p-2 rounded-lg border transition ${
//                 theme === c.value
//                   ? "border-[var(--dark)] bg-[var(--light)]"
//                   : "border-gray-200 dark:border-gray-700 hover:border-[var(--dark)] hover:bg-gray-50 dark:hover:bg-gray-800"
//               }`}
//             >
//               <span
//                 className="w-8 h-8 rounded-full border border-lightGray dark:border-darkGray"
//                 style={{
//                   backgroundColor: c.value === "dark" ? "black" : c.dark,
//                 }}
//               ></span>
//               <span className="text-md font-semibold text-darkGray">
//                 {c.name}
//               </span>

//               {theme === c.value && (
//                 <span className="absolute  right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow">
//                   <Check size={14} className="text-[var(--dark)]" />
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Themes;

import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
const colorThemes = [
  { name: "Light", value: "light", dark: "#3282ff", light: "#e3edff" },
  { name: "Dark", value: "dark", dark: "#2b4acb", light: "#fff4e6" },
  {
    name: "Bottle Green",
    value: "bottelGreen",
    dark: "#007672",
    light: "#b2f1e89c",
  },
  { name: "Orange", value: "orange", dark: "#fb6506", light: "#fff4e6" },
  { name: "Red", value: "red", dark: "#ff0008", light: "#fff4e6" },
  { name: "Purple", value: "purple", dark: "#642ab5", light: "#ebd7fa" },
];

const Themes = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove(
      "light",
      "dark",
      "bottelGreen",
      "orange",
      "red",
      "purple"
    );
    html.classList.add(theme);

    const selected = colorThemes.find((t) => t.value === theme);
    if (selected) {
      html.style.setProperty("--light", selected.light);
      html.style.setProperty("--dark", selected.dark);
    }

    localStorage.setItem("theme", theme);
    window.dispatchEvent(new Event("storage"));
  }, [theme]);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme && storedTheme !== theme) {
        setTheme(storedTheme);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [theme]);

  const handleTheme = (themeValue) => {
    setTheme(themeValue);
    localStorage.setItem("theme", themeValue);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="right-0 mt-3 border border-lightGray dark:border-darkGray rounded-xl z-50 overflow-hidden">
        <div className="px-4 py-3 border-b border-lightGray dark:border-darkGray">
          <h3 className="text-sm font-semibold">Select Theme</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Choose a color scheme for your dashboard.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
          {colorThemes.map((c) => (
            <button
              key={c.value}
              onClick={() => handleTheme(c.value)}
              className={`relative group flex items-center gap-4 p-2 rounded-lg border transition ${
                theme === c.value
                  ? "border-[var(--dark)] bg-[var(--light)]"
                  : "border-gray-200 dark:border-gray-700 hover:border-[var(--dark)] hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <span
                className="w-8 h-8 rounded-full border border-lightGray dark:border-darkGray"
                style={{
                  backgroundColor: c.value === "dark" ? "black" : c.dark,
                }}
              ></span>
              <span className="text-md font-semibold text-darkGray">
                {c.name}
              </span>

              {theme === c.value && (
                <span className="absolute right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow">
                  <Check size={14} className="text-[var(--dark)]" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Themes;

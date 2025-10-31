// import React, { useState, useEffect } from "react";
// import { Moon, Sun } from "lucide-react";
// import Tippy from "@tippyjs/react";

// const LightDarkMode = ({ onToggle }) => {
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
//   useEffect(() => {
//     const html = document.documentElement;
//     html.classList.remove("light", "dark");
//     html.classList.add(theme);

//     html.style.setProperty("--light", "#fff4e6");
//     html.style.setProperty("--dark", "#fb6506");

//     localStorage.setItem("theme", theme);

//     if (onToggle) onToggle(theme);
//   }, [theme, onToggle]);

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "light" ? "dark" : "light"));
//   };

//   return (
//     <Tippy
//       content={theme === "light" ? "Switch to Dark" : "Switch to Light"}
//       placement="top"
//       arrow={false}
//       animation="fade"
//       duration={100}
//       theme="custom"
//     >
//       <button
//         onClick={toggleTheme}
//         className="w-8 h-8 flex justify-center items-center rounded-full transition hover:bg-gray-200 dark:hover:bg-gray-700"
//       >
//         {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
//       </button>
//     </Tippy>
//   );
// };

// export default LightDarkMode;

import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import Tippy from "@tippyjs/react";

const LightDarkMode = ({ onToggle }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(theme);

    // ✅ Use blue accent for light theme
    if (theme === "light") {
      html.style.setProperty("--light", "#e3edff"); // light blue background tone
      html.style.setProperty("--dark", "#2b4acb"); // blue accent
    } else {
      html.style.setProperty("--light", "#fff4e6");
      html.style.setProperty("--dark", "#2b4acb"); // keep blue accent for dark too
    }

    localStorage.setItem("theme", theme);

    if (onToggle) onToggle(theme);
  }, [theme, onToggle]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Tippy
      content={theme === "light" ? "Switch to Dark" : "Switch to Light"}
      placement="top"
      arrow={false}
      animation="fade"
      duration={100}
      theme="custom"
    >
      <button
        onClick={toggleTheme}
        className="w-8 h-8 flex justify-center items-center rounded-full transition hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </Tippy>
  );
};

export default LightDarkMode;

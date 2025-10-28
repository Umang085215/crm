import { useState, useEffect } from "react";
import { ChevronDown, Settings, LayoutDashboard, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { AiOutlineDashboard } from "react-icons/ai";
import { LuUsersRound } from "react-icons/lu";
import { TbReportAnalytics } from "react-icons/tb";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { token, modules, role } = useAuth();
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const dashboardPath =
    role === "superadmin" ? "/admin/super-dashboard" : "/dashboard";

  const navItems = [
    {
      module: "dashboard",
      path: dashboardPath,
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },

    {
      module: "users",
      path: "/admin/users",
      label: "Users",
      icon: <LuUsersRound size={18} />,
    },
    {
      module: "roles",
      path: "/admin/roles",
      label: "Roles",
      icon: <AiOutlineDashboard size={18} />,
    },
    {
      module: "reports",
      path: "/admin/reports",
      label: "Reports",
      icon: <TbReportAnalytics size={18} />,
      submodules: [
        {
          module: "HR",
          path: "/admin/reports/hr",
          label: "HR",
          icon: <AiOutlineDashboard size={16} />,
        },
        {
          module: "BDE",
          path: "/admin/reports/bde",
          label: "BDE",
          icon: <AiOutlineDashboard size={16} />,
        },
        {
          module: "Sales",
          path: "/admin/reports/sales",
          label: "Sales",
          icon: <AiOutlineDashboard size={16} />,
        },
      ],
    },
    {
      module: "Profile",
      path: "/admin/profile",
      label: "Profile",
      icon: <TbReportAnalytics size={18} />,
      submodules: [
        {
          module: "Profile Submission",
          path: "/admin/profile-add",
          label: "Add",
          icon: <AiOutlineDashboard size={16} />,
        },
      ],
    },

    {
      module: "settings",
      path: "/admin/settings",
      label: "Settings",
      icon: <Settings size={18} />,
    },
  ];

  const hasAccess = (moduleName) => {
    if (role === "superadmin") return true;
    return modules.some((m) => m.name === moduleName);
  };

  const hasSubmoduleAccess = (parent, submodule) => {
    if (role === "superadmin") return true;
    const parentModule = modules.find((m) => m.name === parent);
    return parentModule?.submodules?.some((s) => s.name === submodule);
  };

  const toggleDropdown = (moduleName) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  const isParentActive = (item) => {
    if (!item.submodules) return location.pathname === item.path;
    return (
      location.pathname === item.path ||
      item.submodules.some((sub) => location.pathname === sub.path)
    );
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth < 768 && isOpen) {
        const sidebar = document.getElementById("app-sidebar");
        if (sidebar && !sidebar.contains(e.target)) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-darkBg border-r-none sm:border-r border-lightGray dark:border-darkGray shadow-sm z-50 transition-all duration-300 transform 
        ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"} 
        md:translate-x-0 ${isOpen ? "md:w-64" : "md:w-20"} flex flex-col`}
      >
        {/* Header */}
        <div className="px-4 py-4 flex items-center justify-between border-b border-lightGray dark:border-darkGray flex-shrink-0">
          {isOpen ? (
            <div className="w-full flex items-center justify-between p-0 sm:p-0.5">
              <h5 className="text-lg font-bold flex items-center gap-1 truncate text-dark dark:text-white">
                🤗 <span className="font-extrabold">Elevva CRM</span>
              </h5>

              <button
                className="sm:hidden text-gray-600 dark:text-gray-300   p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex justify-center items-center w-full p-0 sm:p-0.5">
              <span className="text-lg font-bold text-dark dark:text-white">
                🤗
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ul className="flex-1 overflow-y-auto py-2">
          {navItems.map((item) => {
            if (!hasAccess(item.module)) return null;
            const isActive = isParentActive(item);

            return (
              <li key={item.module} className="pr-2 mb-1">
                {!item.submodules ? (
                  <Link
                    to={item.path}
                    onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                    className={`sidebar-link flex items-center px-4 py-2 ${
                      isOpen ? "justify-between" : "justify-center"
                    } ${isActive ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-5">
                      <span className="w-7 h-7 flex justify-center items-center bg-dark text-light rounded-full">
                        {item.icon}
                      </span>
                      {isOpen && <span>{item.label}</span>}
                    </div>
                  </Link>
                ) : (
                  <div>
                    <button
                      onClick={() => {
                        toggleDropdown(item.module);
                        setIsOpen(true);
                      }}
                      className={`flex items-center w-full px-4 py-2 rounded-tr-[10px] rounded-br-[10px] transition sidebar-link ${
                        isOpen ? "justify-between" : "justify-center"
                      } ${isActive ? "active" : ""}`}
                    >
                      <div className="flex items-center gap-5">
                        <span className="w-7 h-7 flex justify-center items-center bg-dark text-light rounded-full">
                          {item.icon}
                        </span>
                        {isOpen && <span>{item.label}</span>}
                      </div>
                      {isOpen && <ChevronDown size={18} />}
                    </button>

                    {isOpen && openDropdowns[item.module] && (
                      <ul className="mt-1">
                        {item.submodules.map((sub) => {
                          const isActiveSubMenu =
                            location.pathname === sub.path;
                          return (
                            hasSubmoduleAccess(item.module, sub.module) && (
                              <li key={sub.module}>
                                <Link
                                  to={sub.path}
                                  onClick={() =>
                                    window.innerWidth < 768 && setIsOpen(false)
                                  }
                                  className={`sidebar-link block mt-1 px-4 py-2 pl-12 rounded-tr-[10px] rounded-br-[10px] transition ${
                                    isActiveSubMenu ? "active" : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-5">
                                    <span className="w-6 h-6 flex justify-center items-center bg-dark text-light rounded-full">
                                      {sub.icon}
                                    </span>
                                    {isOpen && <span>{sub.label}</span>}
                                  </div>
                                </Link>
                              </li>
                            )
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div
          className={`flex-shrink-0 w-full px-5 py-3 text-center ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div>
            <h3 className="text-xl font-bold">ELEVVA</h3>
            <p className="text-[10px] font-bold">
              Powered by Ecodedash, &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

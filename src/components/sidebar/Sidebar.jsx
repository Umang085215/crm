import { useState, useEffect } from "react";
import { ChevronDown, Settings, LayoutDashboard, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { AiOutlineDashboard } from "react-icons/ai";
import { TbReportAnalytics } from "react-icons/tb";
import logo from "../../assets/adminImages/logo/logo.png";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { token, modules, role } = useAuth();
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const dashboardPath =
    role === "superadmin" ? "/admin/super-dashboard" : "/dashboard";

  // 👇 Updated navigation layout
  const navSections = [
    {
      section: "MAIN MENU",
      items: [
        {
          module: "Dashboard",
          path: dashboardPath,
          label: "Dashboard",
          icon: <LayoutDashboard size={16} />,
        },
      ],
    },
    {
      section: "USER MANAGEMENT",
      items: [
        {
          module: "Users",
          path: "/admin/usermanagement/users",
          label: "Manage Users",
          icon: <AiOutlineDashboard size={16} />,
        },
        {
          module: "Roles",
          path: "/admin/usermanagement/roles",
          label: "Roles & Permission",
          icon: <AiOutlineDashboard size={16} />,
        },
      ],
    },
    {
      section: "REPORTS",
      items: [
        {
          module: "Reports",
          path: "/admin/reports",
          label: "Reports",
          icon: <TbReportAnalytics size={16} />,
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
      ],
    },
    {
      section: "Profiles",
      items: [
        {
          module: "Profile",
          path: "/admin/profile",
          label: "Profile",
          icon: <TbReportAnalytics size={16} />,
          submodules: [
            {
              module: "Profile Submission",
              path: "/admin/profile-add",
              label: "Add",
              icon: <AiOutlineDashboard size={16} />,
            },
          ],
        },
      ],
    },
    {
      items: [
        {
          module: "settings",
          path: "/admin/settings",
          label: "Settings",
          icon: <Settings size={16} />,
        },
      ],
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
              <div className="text-lg font-bold flex items-center gap-1 truncate text-dark dark:text-white">
                <img src={logo} alt="" className="w-7" />
                <span className="font-extrabold">Elevva CRM</span>
              </div>

              <button
                className="sm:hidden text-gray-600 dark:text-gray-300 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex justify-center items-center w-full p-0 sm:p-0.5">
              <span className="text-lg font-bold text-dark dark:text-white">
                <img src={logo} alt="logo" className="w-7" />
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ul className="flex-1 overflow-y-auto py-3 space-y-2">
          {navSections.map((section) => (
            <div key={section.section}>
              {isOpen && section.section && (
                <h4 className="px-4 pb-2 text-[12px] font-extrabold text-gray-500 uppercase tracking-wide sticky top-0 bg-white dark:bg-darkBg z-10">
                  {section.section}
                </h4>
              )}

              {section.items.map((item) => {
                if (!hasAccess(item.module)) return null;
                const isActive = isParentActive(item);

                return (
                  <li key={item.module} className="pr-2">
                    {!item.submodules ? (
                      <Link
                        to={item.path}
                        onClick={() =>
                          window.innerWidth < 768 && setIsOpen(false)
                        }
                        className={`sidebar-link flex items-center px-4 py-1 ${
                          isOpen ? "justify-between" : "justify-center"
                        } ${isActive ? "active" : ""}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-7 h-7 flex justify-center items-center bg-dark text-light rounded-full">
                            {item.icon}
                          </span>
                          {isOpen && (
                            <span className="font-bold text-[13px]">
                              {item.label}
                            </span>
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div>
                        <button
                          onClick={() => {
                            toggleDropdown(item.module);
                            setIsOpen(true);
                          }}
                          className={`flex items-center w-full px-4 py-1 rounded-tr-[10px] rounded-br-[10px] transition sidebar-link ${
                            isOpen ? "justify-between" : "justify-center"
                          } ${isActive ? "active" : ""}`}
                        >
                          <div className="flex items-center gap-5">
                            <span className="w-7 h-7 flex justify-center items-center bg-dark text-light rounded-full">
                              {item.icon}
                            </span>
                            {isOpen && (
                              <span className="font-bold text-[13px]">
                                {item.label}
                              </span>
                            )}
                          </div>
                          {isOpen && (
                            <ChevronDown
                              size={16}
                              className={`transform transition-transform duration-200 ${
                                openDropdowns[item.module] ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </button>

                        {isOpen && openDropdowns[item.module] && (
                          <ul className=" pl-12 py-1 space-y-1">
                            {item.submodules.map((sub) => {
                              const isActiveSubMenu =
                                location.pathname === sub.path;
                              return (
                                hasSubmoduleAccess(item.module, sub.module) && (
                                  <li key={sub.module}>
                                    <Link
                                      to={sub.path}
                                      onClick={() =>
                                        window.innerWidth < 768 &&
                                        setIsOpen(false)
                                      }
                                      className={`sidebar-link flex items-center gap-1 px-2 py-1 font-bold rounded-md transition ${
                                        isActiveSubMenu ? "active" : ""
                                      }`}
                                    >
                                      <span className="w-6 h-6 flex justify-center items-center bg-dark text-light rounded-full">
                                        {sub.icon}
                                      </span>
                                      {sub.label}
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
            </div>
          ))}
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

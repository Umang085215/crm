import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Settings, LogOut, Bell, CircleHelp, User } from "lucide-react";
import { FaRegUser } from "react-icons/fa";
import LightDarkMode from "../themes/LightDarkMode";
import Tippy from "@tippyjs/react";

const IconButton = ({ title, icon: Icon, badge }) => (
  <Tippy
    content={title}
    placement="top"
    arrow={false}
    animation="fade"
    duration={100}
    theme="custom"
  >
    <div className="relative w-8 h-8 flex justify-center items-center rounded-full transition hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
      <Icon size={20} />
      {badge && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-gray-800">
          {badge}
        </span>
      )}
    </div>
  </Tippy>
);

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { icon: FaRegUser, text: "Profile", path: "/admin/profile" },
    {
      icon: Settings,
      text: "Account Settings",
      path: "/admin/account-settings",
    },
    { icon: Bell, text: "Notifications", path: "/admin/notifications" },
    { icon: Settings, text: "Settings", path: "/admin/settings" },
    { icon: CircleHelp, text: "Help Center", path: "/admin/help" },
  ];

  return (
    <header className="sticky top-0 z-40 flex items-center bg-white dark:bg-darkBg justify-between px-6 py-3 border-b border-lightGray dark:border-darkGray">
      {/* Left */}
      <div className="flex gap-5 items-center text-md font-medium">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <Menu size={20} />
        </button>
        <span className="hidden sm:block">Welcome to Elevva Anuj</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 relative" ref={popupRef}>
        <IconButton title="Notification" icon={Bell} badge={1} />
        <div className="h-6 w-[1px] bg-lightGray dark:bg-darkGray" />
        <LightDarkMode />
        <div className="h-6 w-[1px] bg-lightGray dark:bg-darkGray" />

        {/* Profile */}
        <div
          className="flex gap-3 items-center cursor-pointer"
          onClick={() => setPopupOpen((prev) => !prev)}
        >
          <div className="h-8 w-8 flex justify-center items-center text-dark border border-lightGray dark:border-darkGray rounded-md">
            <User size={20} />
          </div>
          <div className="hidden md:block">
            <h4 className="text-dark font-bold mb-0.5">Anuj Yadav</h4>
            <p className="text-xs text-darkGray dark:text-white">Developer</p>
          </div>
        </div>

        {/* Popup */}
        {popupOpen && (
          <div className="absolute right-0 top-full mt-3 w-72 px-6 py-6 font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            <div className="flex flex-col items-center space-y-2">
              <p className="w-10 h-10 flex justify-center items-center text-white text-lg font-bold bg-dark border border-lightGray dark:border-darkGray rounded-full">
                A
              </p>
              <p className="text-xl font-extrabold text-darkGray dark:text-lightGray">
                Anuj Yadav
              </p>
              <p className="text-xs text-darkGray dark:text-lightGray">
                anuj@gmail.com
              </p>
              <button className="px-4 py-1 bg-lightGray dark:bg-darkGray border border-darkGray dark:border-lightGray rounded-lg">
                Manage your account
              </button>
            </div>
            <hr className="my-2 border-lightGray dark:border-darkGray" />
            <ul className="flex flex-col space-y-1">
              {menuItems.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setPopupOpen(false);
                    }}
                    className="w-full flex gap-5 items-center px-3 py-2 text-left hover:bg-lightGray dark:hover:bg-darkGray transition rounded-md"
                  >
                    <item.icon size={18} />
                    <p className="text-sm">{item.text}</p>
                  </button>
                </li>
              ))}
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full font-bold flex gap-3 items-center px-3 py-2 text-left text-red-500 hover:bg-red-100 dark:hover:bg-red-700/40 transition rounded-md"
                >
                  <LogOut size={18} />
                  <p className="text-sm">Logout</p>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

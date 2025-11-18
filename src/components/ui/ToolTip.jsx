import React from "react";
import Tippy from "@tippyjs/react";
const ToolTip = ({ title, icon, badge, placement }) => (
  <Tippy
    content={title}
    placement={placement}
    arrow={false}
    animation="fade"
    duration={100}
    theme="custom"
  >
    <div className="relative  flex justify-center items-center px-2 py-1.5 bg-[#4b5563] text-white text-sm rounded-md cursor-pointer">
      {icon}
      {badge && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-gray-800">
          {badge}
        </span>
      )}
    </div>
  </Tippy>
);

export default ToolTip;

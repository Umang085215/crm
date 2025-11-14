import React from "react";

const ViewSection = ({ title, icon, children }) => (
  <section className="border border-gray-300 dark:border-gray-600 rounded-lg p-5 bg-white dark:bg-gray-800 transition">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2">
      {icon && <span className=" dark:text-white">{icon}</span>}
      {title}
    </h3>
    {children}
  </section>
);
export default ViewSection;

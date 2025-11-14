import React from "react";

const ViewInfo = ({ icon, label, value }) => (
  <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
    {icon && (
      <span className="mt-0.5 text-gray-500 dark:text-gray-400">{icon}</span>
    )}
    <p>
      <span className="font-medium">{label}:</span> {value || "-"}
    </p>
  </div>
);

export default ViewInfo;

import React from "react";
import { motion } from "framer-motion";

const Spinner = ({ size = 40, color = "#3b82f6", text }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-4">
      <motion.div
        className="rounded-full border-4 border-t-transparent"
        style={{
          width: size,
          height: size,
          borderColor: color,
          borderTopColor: "transparent",
        }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: "linear",
        }}
      />
      {text && (
        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Spinner;

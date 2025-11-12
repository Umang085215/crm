import React from "react";
const Input = ({
  type = "text",
  id,
  value,
  name,
  handleChange,
  errors = {},
  labelName,
  className = "",
  icon = null,
}) => {
  const hasError = errors[name];

  return (
    <div className={className}>
      <div className="relative w-full">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder=" "
          className={`block w-full text-sm bg-transparent rounded-md appearance-none focus:outline-none peer transition border p-[14px] 
            ${icon ? "pr-10" : ""}  
            ${
              hasError
                ? "border-red-500"
                : "border-lightGray dark:border-darkGray focus:border-black"
            }
            dark:text-white`}
        />

        {/* Floating label */}
        <label
          htmlFor={id}
          className={`absolute pointer-events-none font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
            ${
              hasError
                ? "peer-focus:text-red-500"
                : "peer-focus:text-darkBg dark:peer-focus:text-white"
            }
            rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
        >
          {labelName}
        </label>

        {/* Optional right-side icon */}
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
            {icon}
          </span>
        )}
      </div>

      {hasError && <p className="text-red-500 text-sm mt-1">{hasError}</p>}
    </div>
  );
};

export default Input;

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
          className={`block p-[14px]  w-full text-sm bg-transparent rounded-md  appearance-none focus:outline-none peer transition border 
            ${
              hasError
                ? "border-red-500 "
                : " border-lightGray dark:border-darkGray focus:border-black"
            } 
             dark:text-white`}
        />
        <label
          htmlFor={id}
          className={`absolute pointer-events-none font-bold text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
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
      </div>
      {hasError && <p className="text-red-500 text-sm mt-1">{hasError}</p>}
    </div>
  );
};

export default Input;

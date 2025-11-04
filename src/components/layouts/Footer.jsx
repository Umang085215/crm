import React from "react";

const Footer = () => {
  return (
    <>
      <footer className=" w-full flex justify-between items-center bg-white dark:bg-darkBg text-center text-sm px-4 sm:px-6 py-4 mt-auto border-t border-gray-300 dark:border-gray-700 shadow">
        <div>
          &copy; {new Date().getFullYear()} Elevva CRM . All rights reserved
        </div>
        <div className="flex gap-2 items-center font-semibold">
          <p>Powered by</p>
          <a href="https://www.ecodedash.com/" className="text-blue-700">
            Ecode Dash
          </a>
        </div>
      </footer>
    </>
  );
};

export default Footer;

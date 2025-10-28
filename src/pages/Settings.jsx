import React, { useState } from "react";
import Themes from "../components/themes/Themes";
import GeneralSettings from "../components/userManagement/GeneralSettings";
import EmailSettings from "../components/userManagement/EmailSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("General");
  const tabs = ["General", "Themes", "Email"];

  return (
    <div className=" ">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      {/* Tabs */}
      <div className="mb-6 border-b border-lightGray dark:border-darkGray flex gap-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2  whitespace-nowrap ${
              activeTab === tab
                ? "text-dark font-bold border-b-2 border-dark"
                : "text-gray-500 hover:text-dark"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="">
        {activeTab === "General" && <GeneralSettings />}

        {activeTab === "Themes" && <Themes />}

        {activeTab === "Email" && <EmailSettings />}
      </div>
    </div>
  );
};

export default Settings;

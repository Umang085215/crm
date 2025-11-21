export default function FiltersBar({
  search,
  onSearchChange,
  tabs = [],
  activeTab,
  onTabChange,
}) {
  return (
    <div className="flex justify-between items-center mb-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border px-3 py-2 rounded-md w-64 dark:bg-darkBg dark:text-white"
      />

      {/* Status Tabs */}
      <div className="flex gap-3">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => onTabChange(t.value)}
            className={`px-4 py-1.5 rounded-full border ${
              activeTab === t.value
                ? "bg-blue-600 text-white"
                : "dark:bg-darkBg dark:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

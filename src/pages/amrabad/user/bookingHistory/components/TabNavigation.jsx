const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-200 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
            ? "border-black text-black"
            : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
import React from "react";

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-neutral-200 overflow-x-auto scrollbar-hide">
      <nav className="flex gap-1 min-w-max md:min-w-0" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-4 py-3 text-sm font-medium whitespace-nowrap
              border-b-2 transition-colors
              ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-secondary hover:text-neutral-primary hover:border-neutral-300"
              }
            `}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

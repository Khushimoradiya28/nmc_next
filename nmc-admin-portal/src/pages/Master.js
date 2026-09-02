import React, { useState, useMemo } from "react";
import PageTitle from "../components/Typography/PageTitle";
import CardItem from "../components/dashboard/MasterCardItem";
import { NavLink } from "react-router-dom";
import {
  FiAward,
  FiSearch,
  FiUploadCloud,
  FiTrendingUp,
} from "react-icons/fi";

// Config-driven list of master modules shown as cards on the Master hub.
// To add a new master, just push an entry here (title, path, Icon).
const MASTER_ITEMS = [
  { title: "Gold Medalist Achievers", path: "/master/gold-medalists", Icon: FiAward },
  { title: "Gold Medalist Bulk Import", path: "/master/gold-medalists/bulk-import", Icon: FiUploadCloud },
  { title: "University Rankers", path: "/master/rankers", Icon: FiTrendingUp },
  { title: "Rankers Bulk Import", path: "/master/rankers/bulk-import", Icon: FiUploadCloud },
];

const Masters = () => {
  const [searchText, setSearchText] = useState("");

  const filteredItems = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return MASTER_ITEMS;
    return MASTER_ITEMS.filter((item) => item.title.toLowerCase().includes(q));
  }, [searchText]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-6">
        <div>
          <PageTitle>Masters</PageTitle>
          <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
            Manage all master data modules from one place.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search masters..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-800 dark:text-gray-200 transition-colors"
          />
          <FiSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <NavLink key={item.path} to={item.path}>
              <CardItem
                title={item.title}
                Icon={item.Icon}
                className="text-red-800 dark:text-red-100 bg-red-100 dark:bg-red-800"
              />
            </NavLink>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-gray-500 dark:text-gray-400 text-sm">
          No master modules match "{searchText}".
        </div>
      )}
    </>
  );
};

export default Masters;

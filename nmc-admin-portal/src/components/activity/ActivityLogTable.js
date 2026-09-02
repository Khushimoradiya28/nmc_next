import React from "react";
import { TableBody, TableRow, TableCell, Badge } from "@windmill/react-ui";

const ActivityLogTable = ({
  logs,
  currentPage = 1,
  resultsPerPage = 20,
  totalResults = 0,
  sortOrder = "desc",
}) => {
  const getActionBadge = (action) => {
    switch (action?.toUpperCase()) {
      case "CREATE":
        return <Badge type="success">CREATE</Badge>;
      case "UPDATE":
        return <Badge type="warning">UPDATE</Badge>;
      case "DELETE":
        return <Badge type="danger">DELETE</Badge>;
      case "LOGIN":
        return <Badge type="primary">LOGIN</Badge>;
      default:
        return <Badge>{action || "N/A"}</Badge>;
    }
  };

  const getRoleBadge = (role) => {
    const r = role ? role.toLowerCase() : "";
    if (r === "super_admin") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          Super Admin
        </span>
      );
    }
    if (r === "admin") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          Admin
        </span>
      );
    }
    if (r === "department") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
          Department
        </span>
      );
    }
    if (r === "content") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
          Content
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
        {role || "User"}
      </span>
    );
  };

  return (
    <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
      {logs?.map((item, index) => {
        // Dynamic sequence number respecting ASC / DESC sort order
        const srNo =
          sortOrder === "asc"
            ? (currentPage - 1) * resultsPerPage + index + 1
            : Math.max(1, (totalResults || logs.length) - ((currentPage - 1) * resultsPerPage + index));
        return (
          <TableRow key={item._id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <TableCell className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {srNo}
            </TableCell>

            {/* Date & Time */}
            <TableCell className="text-xs text-gray-700 dark:text-gray-300 font-mono whitespace-nowrap">
              {item.created_at || "—"}
            </TableCell>

            {/* User Details */}
            <TableCell>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                  {item.user_name || "System"}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {item.user_email || "—"}
                </span>
              </div>
            </TableCell>

            {/* Role */}
            <TableCell>
              {getRoleBadge(item.role_name)}
            </TableCell>

            {/* Action */}
            <TableCell>
              {getActionBadge(item.action)}
            </TableCell>

            {/* Module */}
            <TableCell>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 capitalize">
                {item.module || "General"}
              </span>
            </TableCell>

            {/* Description */}
            <TableCell className="max-w-xs">
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2" title={item.description}>
                {item.description || item.record_title || "—"}
              </p>
            </TableCell>

            {/* IP Address */}
            <TableCell className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {item.ip_address || "—"}
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default ActivityLogTable;

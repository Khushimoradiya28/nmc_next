import React from "react";
import PageTitle from "../components/Typography/PageTitle";
import CardItem from "../components/dashboard/MasterCardItem";
import { NavLink } from "react-router-dom";
import { FiUser, FiAward } from "react-icons/fi";

const Masters = () => {
  return (
    <>
      <PageTitle>Masters</PageTitle>

      <div className="grid gap-6 md:grid-cols-4 xl:grid-cols-6">
        <NavLink to="/master/user">
          <CardItem
            title="Users"
            Icon={FiUser}
            className="text-red-800 dark:text-red-100 bg-red-100 dark:bg-red-800"
          />
        </NavLink>
        <NavLink to="/master/faculty">
          <CardItem
            title="Professors & Faculty"
            Icon={FiAward}
            className="text-red-800 dark:text-red-100 bg-red-100 dark:bg-red-800"
          />
        </NavLink>
      </div>
    </>
  );
};

export default Masters;

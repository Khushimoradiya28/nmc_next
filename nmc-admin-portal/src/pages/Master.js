import React, { useContext, useEffect } from "react";
import { CSVDownloader } from "react-papaparse";
import { Card, CardBody } from "@windmill/react-ui";

import PageTitle from "../components/Typography/PageTitle";
import CardItem from "../components/dashboard/MasterCardItem";
import { NavLink } from "react-router-dom";
import {
  FiUser,
  FiUserX,
  FiInstagram,
  FiCornerDownLeft,
  FiCopy,
  FiCommand,
  FiTruck,
  FiUserCheck,
  FiAtSign,
  FiCrop,
} from "react-icons/fi";

const Masters = () => {
  return (
    <>
      <PageTitle>Masters</PageTitle>

      <div className="grid gap-6 md:grid-cols-4 xl:grid-cols-6">
        <NavLink to="/master/age">
          <CardItem
            title="Age Group"
            Icon={FiAtSign}
            className="text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500"
          />
        </NavLink>
        <NavLink to="/master/brand">
          <CardItem
            title="Brand"
            Icon={FiTruck}
            className="text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500"
          />
        </NavLink>
        <NavLink to="/master/category">
          <CardItem
            title="Categories"
            Icon={FiCornerDownLeft}
            className="text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500"
          />
        </NavLink>
        <NavLink to="/master/color">
          <CardItem
            title="Colors"
            Icon={FiCopy}
            className="text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500"
          />
        </NavLink>
        <NavLink to="/master/commodity">
          <CardItem
            title="Commodities"
            Icon={FiCornerDownLeft}
            className="text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500"
          />
        </NavLink>
        <NavLink to="/master/character">
          <CardItem
            title="Character"
            Icon={FiUserCheck}
            className="text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500"
          />
        </NavLink>
        <NavLink to="/master/material">
          <CardItem
            title="Material"
            Icon={FiCommand}
            className="text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500"
          />
        </NavLink>

        <NavLink to="/master/skill">
          <CardItem
            title="Skills"
            Icon={FiCrop}
            className="text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500"
          />
        </NavLink>
        <NavLink to="/master/tag">
          <CardItem
            title="Tag"
            Icon={FiInstagram}
            className="text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500"
          />
        </NavLink>
        <NavLink to="/master/user">
          <CardItem
            title="Users"
            Icon={FiUser}
            className="text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500"
          />
        </NavLink>
        <NavLink to="/master/userrole">
          <CardItem
            title="Users Role"
            Icon={FiUserX}
            className="text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500"
          />
        </NavLink>
      </div>
    </>
  );
};

export default Masters;

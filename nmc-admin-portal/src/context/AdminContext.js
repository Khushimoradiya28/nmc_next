import Cookies from 'js-cookie';
import React, { createContext, useReducer } from 'react';

export const AdminContext = createContext();

const initialState = {
  adminInfo: Cookies.get("adminInfo")
    ? JSON.parse(Cookies.get("adminInfo"))
    : null,
  adminToken: Cookies.get("adminToken") || null,
  adminUserId: Cookies.get("adminUserId") || null,
};

function reducer(state, action) {
  switch (action.type) {
    case "USER_LOGIN":
      return {
        ...state,
        adminInfo: action.payload,
        adminToken: action.payload.token,
        adminUserId: action.payload._id,
      };

    case "USER_LOGOUT":
      Cookies.remove("adminInfo");
      Cookies.remove("adminToken");
      Cookies.remove("adminUserId");
      return {
        adminInfo: null,
        adminToken: null,
        adminUserId: null,
      };

    default:
      return state;
  }
}

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AdminContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminContext.Provider>
  );
};
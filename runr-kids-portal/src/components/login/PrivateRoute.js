import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';


const PrivateRoute = ({ children, ...rest }) => {
  const { state } = useContext(AdminContext);
  const { adminInfo, adminToken } = state;

  return (
    <Route
      {...rest}
      render={({ location }) =>
        adminInfo && adminToken ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};


export default PrivateRoute;
import { useJumboApp } from "@jumbo/hooks";
import React from "react";
import { Navigate } from "react-router-dom";
import { config } from "./config/main";

function ProtectedRoute({ component, layout, ...restProps }) {
  const isAuthenticated = localStorage.getItem("accesstoken"); // Check if the user is authenticated
  const { activeLayout, setActiveLayout } = useJumboApp();

  React.useEffect(() => {
    if (layout !== activeLayout) {
      setActiveLayout(layout);
    }
  }, [layout]);

  const PageComponent = component;

  // if (isAuthenticated) {
    return <PageComponent {...restProps} />;
  // } else {
  //   return <Navigate to="/" />;
  // }
}

ProtectedRoute.defaultProps = {
  layout: config.defaultLayout,
};

export default ProtectedRoute;

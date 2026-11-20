// import {useRoutes} from "react-router-dom";
// import {buildRoutes} from "@jumbo/utils";
// import useJumboApp from "@jumbo/hooks/useJumboApp";

// let generatedRoutes = [];

// const useJumboRoutes = (routes) => {
//     const logintoken = localStorage.getItem("accesstoken");
//     const {rebuildRoutes} = useJumboApp();

//     if(rebuildRoutes) {
//         generatedRoutes = buildRoutes([...routes]);
//     }
//     return useRoutes(generatedRoutes);
// };

// export default useJumboRoutes;

import { useRoutes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useJumboApp from "@jumbo/hooks/useJumboApp";
import { buildRoutes } from "@jumbo/utils";

const useJumboRoutes = (routes) => {
  const logintoken = localStorage.getItem("accesstoken");
  const { rebuildRoutes } = useJumboApp();
  const [generatedRoutes, setGeneratedRoutes] = useState([]);

  useEffect(() => {
    const buildFilteredRoutes = () => {
      const filteredRoutes = routes.map((route) => {
        // if (route.path === "/" || logintoken) {
          return route;
        // } else {
        //   return { ...route, element: <Navigate to="/" /> };
        // }
      });
      setGeneratedRoutes(buildRoutes(filteredRoutes));
    };

    buildFilteredRoutes();

    // If rebuildRoutes changes, rebuild the routes
    if (rebuildRoutes) {
      buildFilteredRoutes();
    }
  }, [rebuildRoutes, logintoken, routes]);

  return useRoutes(generatedRoutes);
};

export default useJumboRoutes;

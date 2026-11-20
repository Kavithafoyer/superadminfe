import React, { Suspense, useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import JumboVerticalNavbar from "@jumbo/components/JumboVerticalNavbar/JumboVerticalNavbar";
import JumboAdminVerticalNavbar from "@jumbo/components/JumboVerticalNavbar/JumboAdminVerticalNavbar";
import { DrawerHeader } from "@jumbo/components/JumboLayout/style";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import useJumboLayoutSidebar from "@jumbo/hooks/useJumboLayoutSidebar";
import useJumboSidebarTheme from "@jumbo/hooks/useJumboSidebarTheme";
import { SIDEBAR_STYLES, SIDEBAR_VIEWS } from "@jumbo/utils/constants/layout";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Zoom from "@mui/material/Zoom";
import Div from "@jumbo/shared/Div";
import SidebarSkeleton from "./SidebarSkeleton";
import homemenu from "./homemenu";
import adminsidenavmenu from "./adminsidenavmenu";
// import settingmenus from './settingmenu';
import Logo from "app/shared/Logo";
// import adminhomemenu from "./user-admin-sidebars/homemenu";
// import lookupmenu from "./user-admin-sidebars/lookupmenu";
// import mailmenu from "./user-admin-sidebars/mailmenu";
// import taskmanagementmenus from "./user-admin-sidebars/taskmanagementmenu";
// import requestmenus from "./user-admin-sidebars/requestmenus";
// import ticketmenu from "./user-admin-sidebars/ticketmenus";
// import settingmenus from "./user-admin-sidebars/settingmenu";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserRolePermissions,
  selectUserRolePermissions,
} from "app/redux/actions/fetchUserRolePermissions";
import navConfig from "./adminsidenavmenu";
import "./menus.css";
// import requestmenus from './requestmenus';

const Sidebar = (
  sidebarOptions,
  showRequestMenus,
  showTicketMenus,
  showMailMenus,
  showTicketManagementMenus,
  showTaskManagementMenus,
  showLookupMenus,
  showRenewalMenus,
  showSettingMenus
) => {
  //  const Useradmin=localStorage.getItem("UserType");
  const type = localStorage.getItem("UserType");

  const dispatch = useDispatch();
  const { userRolePermissions, formPermissions, modulePermissions } =
    useSelector(selectUserRolePermissions);


  useEffect(() => {
    dispatch(fetchUserRolePermissions());
  }, [dispatch]);

  // let formPermissions = [11];
  // let modulePermissions = [26, 27];

  // const getFilteredMenus = (menus) => {
  //   return menus?.map(menu => {
  //     console.log("Processing menu:", menu.label);

  //     const permissions = (menu.type === 'collapsible') ? modulePermissions : formPermissions;

  //     if (menu.type === 'collapsible') {
  //       const filteredChildren = menu.children?.map(child => {
  //         if (child.type === 'nav-item' && (child.id === null || permissions?.includes(child.id))) {
  //           return { ...child }; // Include nav-item if it matches permissions or id is null
  //         } else if (child.type === 'collapsible') {
  //           const filteredNestedChildren = getFilteredMenus(child.children, formPermissions, modulePermissions);
  //           if (filteredNestedChildren.length > 0) {
  //             return { ...child, children: filteredNestedChildren }; // Include collapsible with filtered children
  //           }
  //         }
  //         return null; // Exclude the child if it doesn't match criteria
  //       }).filter(child => child !== null) || [];

  //       if (filteredChildren.length > 0) {
  //         return {
  //           ...menu,
  //           children: filteredChildren,
  //         }; // Include collapsible menu if it has filtered children
  //       }
  //     } else if (menu.type === 'nav-item' && (menu.id === null || permissions?.includes(menu.id))) {
  //       return { ...menu }; // Include nav-item if it matches permissions or id is null
  //     }
  //     return null; // Exclude the menu if it doesn't match criteria
  //   }).filter(menu => menu !== null); // Remove null entries
  // };

  // const getFilteredMenus = (menus) => {
  //   return menus?.map(menu => {
  //     console.log("Processing menu:", menu.label);

  //     const permissions = (menu.type === 'collapsible') ? modulePermissions : formPermissions;
  //     console.log("Permissions:", permissions);

  //     if (menu.type === 'collapsible') {
  //       const filteredChildren = menu.children?.map(child => {
  //         console.log("Processing child:", child.label, "with ID:", child.id);
  //         if (child.type === 'nav-item' || child.type === 'set' && (child.id === null || permissions?.includes(child.id))) {
  //           console.log("Including nav-item child:", child.label);
  //           return { ...child }; // Include nav-item if it matches permissions or id is null
  //         } else if (child.type === 'collapsible') {
  //           const filteredNestedChildren = getFilteredMenus(child.children, formPermissions, modulePermissions);
  //           if (filteredNestedChildren.length > 0) {
  //             console.log("Including collapsible child with filtered children:", child.label);
  //             return { ...child, children: filteredNestedChildren }; // Include collapsible with filtered children
  //           }
  //         }
  //         console.log("Excluding child:", child.label);
  //         return null; // Exclude the child if it doesn't match criteria
  //       }).filter(child => child !== null) || [];

  //       if (filteredChildren.length > 0) {
  //         console.log("Including collapsible menu:", menu.label);
  //         return {
  //           ...menu,
  //           children: filteredChildren,
  //         }; // Include collapsible menu if it has filtered children
  //       }
  //     } else if (menu.type === 'nav-item' || menu.type === 'set' && (menu.id === null || permissions?.includes(menu.id))) {
  //       console.log("Including nav-item menu:", menu.label);
  //       return { ...menu }; // Include nav-item if it matches permissions or id is null
  //     }
  //     console.log("Excluding menu:", menu.label);
  //     return null; // Exclude the menu if it doesn't match criteria
  //   }).filter(menu => menu !== null); // Remove null entries
  // };

  const getFilteredMenus = (menus) => {
    return menus
      ?.map((menu) => {
        console.log("Processing menu:", menu.title);

        const permissions =
          menu.type === "collapsible" ? modulePermissions : formPermissions;
        console.log("Permissions:", permissions);

        if (menu.type === "collapsible") {
          const filteredChildren =
            menu.children
              ?.map((child) => {
                console.log(
                  "Processing child:",
                  child.title,
                  "with ID:",
                  child.id
                );
                if (
                  child.type === "nav-item" &&
                  (child.id === null || formPermissions?.includes(child.id))
                ) {
                  console.log("Including nav-item child:", child.title);
                  return { ...child }; // Include nav-item if it matches permissions or id is null
                } else if (child.type === "collapsible") {
                  const filteredNestedChildren = getFilteredMenus(
                    child.children
                  );
                  if (filteredNestedChildren.length > 0) {
                    console.log(
                      "Including collapsible child with filtered children:",
                      child.title
                    );
                    return { ...child, children: filteredNestedChildren }; // Include collapsible with filtered children
                  }
                }
                console.log("Excluding child:", child.title);
                return null; // Exclude the child if it doesn't match criteria
              })
              .filter((child) => child !== null) || [];

          if (filteredChildren.length > 0) {
            console.log("Including collapsible menu:", menu.title);
            return {
              ...menu,
              children: filteredChildren,
            }; // Include collapsible menu if it has filtered children
          }
        } else if (
          menu.type === "nav-item" &&
          (menu.id === null || formPermissions?.includes(menu.id))
        ) {
          console.log("Including nav-item menu:", menu.title);
          return { ...menu }; // Include nav-item if it matches permissions or id is null
        }
        console.log("Excluding menu:", menu.title);
        return null; // Exclude the menu if it doesn't match criteria
      })
      .filter((menu) => menu !== null); // Remove null entries
  };

  // const filternavconfig = getFilteredMenus(navConfig);
  const filternavconfig = navConfig;

  // console.log(
  //   "modulePermissions",
  //   userRolePermissions,
  //   formPermissions,
  //   modulePermissions
  // );

  return (
    <React.Fragment>
      <SidebarHeader />

      <JumboScrollbar autoHide autoHideDuration={250} autoHideTimeout={500}>
        <Suspense
          fallback={
            <Div
              sx={{
                display: "flex",
                minWidth: 0,
                alignItems: "center",
                alignContent: "center",
                px: 3,
                zIndex: 1,
              }}
            >
              <SidebarSkeleton />
            </Div>
          }
        >
          <br />

          <JumboAdminVerticalNavbar data={filternavconfig} />
        </Suspense>
      </JumboScrollbar>
    </React.Fragment>
  );
};

const SidebarHeader = () => {
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const { sidebarTheme } = useJumboSidebarTheme();

  const isMiniAndClosed = React.useMemo(() => {
    return sidebarOptions?.view === SIDEBAR_VIEWS.MINI && !sidebarOptions?.open;
  }, [sidebarOptions.view, sidebarOptions.open]);

  return (
    <React.Fragment>
      {sidebarOptions?.style !== SIDEBAR_STYLES.CLIPPED_UNDER_HEADER && (
        <DrawerHeader>
          <Logo
            mini={isMiniAndClosed}
            mode={sidebarTheme.type}
            sx={{
              p: 0,
            }}
          />
          {sidebarOptions?.view !== SIDEBAR_VIEWS.MINI && (
            <Zoom in={sidebarOptions?.open}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{
                  ml: 0,
                  mr: -2.5,
                  fontSize: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                  padding: "0px 30px",
                  margin: "-8px 0px 0px 0px",
                  borderRadius: "0%",
                  "&:hover,&:active": {
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "inherit",
                    color: "#3c7c33 ",
                  },
                }}
                onClick={() => setSidebarOptions({ open: false })}
              >
                <div className="open-close-icon-theme3">
                  <MenuOpenIcon />
                </div>
              </IconButton>
            </Zoom>
          )}
        </DrawerHeader>
      )}
    </React.Fragment>
  );
};

export default Sidebar;

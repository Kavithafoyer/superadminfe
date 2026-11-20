import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import Div from "@jumbo/shared/Div";
import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import RolesList from "./RolesList";
import UsersList from "./UsersList";
import Setting from "../Setting";
import {
  ButtonStyle,
  Colors,
  ComponentHeading,
} from "app/pages/widgets/CRMStyles";

const RolesAndUsers = () => {
  const [showRoles, setShowRoles] = useState(true);
  const [showUserTable, setShowUserTable] = useState(false);

  const ShowUserRolesTable = () => {
    setShowRoles(true);
    setShowUserTable(false);
    // setShowCreateRoles(false);
    // setShowConfigurePermission(false);
  };

  const ShowUserTable = () => {
    setShowUserTable(true);
    setShowRoles(false);
    // setShowInviteUser(false);
  };

  return (
    <>
      {/* Edit company details code */}
      <JumboContentLayoutMain>
        {/* <Setting /> */}
        <Typography sx={[ComponentHeading]}>Roles and Users</Typography>
        <Div sx={{ mt: 2 }}>
          <Div
            sx={{
              display: "flex",
              textTransform: "capitalize",
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              sx={[
                ButtonStyle,
                {
                  mr: 3,
                  pl: 3,
                  pr: 3,
                  backgroundColor: showRoles === true ? Colors?.Mblue : "",
                  borderColor: Colors?.Mblue,
                  color: showRoles === true ? "#FFFFFF" : "#000000",
                  "&:hover": {
                    color: Colors?.Mblue,
                    borderColor: Colors?.Mblue,
                  },
                },
              ]}
              onClick={ShowUserRolesTable}
            >
              Roles
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={[
                ButtonStyle,
                {
                  pl: 3,
                  pr: 3,
                  backgroundColor: showUserTable === true ? Colors?.Mblue : "",
                  borderColor: Colors?.Mblue,
                  color: showUserTable === true ? "#FFFFFF" : "#000000",
                  "&:hover": {
                    color: Colors?.Mblue,
                    borderColor: Colors?.Mblue,
                  },
                },
              ]}
              onClick={ShowUserTable}
            >
              Users
            </Button>
          </Div>

          {/* code for roles table */}
          <Div sx={{ display: showRoles === true ? "block" : "none" }}>
            <RolesList />
          </Div>

          {/* code for user table */}
          <Div sx={{ display: showUserTable === true ? "block" : "none" }}>
            <UsersList />
          </Div>
        </Div>
      </JumboContentLayoutMain>
    </>
  );
};

export default RolesAndUsers;

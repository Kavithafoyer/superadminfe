import JumboTextField from "@jumbo/components/JumboFormik/JumboTextField";
import Div from "@jumbo/shared/Div";
import {
  Checkbox,
  FormControl,
  Typography,
  Grid,
  Autocomplete,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
} from "@mui/material";
import * as yup from "yup";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState, useRef } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { toast } from "react-toastify";
import { BASE_URL } from "app/services/auth-services";
import { Cancelbutton, CustomButton } from "app/pages/widgets/StylesComponents";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

const rolesValidation = yup.object({
  role: yup.string("Enter your Role name").required("Role name is required"),
});

const CreateRoles = ({ setShowRole, setShowCreateRoles, getData }) => {
  const token = localStorage.getItem("accesstoken");
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      db: localStorage.getItem("DBName"),
    },
  };

  const [role, setRole] = useState("");
  
  const [permissionsList, setPermissionsList] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});

  const RedirectToRolesTable = () => {
    setShowRole(true);
    setShowCreateRoles(false);
  };

  const getPermissionsList = async () => {
    await axios
      .get(`${BASE_URL}/useradmin/PermissionList/`, header)
      .then((res) => {
        setPermissionsList(res?.data || []);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getPermissionsList();
  }, []);

  const handleCheckPermission = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const handleToggleModule = (moduleName) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  const groupPermissionsByEntity = () => {
    const groups = {};
    permissionsList.forEach((perm) => {
      // Extract entity name: "Can add user" -> "User"
      const entity = perm.name
        .replace(
          /Can (add|change|delete|view|import|export|approve|qualify) /i,
          "",
        )
        .trim();

      const action = perm.codename.split("_")[0]; // add, change, delete, view, etc.

      if (!groups[entity]) {
        groups[entity] = {
          name: entity,
          permissions: {},
          contentType: perm.content_type,
        };
      }
      groups[entity].permissions[action] = perm.id;
    });
    return Object.values(groups);
  };

  const groupedData = groupPermissionsByEntity();

  const handleCreateRole = (values) => {
    const rolespayload = {
      name: values.role,
      Role_Name: values.role,
      permissions: selectedPermissions,
      Company_Id: parseInt(localStorage.getItem("OrganizationId")),
      Created_By: parseInt(localStorage.getItem("UserId")),
      Updated_By: parseInt(localStorage.getItem("UserId")),
      Created_Date: new Date().toISOString().split("T")[0],
      Updated_Date: new Date().toISOString().split("T")[0],
    };

    axios
      .post(`${BASE_URL}/useradmin/RoleCRUD/`, rolespayload, header)
      .then((res) => {
        if (res?.data?.id) {
          toast.success("Role created successfully");
          RedirectToRolesTable();
          getData();
        }
      })
      .catch((err) => {
        toast.error("Error creating role");
      });
  };

  const permissionColumns = [
    { label: "View", action: "view" },
    { label: "Create", action: "add" },
    { label: "Edit", action: "change" },
    { label: "Delete", action: "delete" },
  ];

  return (
    <Div sx={{ mt: 2 }}>
      <Typography
        variant="h2"
        sx={{ mb: 3, fontWeight: 700, color: "#064F6B" }}
      >
        Roles Permission
      </Typography>

      <Formik
        initialValues={{ role: "" }}
        validationSchema={rolesValidation}
        onSubmit={handleCreateRole}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Typography className="input-label">
                   Role Name <span className="required">*</span>
                </Typography>
                <JumboTextField
                  fullWidth
                  name="role"
                  placeholder="Enter Role Name"
                  className="input-box2"
                />
              </Grid>
            </Grid>

            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              Module Permissions - {values.role || "New Role"}
            </Typography>

            <TableContainer
              component={Paper}
              sx={{ mb: 4, maxHeight: 600, overflowY: "auto" }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f7f9" }}>
                    <TableCell sx={{ fontWeight: 700, width: "30%" }}>
                      <Box display="flex" alignItems="center">
                        <Checkbox
                          size="small"
                          checked={
                            permissionsList.length > 0 &&
                            selectedPermissions.length === permissionsList.length
                          }
                          indeterminate={
                            selectedPermissions.length > 0 &&
                            selectedPermissions.length < permissionsList.length
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPermissions(
                                permissionsList.map((p) => p.id),
                              );
                            } else {
                              setSelectedPermissions([]);
                            }
                          }}
                        />
                        Module / Form
                      </Box>
                    </TableCell>
                    {permissionColumns.map((col) => (
                      <TableCell
                        key={col.action}
                        align="center"
                        sx={{ fontWeight: 700 }}
                      >
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedData.map((group) => (
                    <React.Fragment key={group.name}>
                      <TableRow
                        sx={{
                          "& > *": { borderBottom: "unset" },
                          bgcolor: "#fafafa",
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <IconButton
                              size="small"
                              onClick={() => handleToggleModule(group.name)}
                            >
                              {expandedModules[group.name] ? (
                                <MdKeyboardArrowDown />
                              ) : (
                                <MdKeyboardArrowRight />
                              )}
                            </IconButton>
                            <Checkbox
                              size="small"
                              checked={Object.values(group.permissions).every(
                                (id) => selectedPermissions.includes(id),
                              )}
                              onChange={(e) => {
                                const ids = Object.values(group.permissions);
                                if (e.target.checked) {
                                  setSelectedPermissions((prev) =>
                                    Array.from(new Set([...prev, ...ids])),
                                  );
                                } else {
                                  setSelectedPermissions((prev) =>
                                    prev.filter((id) => !ids.includes(id)),
                                  );
                                }
                              }}
                            />
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600 }}
                            >
                              {group.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        {permissionColumns.map((col) => {
                          const permId = group.permissions[col.action];
                          return (
                            <TableCell key={col.action} align="center">
                              {permId ? (
                                <Checkbox
                                  size="small"
                                  checked={selectedPermissions.includes(permId)}
                                  onChange={() => handleCheckPermission(permId)}
                                />
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      {/* Sub-items could go here if the data had forms within modules */}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="flex-end" sx={{ mt: 3, mb: 3 }}>
              <Cancelbutton
                label="Cancel"
                onClick={RedirectToRolesTable}
                sx={{ mr: 2 }}
              />
              <CustomButton
                label="Save"
                type="submit"
                Icon="saveIcon"
                sx={{
                  bgcolor: "#064F6B",
                  color: "white",
                  "&:hover": { bgcolor: "#053d54" },
                }}
              />
            </Box>
          </Form>
        )}
      </Formik>
    </Div>
  );
};

export default CreateRoles;

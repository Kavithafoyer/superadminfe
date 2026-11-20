import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Autocomplete,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Table,
  TableBody,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { MdClose, MdDelete } from "react-icons/md";
import SearchBar from "../../widgets/SearchField";
import CreateRoles from "./CreateRoles";
import { TreeView, TreeItem } from "@mui/x-tree-view";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { BASE_URL } from "app/services/auth-services";
import {
  CRMTableHead,
  ComponentHeading,
  DialogHeader,
  DisplayFlex,
} from "app/pages/widgets/CRMStyles";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import { useSelector } from "react-redux";
import { selectUserRolePermissions } from "app/redux/actions/fetchUserRolePermissions";
import {
  Cancelbutton,
  CustomButton,
  DialogBox,
  NoRecordsPage,
} from "app/pages/widgets/StylesComponents";

const RolesList = ({ scrollHeight }) => {
  const token = localStorage.getItem("accesstoken");
  // const token ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNjk5NTQyMTgxLCJlbWFpbCI6InJhdmlrdW1hci5yQGZveWVydGVjaC5jb20iLCJvcmlnX2lhdCI6MTY5OTUwNjE4MX0.2xk15P67jfHINEHFhpyzyhLPR2fzitpujX3wolEkrMM"

  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      db: localStorage.getItem("DBName"),
    },
  };

  const initialstate = {
    id: "",
    Role_Id: "",
    name: "",
    Role_Name: "",
    Role_Description: "",
    permissions: "",
    Created_Date: "",
    Updated_Date: "",
    Is_Deleted: "",
    Company_Id: "",
    Created_By: "",
    Updated_By: "",
  };

  const formRef = useRef();
  const [showCreateRoles, setShowCreateRoles] = useState(false);
  const [showRole, setShowRole] = useState(true);
  const [roles, setRoles] = useState([initialstate]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [currentRole, setCurrentRole] = useState(initialstate);
  const [searchData, setSearchData] = useState("");
  const [datas, setDatas] = useState([]);
  const [arrForModule, setArrForModule] = useState([]);
  const [arrForFormName, setArrForFormName] = useState([]);
  const [permissions, setPermissions] = useState([]); // this state is using for store all the permissions

  const defaultPermissions = currentRole.permissions;
  useEffect(() => {
    setPermissions(defaultPermissions);
  }, [currentRole, defaultPermissions]);

  const [checkForm, setCheckForm] = useState([]);

  // fun for tree view
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  const [moduleId, setModuleId] = useState("");
  const [moduleId1, setModuleId1] = useState("");

  const [permissionsData, setPermissionsData] = useState([]);
  const [number, setNumber] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openPermissions, setOpenPermissions] = useState(false);

  // this function is going to use pagination
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalRecords = roles?.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    setLoading(true);
    if (searchData) {
      var searchrolespayload = {
        Search: `${searchData}`,
        Is_Deleted: false,
      };
      axios
        .put(
          `${BASE_URL}/Erpapp/RoleAdditionalCRUD/`,
          searchrolespayload,
          header,
        )
        .then((res) => {
          console.log(res?.data);
          setRoles(res?.data);
          setCurrentPage(page);
          setPage(1);
        })
        .catch((error) => {
          console.log("ds", error);
        });
    } else {
      await axios
        .get(`${BASE_URL}/useradmin/Rolelist/?page=${newPage}`, header)
        .then((res) => {
          console.log("FF", res?.data?.results);
          setRoles(res?.data?.results);
          setCount(res?.data?.count);
          setLoading(false);
        })
        .catch((error) => {
          console.log("ds", error);
          setLoading(false);
        });
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const ShowCreateRoleForm = () => {
    setShowCreateRoles(true);
    setShowRole(false);
  };

  const RedirectToUpdateRoles = () => {
    setOpenPermissions(false);
    setShowCreateRoles(false);
    setShowRole(true);
  };

  const getData = async () => {
    setLoading(true);
    await axios
      .get(`${BASE_URL}/useradmin/Rolelist/`, header)
      .then((res) => {
        console.log("FF", res?.data?.results);
        setRoles(res?.data?.results);
        setCount(res?.data?.count);
        setLoading(false);
      })
      .catch((error) => {
        console.log("ds", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const ShowConfigurePermission = (newValue) => {
    setNumber(newValue?.label);
    switch (newValue?.value) {
      case 1:
        setOpenPermissions(false);
        setShowCreateRoles(false);
        setArrForModule(permissionsData?.map((opt) => opt?.id));
        setArrForFormName(
          permissionsData?.flatMap((opt) => opt?.FormId?.map((i) => i?.id)),
        );
        setDatas(permissions);
        console.log("MNMN", permissions);

        break;
      case 2:
        // onLoadCheckBox();
        setOpenPermissions(true);
        setShowCreateRoles(false);
        break;
      default:
        setOpenPermissions(false);
        break;
    }
  };

  const getPermissionsList = async () => {
    await axios
      .post(
        `${BASE_URL}/useradmin/Formmasterlist/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: localStorage.getItem("DBName"),
          },
        },
      )
      .then((res) => {
        console.log("ddsgsg", res?.data);
        const filterlist = res?.data?.filter(
          (opt) => opt?.Is_Deleted === false,
        );
        setPermissionsData(filterlist);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const allPermissions = async () => {
    await axios
      .get(`${BASE_URL}/useradmin/PermissionList/`, header)
      .then((res) => {
        setPermissions(res?.data?.map((opt) => opt?.id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getPermissionsList();
    allPermissions();
  }, [number]);

  const handleCheckModuleName = (id) => (e, newValue) => {
    setModuleId(newValue);
    setModuleId1(e.target.value);

    const { value, checked } = e.target;
    if (checked) {
      if (arrForModule.indexOf(JSON.parse(value)) === -1)
        arrForModule.push(JSON.parse(value));
      console.log("arrForModule", arrForModule);
    } else {
      setArrForModule(
        arrForModule.filter((items) => items !== JSON.parse(value)),
      );
      setArrForFormName(
        arrForFormName.filter((items) => items !== JSON.parse(value)),
      );
      setDatas(datas.filter((items) => items !== JSON.parse(value)));
    }
  };

  // click the formname and enable the permissions
  const handleCheckFormName = (id) => (e, newValue) => {
    const { value, checked } = e.target;
    if (checked) {
      if (arrForFormName.indexOf(JSON.parse(value)) === -1)
        arrForFormName.push(JSON.parse(value));
      console.log("arr", arrForFormName);
    } else {
      setArrForFormName(
        arrForFormName.filter((items) => items !== JSON.parse(value)),
      );
      setDatas(datas.filter((items) => items !== JSON.parse(value)));
    }

    setCheckForm((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // click the checkbox and get the permissions
  // const handleCheckRoles = (e) => {
  //   const { value, checked } = e.target;
  //   if (checked) {
  //     if (datas.indexOf(JSON.parse(value)) === -1)
  //       datas.push(JSON.parse(value));
  //     console.log("G", value);
  //   } else {
  //     setDatas(datas.filter((items) => items !== JSON.parse(value)));
  //     console.log("P", value);
  //   }
  // };

  const handleCheckRoles = (id) => (e) => {
    const { value, checked } = e.target;
    const parsedValue = JSON.parse(value); // Parse the value if needed

    if (checked) {
      if (datas.indexOf(parsedValue) === -1) datas.push(parsedValue);
      console.log("add", parsedValue, datas);
      // setIndex(index + 1);
    } else {
      setDatas(datas.filter((items) => items !== parsedValue));
      console.log("remove", datas);
    }

    setCheckForm((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      } else {
        return [...prev, id];
      }
    });

    // const permissionName = e.target.name; // get the permission name from the checkbox
    // const isChecked = e.target.checked; // get whether the checkbox is checked or not
    // // update the currentRole object with the new permission value
    // setCurrentRole((prevRole) => ({
    //   ...prevRole,
    //   permissions: isChecked
    //     ? [...prevRole.permissions, permissionName]
    //     : prevRole.permissions.filter((name) => name !== permissionName),
    // }));

    // console.log("permission", currentRole.permissions);
  };

  // get a data from list page to edit page
  const handleClickEditPopup = (role) => {
    setOpenEdit(true);
    setCurrentRole({
      id: role?.id,
      Role_Id: role?.Role_Id,
      name: role?.name,
      Role_Name: role?.Role_Name,
      permissions: role?.permissions,
      FormNames: role?.FormNames,
      Modelname: role?.Modelname,
      Role_Description: role?.Description,
    });
    setDatas(role?.permissions);
    setArrForFormName(role?.FormNames);
    console.log("role.ModuleName", role?.Modelname);
    setArrForModule(role?.Modelname);
    setNumber(
      role?.permissions?.length > 1155
        ? "All Permissions"
        : "Configure Permissions",
    );
    console.log("permission id", role?.permissions?.length > 1155 ? 1 : 2);
  };

  const handleChangeName = (e) => {
    const { name, value } = e.target;
    setCurrentRole({ ...currentRole, [name]: value });
    console.log("Role changes", value);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();

    var defaultPermissions = [
      5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 61, 62, 63, 64, 313, 314, 315,
      316, 317, 318, 319, 320, 409, 410, 411, 412, 413, 414, 415, 416,
    ];

    var rolespayload = {
      id: currentRole?.id,
      Role_Id: currentRole?.Role_Id,
      name: currentRole?.Role_Name,
      Role_Name: currentRole?.Role_Name,
      Role_Description: currentRole?.Role_Description,
      Description: currentRole?.Role_Description,
      permissions: datas,
      FormNames: arrForFormName,
      Modelname: arrForModule,
      RolePermissions: [],
      FormPermissions: [],
      Company_Id: parseInt(localStorage.getItem("OrganizationId")),
      Created_By: parseInt(localStorage.getItem("UserId")),
      Updated_By: parseInt(localStorage.getItem("UserId")),
      Updated_Date: new Date().toISOString().split("T")[0],
    };
    axios
      .put(`${BASE_URL}/useradmin/RoleCRUD/`, rolespayload, header)
      .then((res) => {
        console.log(res.data);
        if (res.status === 200 && res.data.id) {
          toast.success(`Role ${currentRole.name} is updated successfully`);
          getData();
          setOpenEdit(!openEdit);
        } else {
          toast.error("Please give valid permissions");
        }
      })
      .catch((error) => {
        console.log("ds", error);
      });
  };

  const handleDeletePopup = (role) => {
    setOpenDelete(true);
    setCurrentRole({
      id: role?.id,
      Role_Id: role?.Role_Id,
      name: role?.name,
      Role_Name: role?.Role_Name,
      permissions: role?.permissions,
      Role_Description: "",
    });
  };

  const deleteRole = () => {
    axios
      .delete(
        `${BASE_URL}/useradmin/RoleCRUD/?Role_Id=${currentRole?.Role_Id}`,
        header,
      )
      .then((res) => {
        console.log(res?.data);
        setOpenDelete(false);
        toast.success(`Role ${currentRole?.Role_Name} is deleted successfully`);
        getData();
      })
      .catch((error) => {
        console.log("ds", error);
      });
  };

  const debouncedSearch = React.useCallback(
    debounce((data) => {
      if (data !== "") {
        var searchrolespayload = {
          Search: `${data}`,
          Is_Deleted: false,
        };
        axios
          .get(`${BASE_URL}/useradmin/userrolesearch/?search=${data}`, header)
          .then((res) => {
            console.log(res?.data);
            setRoles(res?.data?.results);
            setCount(res?.data?.count);
            setCurrentPage(page);
            setPage(1);
          })
          .catch((error) => {
            console.log("ds", error);
          });
      } else {
        setPage(currentPage);
        setRoles(null);
      }
    }, 500),
    [header, page, currentPage],
  );

  const handleSearchRoles = (e) => {
    var data = e.target.value;
    setSearchData(data);
    if (data !== "") {
      debouncedSearch(data);
    } else {
      getData();
    }
  };

  console.log("arrForFormName", arrForFormName);

  return (
    <>
      {/* code for roles table */}
      <Div sx={{ display: showRole === true ? "block" : "none" }}>
        <Grid container spacing={1} sx={{ mt: -1, mb: 1 }}>
          <Grid item xs={12} md={6}></Grid>
          <Grid item xs={12} md={6}>
            <Div sx={[DisplayFlex, { justifyContent: "right" }]}>
              <SearchBar
                width={"250px !important"}
                value={searchData}
                border={"1px solid lightgray"}
                SearchData={handleSearchRoles}
              />
              <CustomButton
                onClick={ShowCreateRoleForm}
                label="create"
                Icon="createIcon"
                endIcon={true}
                sx={{ width: "120px !important" }}
              />
            </Div>
          </Grid>
        </Grid>

        <JumboScrollbar
          autoHeight={true}
          autoHideTimeout={4000}
          autoHeightMin={scrollHeight ? scrollHeight : "50vh"}
          autoHide={true}
          hideTracksWhenNotNeeded
          id="no-more-tables"
        >
          <Table sx={{ minWidth: { xs: "auto", sm: 800 } }}>
            <TableHead sx={[CRMTableHead]}>
              <CRMTableRow>
                <CRMTableCell sx={{ fontWeight: 600 }}>Role Id</CRMTableCell>
                <CRMTableCell sx={{ fontWeight: 600 }}>Role Name</CRMTableCell>
                <CRMTableCell sx={{ fontWeight: 600 }}>Permission</CRMTableCell>
                <CRMTableCell sx={{ fontWeight: 600, textAlign: "right" }}>
                  Action &nbsp;&nbsp;
                </CRMTableCell>
              </CRMTableRow>
            </TableHead>
            <TableBody>
              {roles?.length > 0 ? (
                roles?.map((role, index) => {
                  return (
                    <CRMTableRow hover key={index}>
                      <CRMTableCell data-title="Role Id">
                        {role?.Role_Id}
                      </CRMTableCell>
                      <CRMTableCell data-title="Role Name">
                        {role?.Role_Name}
                      </CRMTableCell>
                      <CRMTableCell data-title="Permission">
                        {role?.permissions?.length > 1155
                          ? "All Permissions"
                          : "Configure Permission"}
                      </CRMTableCell>
                      <CRMTableCell
                        data-title="Action"
                        sx={{
                          textAlign: "right",
                          display: "flex",
                          justifyContent: { xs: "flex-end", sm: "right" },
                        }}
                      >
                        <IconButton
                          size="small"
                          className="edit-icon"
                          onClick={() => {
                            handleClickEditPopup(role);
                          }}
                        >
                          <BiEdit />
                        </IconButton>

                        <IconButton
                          size="small"
                          className="delete-icon"
                          onClick={() => handleDeletePopup(role)}
                        >
                          <MdDelete />
                        </IconButton>
                      </CRMTableCell>
                    </CRMTableRow>
                  );
                })
              ) : (
                // <CRMTableRow className="col-12">
                //   <Div sx={{ textAlign: "center" }}>No Data</Div>
                // </CRMTableRow>
                <NoRecordsPage title={"Role List"} />
              )}
            </TableBody>
          </Table>
        </JumboScrollbar>

        {loading && <NoRecordsPage title={"Role List"} />}

        {/* code for pagination */}
        <Div
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Pagination
            color="success"
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Div>

        {/* Edit roles popup */}
        <Dialog open={openEdit}>
          <DialogTitle
            sx={[
              CRMTableHead,
              DialogHeader,
              DisplayFlex,
              { bgcolor: "#dcdcdc !important" },
            ]}
          >
            Edit Role
          </DialogTitle>

          <form onSubmit={handleSubmitEdit}>
            <DialogContent sx={{ pl: 4, pr: 4 }}>
              <Div sx={{ minWidth: "500px", minHeight: "100px" }}>
                <Div className="mb-3 row">
                  <Typography className="col-sm-4 input-label mt-1">
                    Role Name <span className="required">*</span>
                  </Typography>
                  <TextField
                    type="text"
                    className="col-sm-8 input-box2 pe-2"
                    id="staticEmail"
                    placeholder="Enter Role Name"
                    name="Role_Name"
                    value={currentRole?.Role_Name}
                    onChange={handleChangeName}
                  />
                </Div>
                <Div className="mb-3 row">
                  <Typography className="col-sm-4 input-label">
                    Permission <span className="required">*</span>
                  </Typography>
                  <FormControl className="col-sm-8 d-flex pe-2">
                    <Autocomplete
                      className="search-select3"
                      name="date"
                      options={[
                        { label: "All Permissions", value: 1 },
                        { label: "Configured Permission", value: 2 },
                      ]}
                      getOptionLabel={(option) => {
                        if (typeof option === "string") {
                          return option;
                        }
                        if (option && option?.label) {
                          return option?.label;
                        }
                        return "";
                      }}
                      value={number}
                      onChange={(e, newValue) => {
                        ShowConfigurePermission(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="number"
                          placeholder="Choose Permissions"
                        />
                      )}
                    />
                  </FormControl>
                </Div>
                <Div className="mb-3 row">
                  <Typography className="col-sm-4 input-label mt-1">
                    Role Description
                  </Typography>
                  <TextField
                    type="text"
                    rows={3}
                    multiline
                    className="col-sm-8 multiline-box pe-2"
                    id="staticEmail"
                    placeholder="Enter Role Description"
                    name="Role_Description"
                    value={currentRole?.Role_Description}
                    onChange={handleChangeName}
                  />
                </Div>
              </Div>
            </DialogContent>
            <DialogActions sx={{ mr: 1 }}>
              <CustomButton
                // onClick={() => handleSubmit()}
                label="Update"
                type="submit"
                Icon="saveIcon"
              />
              <Cancelbutton
                label="Cancel"
                onClick={() => {
                  setOpenEdit(false);
                }}
              />
            </DialogActions>
          </form>
        </Dialog>

        {/* delete dialog box */}
        <DialogBox
          open={openDelete}
          Content={"Are you sure you want to delete the User Role"}
          onClickNo={() => {
            setOpenDelete(false);
          }}
          onClickYes={() => {
            setOpenDelete(false);
            deleteRole();
          }}
        />

        {/* Edit Configure permission dialogue box */}
        <Dialog
          // fullScreen
          open={openPermissions}
          maxWidth="xl"
          fullWidth
        >
          <Div
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
              pt: 0,
            }}
          >
            <Typography sx={[ComponentHeading]} padding={2.5} margin={0}>
              Update Configure Permissions
            </Typography>
            {/* {console.log("permissionsData", permissionsData)} */}
            <IconButton onClick={() => setOpenPermissions(false)}>
              <MdClose />
            </IconButton>
          </Div>
          <Div sx={{ p: 5, pt: 0 }}>
            <form ref={formRef}>
              <Div sx={{ minHeight: "400px" }}>
                {permissionsData?.map((data, index) => {
                  if (data?.FormId?.find((opt) => opt?.ModuleName === "User")) {
                    return (
                      <TreeView
                        aria-label="controlled"
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        expanded={expanded}
                        selected={selected}
                        onNodeToggle={handleToggle}
                        onNodeSelect={handleSelect}
                        multiSelect
                        className="treeview-lists"
                      >
                        <TreeItem
                          nodeId={data?.id}
                          label={
                            <div>
                              <Div
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      color="info"
                                      size="small"
                                      value={data?.id}
                                      checked={arrForModule?.includes(data?.id)}
                                      onChange={handleCheckModuleName(data?.id)}
                                    />
                                  }
                                />
                                <FormLabel
                                  sx={{
                                    color: "#000000",
                                    fontSize: 14,
                                    textTransform: "capitalize",
                                    ml: -2,
                                  }}
                                >
                                  {data?.ModuleName}
                                </FormLabel>
                              </Div>
                            </div>
                          }
                        >
                          <Div sx={{ display: "flex", flexWrap: "wrap" }}>
                            {permissionsData[index].FormId?.map((name, inx) => {
                              return (
                                <Div sx={{ minWidth: "345px" }} key={inx}>
                                  {name?.PermissionName?.length > 0 ? (
                                    <TreeItem
                                      nodeId={name?.id}
                                      label={
                                        <Div
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                color="info"
                                                value={name?.id}
                                                size="small"
                                                checked={arrForFormName.includes(
                                                  name?.id,
                                                )}
                                                onChange={handleCheckFormName(
                                                  name?.id,
                                                )}
                                                // disabled={
                                                //   moduleId1 === data.id && moduleId
                                                //     ? false
                                                //     : true
                                                // }
                                                disabled={
                                                  arrForModule.includes(
                                                    data?.id,
                                                  )
                                                    ? false
                                                    : true
                                                }
                                              />
                                            }
                                          />
                                          <FormLabel
                                            sx={{
                                              color: "#000000",
                                              fontSize: 12,
                                              textTransform: "capitalize",
                                              ml: -2,
                                            }}
                                          >
                                            {name?.FormName}
                                          </FormLabel>
                                        </Div>
                                      }
                                    >
                                      <Div sx={{ width: "330px" }}>
                                        <Grid
                                          container
                                          sx={{ ml: { xs: 2, md: 4 } }}
                                        >
                                          <Grid item>
                                            <FormGroup
                                              sx={{
                                                textTransform: "capitalize",
                                              }}
                                            >
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    color="info"
                                                    // id={name.ModulePermission[0]}
                                                    // name={
                                                    //   name.PermissionName[0].name
                                                    // }
                                                    value={
                                                      name.ModulePermission[0]
                                                    }
                                                    size="small"
                                                    checked={datas.includes(
                                                      name.ModulePermission[0],
                                                    )}
                                                    onChange={handleCheckRoles(
                                                      name.id,
                                                    )}
                                                    // disabled={
                                                    //   checkForm.includes(name.id)
                                                    //     ? false
                                                    //     : true
                                                    // }
                                                    disabled={
                                                      arrForFormName.includes(
                                                        name.id,
                                                      )
                                                        ? false
                                                        : true
                                                    }
                                                  />
                                                }
                                                label={
                                                  name?.PermissionName[0]?.name1
                                                }
                                              />
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    color="info"
                                                    // id={name.ModulePermission[1]}
                                                    value={
                                                      name.ModulePermission[1]
                                                    }
                                                    checked={datas.includes(
                                                      name.ModulePermission[1],
                                                    )}
                                                    size="small"
                                                    onChange={handleCheckRoles(
                                                      name.id,
                                                    )}
                                                    // disabled={
                                                    //   checkForm.includes(name.id)
                                                    //     ? false
                                                    //     : true
                                                    // }
                                                    disabled={
                                                      arrForFormName.includes(
                                                        name.id,
                                                      )
                                                        ? false
                                                        : true
                                                    }
                                                  />
                                                }
                                                label={
                                                  name?.PermissionName[0]?.name2
                                                }
                                              />
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    color="info"
                                                    // id={name.ModulePermission[2]}
                                                    value={
                                                      name.ModulePermission[2]
                                                    }
                                                    checked={datas.includes(
                                                      name.ModulePermission[2],
                                                    )}
                                                    size="small"
                                                    onChange={handleCheckRoles(
                                                      name.id,
                                                    )}
                                                    // disabled={
                                                    //   checkForm.includes(name.id)
                                                    //     ? false
                                                    //     : true
                                                    // }
                                                    disabled={
                                                      arrForFormName.includes(
                                                        name.id,
                                                      )
                                                        ? false
                                                        : true
                                                    }
                                                  />
                                                }
                                                label={
                                                  name?.PermissionName[0]?.name3
                                                }
                                              />
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    color="info"
                                                    // id={name.ModulePermission[3]}
                                                    value={
                                                      name.ModulePermission[3]
                                                    }
                                                    checked={datas.includes(
                                                      name.ModulePermission[3],
                                                    )}
                                                    size="small"
                                                    onChange={handleCheckRoles(
                                                      name.id,
                                                    )}
                                                    // disabled={
                                                    //   checkForm.includes(name.id)
                                                    //     ? false
                                                    //     : true
                                                    // }
                                                    disabled={
                                                      arrForFormName.includes(
                                                        name.id,
                                                      )
                                                        ? false
                                                        : true
                                                    }
                                                  />
                                                }
                                                label={
                                                  name?.PermissionName[0]?.name4
                                                }
                                              />
                                            </FormGroup>
                                          </Grid>
                                        </Grid>
                                      </Div>
                                    </TreeItem>
                                  ) : (
                                    <div>
                                      {/* Render a simple label without TreeItem when PermissionName is empty */}
                                      <Div
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          ml: 4,
                                        }}
                                      >
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              value={name?.id}
                                              size="small"
                                              color="info"
                                              checked={arrForFormName?.includes(
                                                name?.id,
                                              )}
                                              onChange={handleCheckFormName(
                                                name?.id,
                                              )}
                                              disabled={
                                                !arrForModule?.includes(
                                                  data?.id,
                                                )
                                              }
                                            />
                                          }
                                        />
                                        <FormLabel
                                          sx={{
                                            color: "#000000",
                                            fontSize: 12,
                                            ml: -2,
                                          }}
                                        >
                                          {name?.FormName}
                                        </FormLabel>
                                      </Div>
                                    </div>
                                  )}
                                </Div>
                              );
                            })}
                          </Div>
                        </TreeItem>
                      </TreeView>
                    );
                  }
                })}
              </Div>
              <Div sx={{ mt: 5, display: "flex", justifyContent: "end" }}>
                <CustomButton
                  onClick={RedirectToUpdateRoles}
                  label="Update"
                  // type="submit"
                  Icon="saveIcon"
                  sx={{ mr: 1 }}
                />
                <Cancelbutton
                  label="Cancel"
                  onClick={() => {
                    setOpenPermissions(false);
                    setShowCreateRoles(false);
                  }}
                />
                {/* <Button
                  sx={[DialogBoxSaveButton, FontStyle, ButtonStyle, { mr: 2 }]}
                  onClick={RedirectToUpdateRoles}
                >
                  Update
                </Button>
                <Button
                  sx={[DialogBoxCancelButton, FontStyle, ButtonStyle]}
                  onClick={() => {
                    setOpenPermissions(false);
                    setShowCreateRoles(false);
                  }}
                >
                  Cancel
                </Button> */}
              </Div>
            </form>
          </Div>
        </Dialog>
      </Div>

      {/* code for create roles */}
      <Div
        id="createrolepage"
        sx={{ display: showCreateRoles === true ? "block" : "none" }}
      >
        <CreateRoles
          setShowRole={setShowRole}
          setShowCreateRoles={setShowCreateRoles}
          getData={getData}
        />
      </Div>
    </>
  );
};

export default RolesList;

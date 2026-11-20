import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Button,
  Table,
  TableBody,
  TableHead,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TableContainer,
  Stack,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import {
  ButtonStyle,
  CRMTableHead,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  FontStyle,
} from "app/pages/widgets/CRMStyles";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";

const TicketsManagementGroup = () => {
  const createrId = localStorage.getItem("UserId");
  const token = localStorage.getItem("accesstoken");
  const dbName = localStorage.getItem("DBName");

  const [relateddatas, setrelateddatas] = useState([]);
  const [usersdatas, setusersdatas] = useState([]);
  const [rows, setrows] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);

  const LookupTicketrealatedrecords = () => {
    axios
      .get(`${BASE_URL}/superadmin/Userlookuplist/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: dbName,
        },
      })
      .then((response) => {
        let arr = response.data;
        let list = [];
        arr.map((item, index) => {
          if (item.Lookupname === "Ticket Related To") {
            list.push(item);
          }
        });
        if (list.length > 0) {
          setrelateddatas(list[0].Values);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const Usersrecord = () => {
    axios
      .get(`${BASE_URL}/superadmin/CRMUserlist/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: dbName,
        },
      })
      .then((response) => {
        setusersdatas(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddRow = () => {
    const newitem = {
      Related_to: "",
      Members: [],
      allow: true,
    };
    setrows([...rows, newitem]);
  };

  const handlesalespersonchange1 = (e, index) => {
    const { name, value } = e.target;
    const list = [...rows];
    list[index][name] = value;
    setrows(list);
  };
  const handlesalespersonchange = (e, index) => {
    const { name, value } = e.target;
    const list = [...rows];
    list[index][name] = value;
    setrows(list);
  };
  const handleRemoveRow = (index, data) => {
    handleDeleteprediction(data);
    setrows((oldValues) => {
      return oldValues.filter((_, i) => i !== index);
    });
    setOpenDelete(false);
  };

  const GetTicketManagementlist = () => {
    axios
      .get(`${BASE_URL}/superadmin/SuperAdminTicketManagement/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: dbName,
        },
      })
      .then((response) => {
        const data = response.data?.results || response.data;
        if (data && data.length > 0) {
          let valueArr = [];
          data.map((item, index) => {
            let assign = [];
            if (
              item.AssigntoUser &&
              item.AssigntoUser !== "" &&
              item.AssigntoUser !== null &&
              item.AssigntoUser !== "[]" &&
              item.AssigntoUser.length > 0
            ) {
              item.AssigntoUser.map((data, ind) => {
                assign.push(data.Employee);
              });
            }
            const newitem = {
              id: item.id,
              Related_to: item.TicketRelatesto,
              Members: assign,
              allow: false,
            };
            valueArr.push(newitem);
          });
          setrows(valueArr);
        } else {
          const newitem = {
            Related_to: "",
            Members: [],
            allow: true,
          };
          setrows([newitem]);
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleDeleteprediction = (data) => {
    if (data.id !== undefined) {
      axios
        .delete(
          `${BASE_URL}/superadmin/SuperAdminTicketManagementCRUD/?id=${data.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
              db: dbName,
            },
          },
        )
        .then((res) => {
          if (res.data === "Deleted Successfully") {
            toast.success(res.data);
          } else {
            toast.error("Something went wrong");
          }
          setOpenDelete(false);
        })
        .catch((error) => {
          console.log("ds", error);
        });
    }
  };

  useEffect(() => {
    LookupTicketrealatedrecords();
    Usersrecord();
    GetTicketManagementlist();
  }, []);

  const handleSaveTicketManagement = () => {
    let arr = [];
    let putarr = [];
    rows?.map((item1, index1) => {
      if (item1.id === undefined || item1.id === "" || item1.id === null) {
        arr.push(item1);
      } else {
        putarr.push(item1);
      }
    });

    arr.map((item, ind) => {
      if (
        item.Related_to === "" ||
        item.Related_to === undefined ||
        item.Related_to === null ||
        !item.Members ||
        item.Members.length === 0
      ) {
        toast.error("Invalid Data");
      } else {
        let assign = [];
        item.Members.map((data, ind) => {
          let a = { Employee: data };
          assign.push(a);
        });
        let payload = {
          TicketRelatesto: item.Related_to,
          AssigntoUser: assign,
          Assignto: [1],
          Created_By: createrId,
          Updated_By: createrId,
        };
        axios
          .post(
            `${BASE_URL}/superadmin/SuperAdminTicketManagementCRUD/`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                Db: dbName,
              },
            },
          )
          .then((response) => {
            if (response.data.id !== undefined) {
              toast.success("Created Successfully");
              GetTicketManagementlist();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });

    putarr.map((item, ind) => {
      if (
        item.Related_to === "" ||
        item.Related_to === undefined ||
        item.Related_to === null ||
        !item.Members ||
        item.Members.length === 0
      ) {
        toast.error("Invalid Data");
      } else {
        let assign = [];
        item.Members.map((data, ind) => {
          let a = { Employee: data };
          assign.push(a);
        });
        let payload = {
          id: item.id,
          TicketRelatesto: item.Related_to,
          AssigntoUser: assign,
          Assignto: [1],
          Created_By: createrId,
          Updated_By: createrId,
        };
        axios
          .put(
            `${BASE_URL}/superadmin/SuperAdminTicketManagementCRUD/?id=${item.id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                Db: dbName,
              },
            },
          )
          .then((response) => {
            if (response.status === 200) {
              toast.success("Updated Successfully");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  return (
    <>
      <JumboContentLayoutMain>
        <Div>
          <Typography sx={[ComponentHeading]}>
            Tickets Management Group
          </Typography>
          <div>
            <Div sx={{ m: 1, ml: 0, mr: 0, p: 2, minHeight: "60vh" }}>
              <Div sx={{ display: "block" }}>
                <form>
                  <JumboScrollbar
                    autoHeight={true}
                    autoHideTimeout={4000}
                    autoHeightMin={286}
                    autoHide={true}
                    hideTracksWhenNotNeeded
                    id="no-more-tables"
                  >
                    <TableContainer>
                      <Table stickyHeader className="table" sx={{ mt: 2 }}>
                        <TableHead sx={[CRMTableHead]}>
                          <CRMTableRow>
                            <CRMTableCell>Ticket Related to</CRMTableCell>
                            <CRMTableCell>Add Employee</CRMTableCell>
                            <CRMTableCell>Action</CRMTableCell>
                          </CRMTableRow>
                        </TableHead>
                        <TableBody>
                          {rows.length > 0 &&
                            rows.map((item, index) => {
                              return (
                                <CRMTableRow key={index} hover>
                                  <CRMTableCell data-title="Ticket Related to">
                                    <FormControl className="col-sm-12 ">
                                      <Select
                                        value={item?.Related_to}
                                        sx={{ height: "35px", width: "260px" }}
                                        className="react-select-box"
                                        name="Related_to"
                                        onChange={(e) =>
                                          handlesalespersonchange1(e, index)
                                        }
                                      >
                                        {relateddatas &&
                                          relateddatas.map((item, index) => (
                                            <MenuItem
                                              key={index}
                                              value={item.value}
                                            >
                                              {item.value}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    </FormControl>
                                  </CRMTableCell>

                                  <CRMTableCell data-title="Add Employee">
                                    <FormControl className="col-sm-12 ">
                                      <Select
                                        multiple
                                        value={item.Members}
                                        sx={{ height: "35px", width: "380px" }}
                                        className="react-select-box"
                                        name="Members"
                                        onChange={(e) => {
                                          handlesalespersonchange(e, index);
                                        }}
                                        renderValue={(selected) => (
                                          <Stack
                                            gap={1}
                                            direction="row"
                                            flexWrap="nowrap"
                                            sx={{ overflowX: "auto" }}
                                          >
                                            {selected?.map((value) => (
                                              <Chip key={value} label={value} />
                                            ))}
                                          </Stack>
                                        )}
                                      >
                                        {usersdatas &&
                                          usersdatas.map((item, index) => (
                                            <MenuItem
                                              key={index}
                                              value={
                                                item.User_Name || item.username
                                              }
                                            >
                                              {item.User_Name || item.username}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    </FormControl>
                                  </CRMTableCell>
                                  <CRMTableCell data-title="Action">
                                    <Div>
                                      <Button
                                        color="error"
                                        onClick={(e) =>
                                          setOpenDelete({ index, item })
                                        }
                                      >
                                        <MdDelete size={24} />
                                      </Button>
                                    </Div>
                                  </CRMTableCell>
                                </CRMTableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </JumboScrollbar>
                  <Div sx={{ display: "flex", justifyContent: "left", ml: 2 }}>
                    <Button
                      sx={{ mt: 2, color: "#287EFF" }}
                      onClick={handleAddRow}
                    >
                      + Add More Lines
                    </Button>
                  </Div>

                  <Div
                    sx={{
                      mt: 3,
                      justifyContent: "end",
                      alignItems: "center",
                      display: "flex",
                      mr: 5,
                    }}
                  >
                    <Button
                      sx={[
                        ButtonStyle,
                        FontStyle,
                        DialogBoxSaveButton,
                        { mr: 1 },
                      ]}
                      onClick={handleSaveTicketManagement}
                    >
                      Save
                    </Button>
                    <Button
                      sx={[ButtonStyle, FontStyle, DialogBoxCancelButton]}
                    >
                      Cancel
                    </Button>
                  </Div>
                </form>
              </Div>
            </Div>
          </div>

          <Dialog open={openDelete} maxWidth="xs" fullWidth>
            <DialogContent sx={{ pl: 4, pr: 4 }}>
              <Div>
                <Typography sx={[FontStyle]}>
                  Are you sure you want to delete this record?
                </Typography>
              </Div>
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                sx={[DialogBoxSaveButton, ButtonStyle, FontStyle, { mr: 1 }]}
                onClick={() => {
                  handleRemoveRow(openDelete?.index, openDelete?.item);
                }}
              >
                Delete
              </Button>
              <Button
                sx={[DialogBoxCancelButton, ButtonStyle, FontStyle]}
                onClick={() => setOpenDelete(false)}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Div>
      </JumboContentLayoutMain>
      <ToastContainer />
    </>
  );
};
export default TicketsManagementGroup;

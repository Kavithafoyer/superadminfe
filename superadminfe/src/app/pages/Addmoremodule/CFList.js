import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  ComponentHeading,
  DisplayFlex,
} from "app/pages/widgets/CRMStyles";
import { CRMTableCell, CRMTableRow } from "../widgets/CRMTable";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { useParams } from "react-router-dom";
import Div from "@jumbo/shared/Div";
import FormEdit from "./CFEdit";
import CFCreate from "./CFCreate";
import useStateRef from "react-usestateref";
import { toast } from "react-toastify";
import SearchBar from "../widgets/SearchField";
import { CommonPagination, CustomButton, DeletedIcon, DialogBox, EditIcon, NoRecordsPage } from "../widgets/StylesComponents";
import { AutoHeight } from "app/redux/auth/localStorage";

const token = localStorage.getItem("accesstoken");

const CFList = () => {
  const [FormList, setFormList, FormLists] = useStateRef([]);
  const [FormHeader, setFormHeader, FormHeaders] = useStateRef([]);
  const [FormName, setFormName] = useState(null);
  const [Formid, setFormid] = useState(null);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [EditFormData, setEditFormData] = useState({});
  const [showlistpage, setshowlistpage] = useState(true);
  const [showformpage, setshowformpage] = useState(false);
  const [showeditpage, setshoweditpage] = useState(false);
  const [RemoveList, setRemoveList] = useState([]);
  const [save, setSave] = useState("");

  const { id } = useParams();

  useEffect(() => {
    GetFormSTR(id);
  }, [id]);

  const GetFormSTR = async () => {
    await axios
      .get(`${BASE_URL}/user/CustomizeFormCRUD/?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        GetFormList(res);
      }).catch((error) => {
        console.log("ds", error);
      });
  };

  const GetFormList = async (F1Res) => {
    await axios
      .get(`${BASE_URL}/user/CustomizeFormSubmissionlist/?form_id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // }).then((res) => {
        //     setFormName( F1Res?.data?.FormName);
        //     //---------------------------------------Clean data for Table header----------------------------//
        //     const buttonLabels = []
        //     // Iterate over the components array
        //     F1Res?.data?.FormSTR?.components.forEach(component => {
        //         // Check if the type is "button"
        //         if (component.type === "button") {
        //             // If it's a button, add its label to the buttonLabels array
        //             buttonLabels.push(component.key);
        //         }
        //         else {
        //             // Check if the component has a 'column' property
        //             if (component?.columns) {
        //                 component.columns.forEach(columns => {
        //                     columns?.components.forEach(component => {
        //                         // Check if the type is "button"
        //                         if (component.type === "button") {
        //                             // If it's a button, add its label to the buttonLabels array
        //                             buttonLabels.push(component.key);
        //                         }
        //                     })
        //                 })
        //             }
        //         }
        //     });
      })
      .then((res) => {
        setFormName(F1Res?.data?.FormName);
        console.log("F1Res?.data:", F1Res?.data);
        console.log("F1Res:", F1Res);
        console.log("F1Res?.data?.FormName:", F1Res?.data?.FormName);
        console.log(
          "F1Res?.data?.FormSTR?.components;",
          F1Res?.data?.FormSTR?.components
        );
        //---------------------------------------Clean data for Table header----------------------------//
        const buttonLabels = [];
        const components = F1Res?.data?.FormSTR?.components;
        if (components && Array.isArray(components)) {
          components.forEach((component) => {
            // Check if the type is "button"
            if (component.type === "button") {
              // If it's a button, add its label to the buttonLabels array
              buttonLabels.push(component.key);
            } else if (component?.columns) {
              component.columns.forEach((columns) => {
                columns?.components.forEach((component) => {
                  // Check if the type is "button"
                  if (component.type === "button") {
                    // If it's a button, add its label to the buttonLabels array
                    buttonLabels.push(component.key);
                  }
                });
              });
            }
          });
        } else {
          console.error(
            "Components array is either undefined or not an array."
          );
        }

        setRemoveList(buttonLabels);

        //-------------------------------------Table Header Data Manipulation--------------------------------//
        let headerdata = res?.data?.results[0]?.data;
        // Objects to Array
        const keys = Object.keys(headerdata || {});
        // Remove Button type list from array
        headerdata = keys.filter((value) => !buttonLabels.includes(value));
        // Update the original array to capitalize the first letter and make the rest lowercase
        headerdata.forEach((item, index) => {
          headerdata[index] =
            item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
        });
        // Save the data to State
        setFormHeader(headerdata);

        //--------------------------------------Table Body Data Manipulation--------------------------//
        let listdata = res?.data?.results;

        // Iterate over each object in the Formlist array
        listdata.forEach((item) => {
          // Iterate over each key to remove
          buttonLabels.forEach((key) => {
            // Check if the key exists in the data object
            if (item.data.hasOwnProperty(key)) {
              // If the key exists, remove it
              delete item.data[key];
            }
          });
        });

        setFormList(listdata);
        setCount(listdata?.length);
        setFormid(res?.data?.results[0]?.form_id);
        console.log(
          "res?.data?.results[0]?.form_id:",
          res?.data?.results[0]?.form_id
        );
      }).catch((error) => {
        console.log("ds", error);
      });
  };


  const handleChangePage = async (newValue) => {
    setPage(newValue);
  }

  const EditList = (data) => {
    setEditFormData(data);
    setshowformpage(false);
    setshowlistpage(false);
    setshoweditpage(true);
  };

  const DeleteList = (data) => {
    axios
      .delete(`${BASE_URL}/user/CustomizeFormSubmissionCRUD/?id=${data?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        GetFormSTR();
        toast.success("Record Deleted Successfully", {
          position: "top-right",
          autoClose: 1000,
        });
      })
      .catch((error) => {
        console.log("ds", error);
      });
  };
  //-----------Searching Functionality--Start----------------------//
  const handleSearchChange = (event) => {
    console.log("handleSearchange:", event.target.value);
    var SearchData = event.target.value;
    SearchData !== "" ? handleSearch(SearchData) : GetFormSTR();
  };

  const handleSearch = async (SearchData) => {
    console.log("SearchData:", SearchData);
    await axios.get(
      `${BASE_URL}/user/CustomizeFormSubmissionsearch/?id=${Formid}&search=${SearchData}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    ).then((res) => {
      console.log("res:", res);
      //--------------------------------------Table Body Data Manipulation--------------------------//
      let Searchlistdata = res?.data;

      // Iterate over each object in the Formlist array
      Searchlistdata.forEach((item) => {
        // Iterate over each key to remove
        RemoveList.forEach((key) => {
          // Check if the key exists in the data object
          if (item.data.hasOwnProperty(key)) {
            // If the key exists, remove it
            delete item.data[key];
          }
        });
      });

      setFormList(Searchlistdata);
      setCount(Searchlistdata?.length);
    }).catch((error) => {
      console.log("ds", error);
    });
  };

  return (
    <>
      <JumboContentLayoutMain>
        <Div sx={{ display: showlistpage ? "block" : "none" }}>
          <Typography sx={[ComponentHeading]}>
            {FormName}
          </Typography>

          <Typography sx={{ fontWeight: 600, fontSize: "18px" }}>
            List View
            {/* all Licence requests for users view and action */}
          </Typography>

          <Grid container sx={{ my: 1, justifyContent: "space-between" }}>
            <Grid item xs={12} md={7.5} sm={12} xl={7.5}></Grid>
            {/* -----------------------Search Operation---------------------------------- */}
            <Grid item xs={12} md={3} sm={12} xl={3}>
              <SearchBar
                width={"300px !important"}
                border={"1px solid lightgray"}
                SearchData={(e) => handleSearchChange(e)}
              />
            </Grid>

            <Grid item sx={[DisplayFlex, { justifyContent: { xs: "left", md: "right" } }]} xs={12} md={1.5} sm={12} xl={1.5}>
              <CustomButton
                onClick={() => {
                  setshowlistpage(false);
                  setshoweditpage(false);
                  setshowformpage(true);
                }}
                label="Create"
                Icon="createIcon"
              />
            </Grid>
          </Grid>

          {/* code for Licence list table */}
          <React.Fragment>
            <JumboScrollbar
              autoHeight={true}
              autoHideTimeout={4000}
              autoHeightMin={AutoHeight(1.75)}
              autoHide={true}
              hideTracksWhenNotNeeded
              id="no-more-tables"
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#c7dfd4 !important",
                      // hide last border
                      "td, th": {
                        borderBottom: "1px solid #00000 !important",
                        height: "35px !important",
                        padding: "0px !important",
                        paddingX: "10px !important",
                        fontWeight: 600
                      },
                    }}
                  >
                    {/* Render table header cells based on FormHeader */}
                    {FormHeader &&
                      FormHeader?.map((columnKey, index) => (
                        <TableCell key={index} sx={{ backgroundColor: "#c7dfd4 !important", }}>{columnKey}</TableCell>
                      ))}
                    <TableCell sx={{ backgroundColor: "#c7dfd4 !important", }}>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* Render table rows based on FormList */}
                  {FormList?.length > 0 ?
                    FormList?.map((item, index) => (
                      <CRMTableRow key={index}>
                        {/* Render cells for each row */}
                        {Object.keys(item.data)?.map((dataKey) => (
                          <CRMTableCell key={dataKey}>
                            {/* Access data for each column from item.data */}
                            {item?.data[dataKey]}
                          </CRMTableCell>
                        ))}
                        <CRMTableCell>
                          <EditIcon
                            onClick={(e) => {
                              EditList(item);
                            }}
                          // color={Array.isArray(userRolePermissions) && userRolePermissions.includes(898) ? "#7ac6a4" : "gray"}
                          // disabled={Array.isArray(userRolePermissions) && userRolePermissions.includes(898) ? false : true}
                          />

                          <DeletedIcon
                            onClick={() => {
                              setSave(item);
                            }}
                          // color={Array.isArray(userRolePermissions) && userRolePermissions.includes(899) ? "#f07167" : "gray"}
                          // disabled={Array.isArray(userRolePermissions) && userRolePermissions.includes(899) ? false : true}
                          />
                        </CRMTableCell>
                      </CRMTableRow>
                    )) : (
                      <NoRecordsPage />
                    )}
                </TableBody>
              </Table>
            </JumboScrollbar>

            {/* Pagination code */}
            <CommonPagination
              totalPages={Math?.ceil(count / 10)}
              page={page}
              onChange={handleChangePage}
            />

          </React.Fragment>
        </Div>

        {/* delete a custom form */}
        <DialogBox
          Content={"Are you sure you want to delete this custom form?"}
          open={Boolean(save)}
          onClickNo={() => setSave(false)}
          onClickYes={DeleteList}
        />

        <Div sx={{ display: showeditpage ? "block" : "none" }}>
          <FormEdit
            setshowformpage={setshowformpage}
            setshowlistpage={setshowlistpage}
            setshoweditpage={setshoweditpage}
            prop={EditFormData}
            GetFormSTR={GetFormSTR}
          />
        </Div>

        <Div sx={{ display: showformpage ? "block" : "none" }}>
          <CFCreate
            setshowformpage={setshowformpage}
            setshowlistpage={setshowlistpage}
            setshoweditpage={setshoweditpage}
            GetFormSTR={GetFormSTR}
          />
        </Div>
      </JumboContentLayoutMain>
    </>
  );
};
export default CFList;

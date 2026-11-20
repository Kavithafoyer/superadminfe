import React, { useEffect, useState } from "react";
import { AutoHeight } from "app/redux/auth/localStorage";
import {
  Table,
  TableBody,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
} from "@mui/material";
import Div from "@jumbo/shared/Div";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain/JumboContentLayoutMain";
import "./stylesmodule.css";
import "formiojs/dist/formio.full.css";
import { makeStyles } from "@mui/styles";
import { CRMTableCell, CRMTableRow } from "../widgets/CRMTable";
import { componentTitle, DisplayFlex } from "../widgets/CRMStyles";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import {
  CommonPagination,
  DateFormatter,
  DeletedIcon,
  DialogBox,
  EditIcon,
  NoRecordsPage,
} from "../widgets/StylesComponents";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import SearchBar from "../widgets/SearchField";
import CustomTableHeader from "../widgets/CustomTableHeader";
import { useQuery } from "react-query";

const useStyles = makeStyles({
  fieldInSideToolbar: {
    // Add your custom styles for the fields in the side toolbar
    // For example:
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: "5px",
    margin: "5px",
    borderRadius: "4px",
  },
  // Add more styles as needed
});

const url = `https://safe-springs-353/06.herokuapp.com/api/formdata?cid=`;

const CustormFormList = () => {
  const [datas, setDatas] = useState([]);
  const [page, setPage] = useState(1);
  const [datasCount, setDatasCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  const { data: searchedProjects } = useQuery(
    ["searchedProjects", searchValue],
    () => fetchProjectsBySearch(searchValue),
    {
      enabled: !!searchValue,
      staleTime: Infinity,
    }
  );
  const {
    data: CustormForm,
    isLoading,
    isError,
    refetch: refetchCustormForm,
  } = useQuery(["projects", page], () => fetchCustormFormList(page), {
    enabled: !!page,
    staleTime: Infinity,
  });

  const token = localStorage.getItem("accesstoken");

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Created_Date", label: "Created Date", bool: true },
    { sort: "FormName", label: "Form Name", bool: true },
    { sort: "Is_Active", label: "Status", bool: true },
  ]);
  const [save, setSave] = useState("");

  const fetchCustormFormList = async (pageNum) => {
    const response = await axios.get(
      `${BASE_URL}/user/CustomizeFormAdditional/`,
      {
        params: {
          Is_Deleted: "False",
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    // console.log("CustormForm List ", response.data);
    return response.data;
  };

  const fetchProjectsBySearch = async (searchData) => {
    const response = await axios.get(`${BASE_URL}/user/ProjectSearch/`, {
      params: {
        search: searchData,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response?.data;
  };

  const handleDeleteCustormForm = async (id) => {
    const response = await axios.delete(`${BASE_URL}/user/CustomizeFormCRUD/`, {
      params: {
        id: id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (response?.data != null) {
      refetchCustormForm();
      setSave(false);
      window.location.reload();
    }
  };

  const handleChangeStatus = async (item) => {
    const payload = {
      id: item.id,
      FormName: item?.FormName,
      FormSTR: item?.FormSTR,
      Created_By: item?.Created_By,
      Created_Date: item?.Created_Date,
      Updated_Date: new Date().toISOString().slice(0, 10),
      Updated_By: item?.Updated_By,
      Is_Active: item?.Is_Active ? false : true,
      Is_Deleted: item?.Is_Deleted,
    };

    const response = await axios.put(
      `${BASE_URL}/user/CustomizeFormCRUD/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (response?.data?.id == item.id) {
      console.log("Updated ", response.data);
      refetchCustormForm();
      window.location.reload();
    }
  };

  useEffect(() => {
    if (Boolean(CustormForm)) {
      setDatas(CustormForm?.results);
      setDatasCount(CustormForm?.count);
    }
  }, [CustormForm]);

  useEffect(() => {
    if (Boolean(searchedProjects)) {
      setDatas(searchedProjects);
    } else {
      refetchCustormForm();
    }
  }, [searchedProjects]);

  return (
    <>
      <JumboContentLayoutMain>
        <Box>
          <Typography id="Typography-root" sx={[componentTitle]}>
            Customize Form List
          </Typography>

          <Grid container>
            <Grid item xs={9}></Grid>
            <Grid item xs={3}>
              <Box
                sx={[
                  DisplayFlex,
                  { justifyContent: "right", flexWrap: "wrap" },
                ]}
              >
                <SearchBar
                  width={"300px !important"}
                  border={"1px solid lightgray"}
                  // SearchData={(e)=>setSearchValue(e.target.value)}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ width: "100%", typography: "body1", mt: 1 }}>
          <JumboScrollbar
            autoHeight={true}
            autoHideTimeout={4000}
            autoHeightMin={AutoHeight(1.7)}
            autoHide={true}
            hideTracksWhenNotNeeded
            id="no-more-tables"
          >
            {datas?.length > 0 ? (
              <Table stickyHeader>
                <CustomTableHeader
                  headerMenuItems={columnMenuItems}
                  setHeadermenuItems={setColumnMenuItems}
                  sortDatas={datas}
                  setDatas={setDatas}
                />

                <TableBody>
                  {datas
                    ?.slice(
                      page === 1 ? page * 0 : (page - 1) * datasCount,
                      page === 1
                        ? page * 0 + datasCount
                        : (page - 1) * datasCount + datasCount
                    )
                    ?.map((item, index) => {
                      return (
                        <CRMTableRow>
                          <CRMTableCell data-title="Created Date">
                            <DateFormatter date={item?.Created_Date} />
                          </CRMTableCell>
                          <CRMTableCell
                            data-title="Form Name"
                            sx={{ cursor: "pointer" }}
                          >
                            {item?.FormName}
                          </CRMTableCell>
                          <CRMTableCell data-title="Status">
                            <ToggleButtonGroup
                              // color="primary"
                              // value={item?.Is_Active}
                              onChange={(e) => {
                                handleChangeStatus(item);
                              }}
                              aria-label="Platform"
                              sx={{ height: "30px" }}
                            >
                              <ToggleButton
                                sx={{
                                  color:
                                    item?.Is_Active === false
                                      ? "#10BBE5"
                                      : "grey",
                                  // backgroundColor: item?.Is_Active === false  ? 'lightgrey' : 'transparent'
                                }}
                                value="Disable"
                              >
                                Disable
                              </ToggleButton>

                              <ToggleButton
                                sx={{
                                  color: item?.Is_Active ? "#10BBE5" : "grey",
                                  // backgroundColor:item?.Is_Active === true ? 'lightgrey' : 'transparent'
                                }}
                                value="Enable"
                              >
                                Enable
                              </ToggleButton>
                            </ToggleButtonGroup>
                          </CRMTableCell>

                          <CRMTableCell
                            data-title="Action"
                            sx={[
                              {
                                display: "flex",
                                cursor: "pointer",
                                // mb: 1,
                                justifyContent: { xs: "left", md: "center" },
                              },
                            ]}
                          >
                            <DeletedIcon
                              onClick={() => {
                                setSave(item);
                              }}
                            />
                          </CRMTableCell>
                        </CRMTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            ) : (
              <NoRecordsPage title={"Customize Form"} />
            )}
          </JumboScrollbar>
        </Box>

        <Div
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {/* <Pagination
            color="success"
            count={Math?.ceil(datasCount / 10)}
            page={page}
            onChange={(e, newValue) => handleChangePage(e, newValue)}
            size="small"
            showFirstButton
            showLastButton
          /> */}
        </Div>

        {/* pagination */}
        <CommonPagination
          totalPages={Math?.ceil(datasCount / 10)}
          page={page}
          // onChange={handleChangePage}
        />

        {/* delete a custom form */}
        <DialogBox
          Content={"Are you sure you want to delete this custom form?"}
          open={Boolean(save)}
          onClickNo={() => setSave(false)}
          onClickYes={handleDeleteCustormForm.bind(this, save?.id)}
        />
      </JumboContentLayoutMain>
    </>
  );
};

export default CustormFormList;

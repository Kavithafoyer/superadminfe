import {
  Checkbox,
  Table,
  TableBody,
  TableHead,
  Typography,
  Pagination,
  Avatar,
  FormControlLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Div from "@jumbo/shared/Div/Div";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import { MailIcon } from "app/icons/PngIcons";
import "react-toastify/dist/ReactToastify.css";
import { CRMTableHead, Colors, FontStyle } from "app/pages/widgets/CRMStyles";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import { generateRandomColor } from "app/pages/widgets/CRMStyles";
import { memo } from "react";
import {
  AvatarCircle,
  CustomIcons,
  avatarColorFun,
} from "app/pages/widgets/StylesComponents";

const CallContactList = ({
  scrollHeight,
  setAllSelect,
  allSelectedMails,
  id,
  selectedUsers,
  setSelectedUsers,
}) => {
  // Getting the Contact List

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";

  //  For Pagination Table
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(10);
  const [colors, setColors] = useState([]);

  const [selectUsers, setSelectUsers] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const updateData = async (getId) => {
    try {
      const response1 = await axios.get(
        `${BASE_URL}/user/UserCallCenterListCRUD/?id=${getId}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response1?.data) {
        let select = [];
        let colors = [];
        response1.data?.results[0].Contact?.map((element) => {
          select.push({ user: element, checked: false });
          colors.push(generateRandomColor());
        });
        setSelectedUsers(select);
        setColors(colors);
        console.log("All selected", getId, select);
      }

      // setSelectedUsers(selectedUserss);
    } catch (error) {
      console.error("An error occurred:", error.message);
      // Handle the error as needed (e.g., show an error message to the user)
    }
  };

  // console.log("id", id[0]);

  // all selected
  const allSelectFunc = () => {
    let select = [...selectedUsers];
    select?.map((sel, index) => (select[index].checked = !allSelectedMails));
    setSelectedUsers(select);
    setAllSelect(!allSelectedMails);
  };

  // single selected
  const selectFunc = (item) => {
    let select = [...selectedUsers];
    let index = select?.findIndex(
      (select) => select?.user?.id === item?.user?.id
    );
    if (index !== -1) {
      select[index].checked = !select[index]?.checked;
    }
    let allSelected = selectedUsers?.every(
      (select) => select?.checked === true
    );
    console.log("checking checked2  ", select, index);
    if (allSelected) {
      setSelectedUsers(select);
      setAllSelect(true);
    } else {
      setAllSelect(false);
      setSelectedUsers(select);
    }
  };

  useEffect(() => {
    updateData(id);
  }, [id]);

  return (
    <Div>
      <JumboScrollbar
        autoHeight={true}
        autoHideTimeout={4000}
        autoHeightMin={"62vh"}
        autoHide={true}
        hideTracksWhenNotNeeded
        id="no-more-tables"
      >
        <Table className="table" sx={{ mt: 1.5 }}>
          <TableHead sx={[CRMTableHead, FontStyle]}>
            <CRMTableRow>
              <CRMTableCell>
                <FormControlLabel
                  sx={{ color: Colors?.Mblue }}
                  control={
                    <Checkbox
                      color="info"
                      checked={allSelectedMails}
                      onChange={allSelectFunc}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: Colors?.Mblue,
                        fontSize: FontStyle.fontSize,
                        fontWeight: FontStyle.fontWeight,
                      }}
                    >
                      Contact Name
                    </Typography>
                  }
                />
              </CRMTableCell>

              <CRMTableCell>Email</CRMTableCell>

              {/* <CRMTableCell><IconButton sx={[FontStyle, { padding: 0.5 }]}><SlRefresh size={16} color="red" /></IconButton></CRMTableCell> */}
            </CRMTableRow>
          </TableHead>
          <TableBody className="table-body" sx={{ mt: 2 }}>
            {selectedUsers
              ?.slice(
                page == 1 ? page * 0 : (page - 1) * count,
                page == 1 ? page * 0 + count : (page - 1) * count + count
              )
              ?.map((data, index) => {
                // let checked = selectedUsers?.find((emails) => emails?.user?.id == data?.user?.id)
                console.log("checked", index);
                let avatar = avatarColorFun(index);
                return (
                  <>
                    <CRMTableRow>
                      <CRMTableCell>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="info"
                              checked={data?.checked}
                              onChange={() => {
                                selectFunc(data);
                              }}
                            />
                          }
                          label={
                            <AvatarCircle
                              bgColor={avatar}
                              title={data?.user?.Name}
                              label={data?.user?.Name}
                            />
                          }
                        />
                      </CRMTableCell>

                      <CRMTableCell>
                        <Div
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Div>{CustomIcons?.mailIcon}</Div>
                          <Div>{data?.user?.Email_Id}</Div>
                        </Div>
                      </CRMTableCell>
                    </CRMTableRow>
                  </>
                );
              })}
          </TableBody>
        </Table>
      </JumboScrollbar>

      {/* code for pagination */}
      <Div
        sx={{
          display: Math?.ceil(selectedUsers?.length / count) ? "none" : "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Pagination
          color="success"
          count={Math?.ceil(selectedUsers?.length / count)}
          page={page}
          onChange={(e, newValue) => handleChangePage(e, newValue)}
          size="small"
          showFirstButton
          showLastButton
        />
      </Div>
    </Div>
  );
};

export default memo(CallContactList);

import React, { useCallback, useEffect, useState } from "react";
import useResponsive from "../hook/useResponsive";
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Badge,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { Search, SearchIconWrapper, StyledInputBase } from "../widgets/Search";
import { IoIosSearch } from "react-icons/io";
import { PiCheck } from "react-icons/pi";
import { IoCloseOutline } from "react-icons/io5";
import ChatElement from "../components/ChatElement";
import { toast } from "react-toastify";
import {
  dialogTitle,
  DisplayFlex,
  FontStyle,
} from "app/pages/widgets/CRMStyles";

import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import { Cancelbutton, CustomButton } from "app/pages/widgets/StylesComponents";
import { socket } from "app/services/auth-services";
import {
  useCreateRoomMutation,
  useAddParticipantMutation,
  useGetUserDropdownListQuery,
} from "app/services/RTKApis/Chat/ChatRTKQueryAPI";

const CreateGroups = ({ open, handleClose }) => {
  const { data: userDropdownList, isLoading: isUsersLoading } =
    useGetUserDropdownListQuery();
  const [createRoom] = useCreateRoomMutation();
  const [addParticipant] = useAddParticipantMutation();
  const [filteredParticipants, setFilteredParticipants] = useState([]);

  const [groupName, setGroupName] = useState("New Group");
  const [searchValue, setSearchValue] = useState("");
  const [selectPeople, setSelectPeople] = useState([]);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const theme = useTheme();

  const handleSelectPerson = useCallback(
    (select) => {
      const isDuplicate = selectPeople?.some((group) => group?.id === select?.id);
      if (select !== "") {
        if (isDuplicate) {
          setSelectPeople(selectPeople?.filter((group) => group?.id !== select?.id));
        } else {
          setSelectPeople([...selectPeople, select]);
        }
        setSearchValue("");
        setFilteredParticipants(userDropdownList || []);
      }
    },
    [selectPeople, userDropdownList]
  );

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    const searchTerm = val?.trim()?.toLowerCase();
    if (searchTerm) {
      const filtered = userDropdownList?.filter(
        (item) => item?.username?.toLowerCase()?.includes(searchTerm)
      );
      setFilteredParticipants(filtered || []);
    } else {
      setFilteredParticipants(userDropdownList || []);
    }
  };

  useEffect(() => {
    if (userDropdownList) setFilteredParticipants(userDropdownList);
  }, [userDropdownList]);

  const UserId = localStorage.getItem("UserId");

  const handleSubmit = async () => {
    const roomPayload = { name: groupName, room_type: "group", created_by: UserId, is_active: true };
    try {
      const roomResponse = await createRoom(roomPayload).unwrap();
      if (roomResponse && roomResponse.id) {
        const participantPromises = selectPeople.map((person) => {
          return addParticipant({ room: roomResponse.id, user: person.id, is_admin: false, is_muted: false }).unwrap();
        });
        participantPromises.push(addParticipant({ room: roomResponse.id, user: UserId, is_admin: true, is_muted: false }).unwrap());
        await Promise.all(participantPromises);
        socket.emit("ChatUserGroupList", { id: UserId });
        toast.success("Group created successfully!");
        handleClose();
      }
    } catch (error) {
      console.error("Error creating room/participants:", error);
      toast.error("Failed to create group.");
    }
  };

  return (
    <>
      <Box sx={{ position: "relative", minHeight: "300px", height: "100%", width: "100%", backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background.paper, boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)" }}>
        <Stack px={2} pb={2} spacing={2} sx={{ maxHeight: "95vh", minHeight: "300px" }}>
          <Stack pt={3} alignItems={"center"} justifyContent="space-between" direction="row">
            <Typography sx={{ fontSize: "16px" }}>{groupName}</Typography>
            <Stack direction={"row"} alignItems="center" spacing={1}>
              <IconButton disabled={groupName === ""} onClick={() => { if (selectPeople?.length > 0) { setIsOpenDialog(true); } else { toast.error("Select at least one person"); } }} sx={{ width: "max-content" }}>
                <PiCheck color={groupName === "" ? "gray" : "green"} size={20} />
              </IconButton>
              <IconButton onClick={handleClose} sx={{ width: "max-content" }}>
                <IoCloseOutline size={21} color="tomato" />
              </IconButton>
            </Stack>
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <Search sx={{ height: "35px" }}>
              <SearchIconWrapper><IoIosSearch color="#709CE6" size={18} /></SearchIconWrapper>
              <StyledInputBase sx={[FontStyle, { ml: 4, mt: 1, color: "gray" }]} onChange={handleSearch} value={searchValue} placeholder="Search…" inputProps={{ "aria-label": "search" }} />
            </Search>
          </Stack>
          {selectPeople?.length > 0 && (
            <JumboScrollbar autoHeight={true} autoHideTimeout={4000} autoHeightMin={"60px"} autoHide={true} hideTracksWhenNotNeeded>
              <Div sx={[DisplayFlex, { paddingY: 1, mr: 2, gap: 1 }]}>
                {selectPeople?.map((items, idx) => (
                  <Stack key={idx} sx={{ mx: 0.5 }}>
                    <Badge onClick={() => handleSelectPerson(items)} badgeContent={<IoCloseOutline color="white" style={{ backgroundColor: "tomato", borderRadius: "50%" }} />} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                      <Div sx={[DisplayFlex, { justifyContent: "center" }]}><Avatar sx={{ fontSize: "10px", width: "35px", height: "35px", cursor: "pointer" }}>{items?.username?.substring(0, 2)?.toUpperCase()}</Avatar></Div>
                    </Badge>
                    <Typography sx={{ fontSize: "8px", textAlign: "center" }}>{items?.username?.slice(0, 6)}{items?.username?.length > 7 && "..."}</Typography>
                  </Stack>
                ))}
              </Div>
            </JumboScrollbar>
          )}
          <Typography sx={[FontStyle, { color: "#676667" }]}>All Peoples</Typography>
          <JumboScrollbar autoHeight={true} autoHideTimeout={4000} autoHeightMin={"58vh"} autoHide={true} hideTracksWhenNotNeeded>
            {filteredParticipants?.map((user) => {
              let check = selectPeople?.some((che) => che?.id === user?.id);
              if (!user?.Group_Name) {
                return <Div key={user.id} sx={{ my: 1 }}><ChatElement user={user} check={check} createGroup={"create group"} handleSelectPerson={handleSelectPerson} /></Div>;
              }
              return null;
            })}
          </JumboScrollbar>
        </Stack>
      </Box>

      <Dialog fullWidth maxWidth="xs" open={isOpenDialog} onClose={() => setIsOpenDialog(false)}>
        <DialogTitle sx={[DisplayFlex, dialogTitle]}>Create New Group</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography sx={[FontStyle]}>Group Name</Typography>
          <FormControl sx={{ width: "100%", height: "40px" }}>
            <OutlinedInput value={groupName} onChange={(e) => { const val = e.target.value; if (val.length <= 10) setGroupName(val); else toast.error("Max 10 chars"); }} placeholder="Enter group name" fullWidth sx={{ height: "40px", color: "gray", fontSize: "14px" }} />
          </FormControl>
          <div style={{ marginTop: 10 }}>
            <Typography sx={[FontStyle]}>Participants</Typography>
            <JumboScrollbar autoHeight={true} autoHideTimeout={4000} autoHeightMax={"300px"} autoHide={true} hideTracksWhenNotNeeded>
              {selectPeople?.map((use) => <ChatElement createGroup="create group" user={use} person={"person"} key={use?.id} />)}
            </JumboScrollbar>
          </div>
        </DialogContent>
        <DialogActions sx={{ my: 1 }}>
          <CustomButton label="Create" onClick={handleSubmit} />
          <Cancelbutton label="Cancel" onClick={() => setIsOpenDialog(false)} />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateGroups;

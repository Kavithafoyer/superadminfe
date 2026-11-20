import {
  Avatar,
  Box,
  Dialog,
  Grid,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import { Colors, FontStyle } from "../../../widgets/CRMStyles";
import {
  AvatarCircle,
  formatDate,
  htmlToText,
} from "../../../widgets/StylesComponents";
import React, { memo, useState } from "react";
import { HiOutlineUserGroup } from "react-icons/hi2";
import ChatElement from "../ChatElement";
import { useChatContext } from "../../context/Chatcontext";
import {
  useGetParticipantsQuery,
  useDeleteParticipantMutation,
} from "../../../../services/RTKApis/Chat/ChatRTKQueryAPI";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import JumboConfirmDialog from "@jumbo/components/JumboConfirmDialog";
import Div from "@jumbo/shared/Div";

const ProfileInfo = ({ open, setOpen }) => {
  const { selectedRoom } = useChatContext();
  const [tab, setTab] = useState(0);
  const [deleteParticipant] = useDeleteParticipantMutation();
  const { data: participantsList, isLoading: isParticipantsLoading } =
    useGetParticipantsQuery(selectedRoom?.id, { skip: !selectedRoom?.id });
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [participantToRemove, setParticipantToRemove] = useState(null);
  const UserId = localStorage.getItem("UserId");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const avatarSrc = selectedRoom?.Participant_Photo || selectedRoom?.User_Photo;

  const profile = () => (
    <Box className=" p-2 ">
      <Div className="flex items-center justify-center mt-6">
        <Div>
          <Avatar
            alt={selectedRoom?.name?.substring(0, 1)}
            src={avatarSrc}
            onClick={() => setLightboxOpen(true)}
            sx={{ width: 100, height: 100, boxShadow: 3, cursor: avatarSrc ? "zoom-in" : "default" }}
          />
          <Typography sx={{ fontSize: "16px" }} className="text-center mt-1 font-bold">{selectedRoom?.room_name || selectedRoom?.name}</Typography>
        </Div>
      </Div>
      <Div className="mt-2">
        <Grid container spacing={1}>
          {selectedRoom?.email && (
            <Grid item xs={12}>
              <Div className="bg-[#f9f9f9] p-1 my-1 ">
                <Typography sx={{ fontSize: "14px" }}>E-mail</Typography>
                <Typography sx={{ fontSize: "14px " }} className=" mt-1 ">{selectedRoom?.email}</Typography>
              </Div>
            </Grid>
          )}
          {selectedRoom?.PhoneNo && (
            <Grid item xs={12}>
              <Div className="bg-[#f9f9f9] p-1 my-1 ">
                <Typography sx={{ fontSize: "14px" }}>Phone Number</Typography>
                <Typography sx={{ fontSize: "14px " }} className=" mt-1 ">{selectedRoom?.PhoneNo}</Typography>
              </Div>
            </Grid>
          )}
          <Grid item xs={12}>
            <Div className="bg-[#f9f9f9] p-1 my-1">
              <Typography sx={{ fontSize: "14px" }}>Designation</Typography>
              <Typography sx={{ fontSize: "14px " }} className=" mt-1 ">{selectedRoom?.Designation || "No Designation"}</Typography>
            </Div>
          </Grid>
          <Grid item xs={12}>
            <Div className="bg-[#f9f9f9] p-1 my-1 ">
              <Typography sx={{ fontSize: "14px" }}>Created Date</Typography>
              <Typography sx={{ fontSize: "14px " }} className=" mt-1 ">{formatDate(selectedRoom?.created_at) || "-"}</Typography>
            </Div>
          </Grid>
        </Grid>
      </Div>
    </Box>
  );

  const groupMembers = () => (
    <Box className="w-full p-2 h-[449px] overflow-y-auto">
      <Typography sx={{ fontSize: "14px" }}>Total Members ({selectedRoom?.Participant_List?.length || 1})</Typography>
      <Div className="mt-2">
        {!isParticipantsLoading && participantsList?.length > 0 ? (
          participantsList.map((participant) => {
            const isCurrentUser = Number(participant.user?.id) === Number(UserId);
            return (
              <Box key={participant.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 1 }}>
                <ChatElement avatarSize={"35px"} user={{ ...participant.user, username: participant.user?.username || "Unknown" }} person={"person"} />
                {!isCurrentUser && (
                  <IconButton size="small" color="error" onClick={() => { setParticipantToRemove(participant); setOpenDeleteDialog(true); }}>
                    <IoMdClose size={18} />
                  </IconButton>
                )}
              </Box>
            );
          })
        ) : (
          <Typography variant="body2" sx={{ p: 2, textAlign: "center" }}>{isParticipantsLoading ? "Loading members..." : "No members found"}</Typography>
        )}
      </Div>
    </Box>
  );

  return (
    <>
      <Popover open={Boolean(open)} anchorEl={open} onClose={() => setOpen(null)} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        <Box className="flex w-[400px] h-[450px] ">
          <Div className="w-12 p-2 h-full flex justify-center bg-gray-100">
            <Div>
              <IconButton onClick={() => setTab(0)}><AvatarCircle size="25px" bgColor={tab === 0 ? Colors?.Mblue : "transparent"} /></IconButton>
              {selectedRoom?.room_type === "group" && (
                <IconButton onClick={() => setTab(1)}><HiOutlineUserGroup style={{ fontSize: "25px", backgroundColor: tab === 1 ? Colors?.lightSkyBlueV2 : "lightgray", color: tab === 1 ? "white" : "inherit", padding: "4px", borderRadius: "50%" }} /></IconButton>
              )}
            </Div>
          </Div>
          <Div className="w-full h-full">{tab === 0 ? profile() : groupMembers()}</Div>
        </Box>
      </Popover>
      <JumboConfirmDialog open={openDeleteDialog} title="Remove Member" message={`Are you sure you want to remove ${participantToRemove?.user?.username || "this member"}?`} onConfirm={async () => { if (participantToRemove) { try { await deleteParticipant(participantToRemove.id).unwrap(); toast.success("Member removed"); } catch { toast.error("Failed"); } } }} onClose={() => setOpenDeleteDialog(false)} />
      <Dialog open={lightboxOpen} onClose={() => setLightboxOpen(false)} maxWidth="md"><img src={avatarSrc} alt="Full size" style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 8, objectFit: "contain" }} /></Dialog>
    </>
  );
};

export default memo(ProfileInfo);

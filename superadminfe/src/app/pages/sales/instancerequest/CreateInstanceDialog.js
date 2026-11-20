import React from "react";
import { DialogContent } from "@mui/material";
import { Dragabledialog } from "app/pages/widgets/StylesComponents";
import CreateInstance from "./CreateInstance";

const CreateInstanceDialog = ({
  open,
  onClose,
  setCreateInstance,
  getinstancerequestrecords,
}) => {
  return (
    <Dragabledialog
      maxWidth="lg"
      open={open}
      title={
        open === "create" ? "Create Instance Request" : "Edit Instance Request"
      }
      onClose={() => onClose(false)}
    >
      <DialogContent sx={{ p: 1 }}>
        <CreateInstance
          type={open === "create" ? "post" : "put"}
          setListInstance={onClose}
          datas={open !== "create" && open}
          setCreateInstance={setCreateInstance}
          getinstancerequestrecords={getinstancerequestrecords}
        />
      </DialogContent>
    </Dragabledialog>
  );
};

export default CreateInstanceDialog;

import React from "react";
import { DialogContent } from "@mui/material";
import { Dragabledialog } from "app/pages/widgets/StylesComponents";
import CreateInstance from "./CreateInstance";

const CreateInstanceDialog = ({
  open,
  onClose,
  setCreateInstance,
  getAllDatas,
}) => {
  return (
    <Dragabledialog
      maxWidth="lg"
      open={Boolean(open)}
      title="Create Instance"
      onClose={() => onClose(false)}
    >
      <DialogContent sx={{ p: 1 }}>
        <CreateInstance
          createInstance={open}
          setCreateInstance={onClose}
          setListInstance={() => {
            onClose(false);
            if (getAllDatas) getAllDatas();
          }}
        />
      </DialogContent>
    </Dragabledialog>
  );
};

export default CreateInstanceDialog;

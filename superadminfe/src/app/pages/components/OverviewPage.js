import React, { Fragment, memo, useEffect, useState } from "react";
import {
  Cancelbutton,
  CustomButton,
  Customgrid,
  CustomIcon,
  Div,
  Dragabledialog,
  formatDate,
} from "../widgets/StylesComponents";
import {
  Box,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { DisplayFlex, dialogFontSize, input_label } from "../widgets/CRMStyles";
import { Dataset } from "@mui/icons-material";

function OverviewPage({
  datas,
  sx = {},
  onClose,
  open,
  setOpen,
  label,
  maxWidth = "lg",
}) {
  console.log("Overview", datas);
  return (
    <Dragabledialog onClose={onClose} open={open} maxWidth={maxWidth}>
      <DialogTitle
        sx={[DisplayFlex, dialogFontSize, { justifyContent: "space-between" }]}
        style={{ cursor: "move" }}
        id="draggable-dialog-title"
      >
        {label}
        <CustomIcon Icon={"closeIcon"} onClick={onClose} />
      </DialogTitle>
      <DialogContent sx={{ height: "100%" }}>
        <Grid container spacing={1} sx={{ padding: 3 }}>
          {Object?.keys(datas)?.length > 0 &&
            Object?.keys(datas)?.map((key, i) => {
              return (
                <>
                  <Grid item key={i} xs={12} md={2.4} sx={{ marginY: 1 }}>
                    <Typography sx={[input_label, sx]}>{key}</Typography>
                  </Grid>
                  <Grid item key={i} xs={0} md={0.6} sx={{ marginY: 1 }}>
                    :
                  </Grid>
                  <Grid
                    className=""
                    sx={{ marginY: 1 }}
                    item
                    key={i}
                    xs={12}
                    md={3}
                  >
                    <Typography sx={[input_label, sx]}>
                      {Boolean(datas[key]) ? datas[key] : " - "}
                    </Typography>
                  </Grid>
                </>
              );
            })}
        </Grid>
        <Div
          className="flex items-center justify-center pt-6"
          // sx={{ marginTop: "40px" }}
        >
          <Cancelbutton label="Close" onClick={() => setOpen(false)} />
        </Div>
      </DialogContent>
    </Dragabledialog>
  );
}

export default memo(OverviewPage);

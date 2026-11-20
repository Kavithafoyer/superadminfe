import {
  Autocomplete,
  Box,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import {
  dialogTitle,
  DisplayFlex,
  input_label,
} from "app/pages/widgets/CRMStyles";
import {
  Cancelbutton,
  CustomButton,
  Customgrid,
  Div,
  Dragabledialog,
  errorFilter,
} from "app/pages/widgets/StylesComponents";
import { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ReminderMe = ({
  isReminder,
  setIsReminder,
  reminderFields,
  setReinderFields,
  type = "Create",
  prevData = null,
}) => {
  const [repeat, setRepeat] = useState(false);
  const submit = () => {
    let error = errorFilter({
      ...reminderFields,
      repeatedDuarationLength: !Boolean(repeat)
        ? true
        : reminderFields?.repeatedDuarationLength > 0,
      selectedRepeatDuration: !Boolean(repeat)
        ? true
        : reminderFields?.selectedRepeatDuration,
    });

    if (Object.keys(error).length > 0) {
      toast.warning(
        ` This fields are invalid ${Object.keys(error)?.map((field) => field)}`
      );
    } else {
      setIsReminder(false);
    }
  };

  useEffect(() => {
    if (reminderFields?.repeatedDuarationLength > 0) {
      setRepeat(true);
    }
  }, [reminderFields]);
  return (
    <>
      <Dragabledialog
        open={isReminder}
        onClose={() => setIsReminder(false)}
        maxWidth={"md"}
        title="Reminder"
      >
        <DialogContent>
          <Box mt={2} sx={{ height: "200px !important" }}>
            <Customgrid columnCount={4}>
              <Grid item colSpan={4}>
                <Typography sx={[input_label]}>
                  First Reminder Before Due
                </Typography>
              </Grid>

              <Grid item sx={{ display: "flex" }} colSpan={8} gap={2}>
                <Div>
                  <TextField
                    className="w-full input-box2"
                    sx={{ width: "360px !important" }}
                    id="outlined-basic"
                    type="number"
                    variant="outlined"
                    placeholder="Enter Duration length"
                    value={reminderFields?.durationLength}
                    onChange={(e) => {
                      setReinderFields((prev) => ({
                        ...prev,
                        durationLength: e.target.value,
                      }));
                    }}
                  />
                </Div>
                <Div>
                  <Autocomplete
                    className="w-full search-select3"
                    sx={{ width: "100px !important" }}
                    options={["Days", "Hrs", "Mins"]}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option) {
                        return option;
                      }
                      return "";
                    }}
                    value={reminderFields?.selectDuration || null}
                    onChange={(e, newValue) => {
                      setReinderFields((prev) => ({
                        ...prev,
                        selectDuration: newValue,
                      }));
                      // functiondate(newValue)
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Duration day/hrs/mins"
                      />
                    )}
                  />
                </Div>
              </Grid>

              <Grid item colSpan={4}>
                <FormGroup
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="info"
                        onClick={() => {
                          if (Boolean(repeat)) {
                            setRepeat(false);
                          } else {
                            setRepeat(true);
                          }
                        }}
                        checked={repeat}
                      />
                    }
                    label={
                      <Typography sx={[input_label]}>Repeat Every</Typography>
                    }
                  />
                </FormGroup>
              </Grid>

              <Grid item sx={{ display: "flex" }} colSpan={8} gap={2}>
                <Div>
                  <TextField
                    className="w-full input-box2"
                    sx={{ width: "360px !important" }}
                    id="outlined-basic"
                    variant="outlined"
                    type="number"
                    disabled={!repeat}
                    placeholder="Enter repeated duration length"
                    value={reminderFields?.repeatedDuarationLength}
                    onChange={(e) => {
                      setReinderFields((prev) => ({
                        ...prev,
                        repeatedDuarationLength: e.target.value,
                      }));
                    }}
                  />
                </Div>
                <Div>
                  <Autocomplete
                    className="w-full search-select3"
                    sx={{ width: "100px !important" }}
                    options={["Hrs", "Mins"]}
                    disabled={!repeat}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option) {
                        return option;
                      }
                      return "";
                    }}
                    value={reminderFields?.selectedRepeatDuration || null}
                    onChange={(e, newValue) => {
                      setReinderFields((prev) => ({
                        ...prev,
                        selectedRepeatDuration: newValue,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select duration hrs/min"
                      />
                    )}
                  />
                </Div>
              </Grid>

              <Grid item colSpan={4}>
                <Typography
                  //   id="Typography-root"
                  sx={[input_label]}
                >
                  Reminder Message
                </Typography>
              </Grid>

              <Grid item colSpan={8}>
                <Div>
                  <TextField
                    className="w-full"
                    id="outlined-basic"
                    variant="outlined"
                    multiline
                    rows={3}
                    placeholder="Enter the content "
                    sx={{
                      fontSize: "14px !important",
                      backgroundColor: "#ffffff !important",
                      // font-size: 14px !important;

                      // line-height: 38px !important;
                      // background-color: #ffffff !important;
                    }}
                    value={reminderFields?.content || null}
                    onChange={(e) => {
                      setReinderFields((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }));
                    }}
                  ></TextField>
                  {/* <CustomCKEditor
                    initData={editorContent}
                    onChange={(evt) => ckEditorOnchange(evt, setEditorContent)}
                  /> */}
                </Div>
              </Grid>
            </Customgrid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Div
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
              mt: 2,
            }}
          >
            <CustomButton
              label="Save"
              Icon="saveIcon"
              onClick={() => {
                submit();
              }}
            />

            {/* {type === "Edit" && ( */}
            <Cancelbutton
              onClick={() => {
                // if (Boolean(prevData)) {
                //   setReinderFields({
                //     durationLength: Number(
                //       prevData?.RemainderDueDate?.split(" ")[0]
                //     ),
                //     selectDuration: prevData?.RemainderDueDate?.split(" ")[1],
                //     repeatedDuarationLength: Number(
                //       prevData?.Repeat_EveryDay?.split(" ")[0]
                //     ),
                //     selectedRepeatDuration:
                //       prevData?.Repeat_EveryDay?.split(" ")[1],
                //     content: prevData?.RemainderMessage,
                //   });
                // }
                if (Boolean(prevData) || type === "Edit") {
                  setReinderFields({
                    durationLength: Number(
                      prevData?.RemainderDueDate?.split(" ")[0]
                    ),
                    selectDuration: prevData?.RemainderDueDate?.split(" ")[1],
                    repeatedDuarationLength: Number(
                      prevData?.Repeat_EveryDay?.split(" ")[0]
                    ),
                    selectedRepeatDuration:
                      prevData?.Repeat_EveryDay?.split(" ")[1],
                    content: prevData?.RemainderMessage,
                    reminderflag: prevData?.id ? true : false,
                  });
                } else {
                  setReinderFields({
                    durationLength: "",
                    selectDuration: "",
                    repeatedDuarationLength: "",
                    selectedRepeatDuration: "",
                    content: "",
                    reminderflag: false,
                  });
                }
                setIsReminder(false);
              }}
            />
            {/* )} */}

            {/* {
              <Cancelbutton
                label={type === "Edit" ? "Remove" : "Cancel"}
                Icon="closeIcon"
                onClick={() => {
                  setIsReminder(false);
                  setReinderFields({
                    durationLength: "",
                    selectDuration: "",
                    repeatedDuarationLength: "",
                    selectedRepeatDuration: "",
                    content: "",
                  });
                }}
              />
            } */}
          </Div>
          {/* <Button onClick={() => handleDialogClose(false)}>Cancel</Button>
                <Button onClick={() => handleDialogClose(true)} color="primary">OK</Button> */}
        </DialogActions>
      </Dragabledialog>
    </>
  );
};

export default memo(ReminderMe);

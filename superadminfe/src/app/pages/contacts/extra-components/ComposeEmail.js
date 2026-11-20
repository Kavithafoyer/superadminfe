import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import {
  DisplayFlex,
  input_label,
  dialogFontSize,
  FontStyle,
  Colors,
} from "app/pages/widgets/CRMStyles";
import { Grid, TextField, Typography, alpha } from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Cancelbutton,
  CustomButton,
  Customgrid,
  Div,
  errorFilter,
  TextEditor,
} from "app/pages/widgets/StylesComponents";
import { IoMdAttach, IoMdClose } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { contactSendEmailSubmit } from "./APIs";
import { BASE_URL } from "app/services/auth-services";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

function ComposeEmail({
  setOpen,
  label = "Send Mail",
  data,
  setOpenSendMail,
  endpoint,
  extraPayload,
  getData
}) {
  // console.log("datasssss", data);
  const [fields, setFields] = React.useState({
    Cc: "",
    Subject: "",
  });
  const [content, setContent] = React.useState(data?.Content ?? "");
  const [errors, setErrors] = React.useState({});

  const handleClose = () => {
    setOpen("email");
  };

  // const handleEditorChange = (textContent) => {
  //   setContent(textContent);
  // };

  const handleEditorChange = (event, editor) => {
    const value = editor.getData();
    // const parser = new DOMParser();
    // const doc = parser.parseFromString(value, "text/html");
    // const textContent = doc.body.textContent || "";
    setContent(value);
  };

  // mail file attachments
  const [base64DataList, setBase64DataList] = React.useState([]);
  const [fileNames, setFileNames] = React.useState([]);

  const handleFileInputChange = (e) => {
    const fileList = e.target.files;

    const promises = Array.from(fileList).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };

        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((base64DataArray) => {
        const fileArray = Array.from(fileList);
        let list = [...fileNames, ...fileArray];
        setBase64DataList([...base64DataList, base64DataArray]?.flat());
        setFileNames(list);
        console.log(
          "success reading files:",
          [...base64DataList, base64DataArray]?.flat()
        );
      })
      .catch((error) => {
        console.error("Error reading files:", error);
      });
  };

  const fileRemoved = (e) => {
    let list = [...fileNames];
    list?.splice(e, 1);
    let base64Array = [...base64DataList];
    base64Array?.splice(e, 1);
    setBase64DataList(base64Array);
    // alert(e)
    setFileNames(list);
  };

  // < --------------------------------------- submit function -------------------------------- >
  const handleSubmit = () => {
    const { Cc, ...restFields } = fields;
    let payload = {
      ...restFields,
      From: JSON.parse(localStorage.getItem("UserDetails"))?.email,
      To: data?.Email_Id ?? data?.EmailId ?? data?.Mail ?? "",
      content,
      id: data?.id,
    };
    let error = errorFilter(payload);
    setErrors(error);

    if (Object.keys(error).length == 0) {
      console.log("fileNames", base64DataList);
      contactSendEmailSubmit(
        payload,
        setOpenSendMail,
        base64DataList,
        fileNames,
        endpoint,
        extraPayload,
        getData
      );
      setOpen(false);
    } else if (!Boolean(data?.id)) {
      toast.error(error?.meesage, {
        position: "top-right",
        autoClose: 2000,
      });
    }
    console.log("toast", error);
  };

  React.useEffect(() => {
    if (label?.toLocaleLowerCase() === "send mail") {
      setFields({
        Cc: data?.Cc || "",
        Subject: data?.Subject,
      });
      setContent(data?.Content);
    }
  }, [data]);

  const cancelFunc = () => {
    if (label === "Send Mail") {
      if (
        Boolean(fields.Cc?.trim()) ||
        Boolean(fields?.Subject?.trim()) ||
        fileNames?.length > 0 ||
        Boolean(content?.trim())
      ) {
        setOpen("email");
      } else {
        setOpenSendMail(false);
      }
    } else {
      if (
        fields?.Cc?.trim() === data?.Cc &&
        fields?.Subject?.trim() === data?.Subject &&
        content?.trim() === data?.Content
      ) {
        setOpenSendMail(false);
      } else {
        setOpen("email");
      }
    }
  };

  console.log("data : mail : ", data);

  return (
    <React.Fragment>
      {/* <ToastContainer /> */}
      <DialogTitle
        sx={[DisplayFlex, dialogFontSize]}
        style={{ cursor: "move" }}
        id="draggable-dialog-title"
      >
        Compose Email
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ pt: 2 }}>
          <Customgrid>
            <Grid item>
              <Typography sx={[input_label]}>From</Typography>
            </Grid>
            <Grid item>
              <Typography sx={[FontStyle]}>
                {JSON.parse(localStorage.getItem("UserDetails"))?.email}
              </Typography>
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>To</Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                type="email"
                disabled
                // multiline={true}
                value={data?.Email_Id || data?.EmailId || data?.Mail}
                // onChange={(e) => setFields({ ...fields, To: e.target.value })}
              />
              {errors?.Email_Id ||
                (errors?.EmailId && (
                  <Div style={{ color: "red" }}>
                    Email id {errors?.Email_Id || errors?.EmailId}
                  </Div>
                ))}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>Cc</Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={fields?.Cc}
                type="email"
                onChange={(e) => setFields({ ...fields, Cc: e.target.value })}
              />
              {errors?.Cc && (
                <Div style={{ color: "red" }}>Cc {errors?.Cc}</Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>Subject</Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={fields?.Subject}
                onChange={(e) =>
                  setFields({ ...fields, Subject: e.target.value })
                }
              />
              {errors?.Subject && (
                <Div style={{ color: "red" }}>Subject {errors?.Subject}</Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>Attachments</Typography>
            </Grid>

            <Grid item>
              <input
                type="file"
                style={{ display: "none" }}
                id="attachedFiles"
                multiple
                onChange={handleFileInputChange}
              />
              <Div sx={[DisplayFlex, { justifyContent: "space-between" }]}>
                <label
                  htmlFor="attachedFiles"
                  style={{
                    cursor: "pointer",
                    // padding: "12px ",
                    color: Colors?.Mblue + " !important",
                  }}
                >
                  <Typography
                    sx={[input_label, { color: Colors?.Mblue + " !important" }]}
                  >
                    Browse <IoMdAttach style={{ fontSize: 20 }} />
                  </Typography>
                </label>
                <Typography sx={[input_label]}>
                  {fileNames?.length} Files Attached
                </Typography>
              </Div>

              <Div
                sx={{
                  border: fileNames?.length > 0 && "1px solid lightgray",
                  borderRadius: "5px",
                  my: fileNames?.length === 0 && 2,
                }}
              >
                <Div
                  sx={[
                    DisplayFlex,
                    {
                      flexWrap: "wrap",
                      gap: "10px !important",
                      p: Boolean(fileNames?.length > 0) ? 1 : 0,
                    },
                  ]}
                >
                  {fileNames?.map((file, index) => {
                    console.log("image", file, base64DataList[index]);
                    return (
                      <div
                        id="attachedFile"
                        key={index}
                        style={{ position: "relative" }}
                      >
                        <Div sx={{ width: 70, height: 90 }}>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`File ${index + 1}`}
                            width={70}
                            height={70}
                          />
                          <p>
                            {file?.name?.length > 10
                              ? file?.name?.substring(0, 10) + "..."
                              : file?.name}
                          </p>
                        </Div>
                        <Div
                          id="attachedRemove"
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            backgroundColor: alpha("#000", 0.2),
                          }}
                        >
                          <Typography
                            id="Typography-root"
                            onClick={() => fileRemoved(index)}
                            sx={[
                              {
                                fontSize: "11px",
                                color: "tomato !important",
                                cursor: "pointer",
                              },
                            ]}
                          >
                            <IoMdClose
                              style={{ fontSize: 18, color: "tomato" }}
                            />
                          </Typography>
                        </Div>
                      </div>
                    );
                  })}
                </Div>
              </Div>
            </Grid>

            <Grid item alignSelf={"flex-start"}>
              <Typography sx={[input_label]}>Content</Typography>
            </Grid>

            <Grid item>
              {/* <TextEditor value={content} onChange={handleEditorChange} /> */}

              <CKEditor
                editor={ClassicEditor}
                content={content}
                data={content}
                onChange={(event, editor) => {
                  handleEditorChange(event, editor);
                }}
              />

              {errors?.content && (
                <Div style={{ color: "red" }}>Content {errors?.content}</Div>
              )}
            </Grid>
          </Customgrid>
        </DialogContentText>
        <DialogActions sx={[DisplayFlex, { justifyContent: "center" }]}>
          <CustomButton
            label="Compose Mail"
            width={"140px"}
            Icon="sendIcon"
            onClick={handleSubmit}
          />
          <Cancelbutton label="Cancel" onClick={cancelFunc} />
        </DialogActions>
      </DialogContent>
    </React.Fragment>
  );
}
export default React.memo(ComposeEmail);

import { keyframes, styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import { purple, grey, red, orange } from "@mui/material/colors";
import useMediaQuery from "@mui/material/useMediaQuery";
import { memo, useEffect, useState } from "react";
import * as React from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  Grow,
  IconButton,
  InputAdornment,
  Pagination,
  Popper,
  Skeleton,
  Table,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import { TiEdit } from "react-icons/ti";
import {
  MdArrowDropDown,
  MdCalendarToday,
  MdCall,
  MdChat,
  MdDelete,
  MdKeyboardDoubleArrowRight,
  MdMoreVert,
  MdUpdate,
} from "react-icons/md";
import {
  AvatarFont,
  Colors,
  DisplayFlex,
  FontStyle,
  avatarColors,
  colorCode,
  dialogFontSize,
  dialogheading,
} from "./CRMStyles";
import { IoMdClose, IoMdPrint } from "react-icons/io";
import {
  IoCheckmark,
  IoCloudDownloadOutline,
  IoCloudUpload,
  IoCloudUploadOutline,
} from "react-icons/io5";
import { TiCancel } from "react-icons/ti";
import { IoMdSend } from "react-icons/io";
import { format } from "date-fns";
import { BsFilterLeft } from "react-icons/bs";

// import loadingpage from "../../assets/images/loading/Bars_loader.gif";
// import mail_sending from "../../assets/images/loading/mail_sending.gif";
// import mail_success from "../../assets/images/loading/mail_success.gif";

import { useQueryClient } from "react-query";
import { CiWarning } from "react-icons/ci";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { GrFormView } from "react-icons/gr";
import { MailIcon } from "app/icons/PngIcons";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";

import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import ReactQuill from "react-quill";
import { Empty, notification } from "antd";

import { VscPreview } from "react-icons/vsc";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import styledComponents from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import fetchDateFormater, {
  selectedDateFormat,
} from "app/redux/actions/fetchDateFormater";
import { AutoHeight } from "app/redux/auth/localStorage";
import { toast } from "react-toastify";

export const capitalizeWords = (str) => {
  return str?.toLowerCase()?.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
};

export const Div = styled("div")({});
// ---------------------------------------Vijay------------------------//

export const formatKey = (key = "") => {
  console.log("formatKey");
  return key
    ?.replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char?.toUpperCase());
};

export const formatIndianNumber = (number) => {
  if (isNaN(number)) {
    return 0; // Return a message for invalid input
  }
  const numericValue = parseFloat(number);
  // const roundedValue = new Intl.NumberFormat('en-IN').format(numericValue);
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(
    numericValue,
  );
};

export const CellNoborder = styled(TableCell)(({ theme }) => ({
  border: "none !important",
}));
export const TableNoborder = styled(Table)(({ theme }) => ({
  border: "none !important",
}));
export const TableRowNoborder = styled(TableRow)(({ theme }) => ({
  border: "none !important",
}));

export const formatNumberSuffix = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return "0";
  }
  if (num < 1000) {
    return num.toString();
  } else if (num >= 1000 && num < 100000) {
    return (num / 1000).toFixed(0) + "k";
  } else if (num >= 100000 && num < 10000000) {
    return (num / 100000).toFixed(0) + " lakh";
  } else if (num >= 10000000) {
    return (num / 10000000).toFixed(0) + " crore";
  } else {
    return num.toString();
  }
};

export const formatDateToMonthYear = (dateString) => {
  const date = new Date(dateString);
  return format(date, "yyyy-MMMM"); // Using date-fns to format the date
};

export const isDateString = (str) => {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(str);
};
//-------------------------Vijay----------------------------------------------//

export const CustomIcons = {
  createIcon: <AddIcon style={{ fontSize: 18, fontWeight: 900 }} />,
  deleteIcon: <MdDelete style={{ fontSize: 18, fontWeight: 900 }} />,
  uploadIcon: (
    <IoCloudUploadOutline style={{ fontSize: 18, fontWeight: 900 }} />
  ),
  downloadIcon: (
    <IoCloudDownloadOutline style={{ fontSize: 18, fontWeight: 900 }} />
  ),
  EditIcon: <TiEdit style={{ fontSize: 18, fontWeight: 900 }} />,
  filterIcon: <BsFilterLeft style={{ fontSize: 18, fontWeight: 900 }} />,
  saveIcon: <SaveIcon style={{ fontSize: 18, fontWeight: 900 }} />,
  sendIcon: <IoMdSend style={{ fontSize: 18, fontWeight: 900 }} />,
  checkIcon: <IoCheckmark style={{ fontSize: 18, fontWeight: 900 }} />,
  nextIcon: <BiRightArrowAlt style={{ fontSize: 18, fontWeight: 900 }} />,
  backIcon: <BiLeftArrowAlt style={{ fontSize: 18, fontWeight: 900 }} />,
  moreIcon: <MdMoreVert style={{ fontSize: 18, fontWeight: 900 }} />,
  moveIcon: (
    <MdKeyboardDoubleArrowRight style={{ fontSize: 18, fontWeight: 900 }} />
  ),
  closeIcon: (
    <IoMdClose
      style={{
        fontSize: { xs: 16, md: 23 },
        fontWeight: 900,
        color: "#000 !important",
      }}
    />
  ),
  viewIcon: (
    <GrFormView style={{ fontSize: { xs: 16, md: 23 }, fontWeight: 900 }} />
  ),
  downArrowIcon: (
    <MdArrowDropDown
      style={{ fontSize: { xs: 14, md: 23 }, fontWeight: 900 }}
    />
  ),
  PreviewIcon: <VscPreview style={{ fontSize: 15, fontWeight: 900 }} />,
  callIcon: <MdCall style={{ fontSize: 15, fontWeight: 900 }} />,
  mailIcon: <MailIcon size={13} color={Colors?.Mblue} />,
  printIcon: <IoMdPrint size={13} color={Colors?.Mblue} />,
};

// --------------------------------------- Customization Buttons ---------------------------------
// Styled button with custom styles
export const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  // backgroundColor: purple[500],
  // "&:hover": {
  //   backgroundColor: purple[700],
  // },
  fontSize: FontStyle?.fontSize,
  boxShadow: "none",
}));

// create button
export const CreateButton = ({
  onClick,
  customStyles = {},
  label = "Create",
}) => {
  const matches = useMediaQuery("(min-width:600px)");

  return (
    <StyledButton
      sx={[
        matches && customStyles,
        {
          width: matches ? "100px" : "40px",
          height: "33px",
          backgroundColor: Colors?.Mblue,
          "&:hover": {
            backgroundColor: Colors?.MHoverblue,
            boxShadow: "none",
          },
        },
      ]}
      // variant="contained"
      startIcon={
        matches && (
          <AddIcon style={{ fontSize: !matches ? 25 : 18, fontWeight: 900 }} />
        )
      }
      onClick={onClick}
    >
      {matches ? (
        capitalizeWords(label)
      ) : (
        <AddIcon style={{ fontSize: !matches ? 25 : 18, fontWeight: 900 }} />
      )}
    </StyledButton>
  );
};

export const CustomButton = ({
  onClick = null,
  sx = {},
  label = "No Label",
  Icon = "createIcon",
  bgColor = Colors?.Mblue,
  textColor = "white !important",
  type = "button",
  width = null,
  disabled = false,
  endIcon = false,
  loading = false,
}) => {
  const matches = useMediaQuery("(min-width:599px)");

  return (
    <StyledButton
      sx={[
        matches && sx,
        {
          width: Boolean(width) ? width : "100px",
          height: "33px",
          backgroundColor: bgColor,
          "&:hover": {
            backgroundColor: alpha(bgColor, 0.8),
            boxShadow: "none",
          },
          color: textColor,
        },
      ]}
      // variant="contained"
      type={type}
      disabled={disabled || loading}
      startIcon={
        loading ? (
          <CircularProgress size={14} color="inherit" />
        ) : !endIcon && Boolean(Icon) ? (
          CustomIcons[Icon]
        ) : (
          ""
        )
      }
      endIcon={!loading && endIcon && Boolean(Icon) ? CustomIcons[Icon] : ""}
      onClick={onClick}
    >
      {loading ? "Loading..." : capitalizeWords(label)}
    </StyledButton>
  );
};

// cancel button
export const Cancelbutton = ({
  onClick = null,
  sx = {},
  label = "Cancel",
  Icon = "closeIcon",
  width = null,
  textColor = "black",
  disabled = false,
}) => {
  const matches = useMediaQuery("(min-width:600px)");

  return (
    <StyledButton
      sx={[
        matches && sx,
        {
          width: Boolean(width) ? width : matches ? "100px" : "40px",
          height: "33px",
          backgroundColor: grey[200],
          "&:hover": {
            backgroundColor: grey[300],
            boxShadow: "none",
          },
          color: textColor,
        },
      ]}
      disabled={disabled}
      variant="contained"
      startIcon={matches && Boolean(Icon) ? CustomIcons[Icon] : ""}
      onClick={onClick}
    >
      {matches ? capitalizeWords(label) : Boolean(Icon) && CustomIcons[Icon]}
    </StyledButton>
  );
};

// upload button
export const Uploadbutton = ({ onClick, customStyles = {} }) => {
  const matches = useMediaQuery("(min-width:600px)");

  return (
    <StyledButton
      sx={[
        matches && customStyles,
        {
          width: matches ? "100px" : "40px",
          height: "33px",
          backgroundColor: Colors?.Mblue,
          "&:hover": {
            backgroundColor: Colors?.MHoverblue,
            boxShadow: "none",
          },
        },
      ]}
      // variant="contained"
      startIcon={
        matches && (
          <IoCloudUpload
            style={{
              fontSize: !matches ? 25 : 18,
              fontWeight: !matches && 900,
            }}
          />
        )
      }
      onClick={onClick}
    >
      {matches ? (
        "Upload"
      ) : (
        <IoCloudUpload
          style={{ fontSize: !matches ? 25 : 18, fontWeight: !matches && 900 }}
        />
      )}
    </StyledButton>
  );
};

export const CustomScrollbar = ({ children }) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <Box
      sx={{
        "&::-webkit-scrollbar": {
          width: "8px",
          transition: "opacity 0.5s ease",
          opacity: hovered ? 1 : 0,
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "50px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#555",
        },
        height: "100vh",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Box>
  );
};

// -------------------------------------- icons section --------------------------------------
export const EditIcon = ({
  color = "#c1ccf4",
  onClick,
  disabled = false,
  toolTip = false,
}) => (
  <CustomTooltip
    value={(toolTip && "Edit") || ""}
    type={(toolTip && "children") || ""}
    placement="bottom-start"
  >
    <IconButton disabled={disabled} onClick={onClick} sx={{ p: 0.5 }}>
      <TiEdit style={{ fontSize: 17, color: color }} />
    </IconButton>
  </CustomTooltip>
);

export const DeletedIcon = ({
  // color = "#95a0c5",
  color = "#fc5b59",
  onClick,
  disabled = false,
  toolTip = false,
}) => (
  <CustomTooltip
    value={(toolTip && "Delete") || ""}
    type={(toolTip && "children") || ""}
    placement="bottom-start"
  >
    <IconButton disabled={disabled} onClick={onClick} sx={{ p: 0.5 }}>
      <MdDelete style={{ fontSize: 15, color: color }} />
    </IconButton>
  </CustomTooltip>
);

export const ChatIcon = ({
  color = "#c1ccf4",
  onClick,
  disabled = false,
  toolTip = false,
}) => (
  <CustomTooltip
    value={(toolTip && "Chat") || ""}
    type={(toolTip && "children") || ""}
    placement="bottom-start"
  >
    <IconButton disabled={disabled} onClick={onClick} sx={{ p: 0.5 }}>
      <MdChat style={{ fontSize: 17, color: color }} />
    </IconButton>
  </CustomTooltip>
);

export const UpdateIcon = ({
  color = "#c1ccf4",
  onClick,
  disabled = false,
  toolTip = false,
}) => (
  <CustomTooltip
    value={(toolTip && "Update Status") || ""}
    type={(toolTip && "children") || ""}
    placement="bottom-start"
  >
    <IconButton disabled={disabled} onClick={onClick} sx={{ p: 0.5 }}>
      <MdUpdate style={{ fontSize: 17, color: color }} />
    </IconButton>
  </CustomTooltip>
);

export const CustomIcon = ({
  color = Colors?.Mblue,
  onClick,
  Icon = CustomIcons?.viewIcon,
  disabled = false,
  toolTip = false,
  sx,
}) => (
  <CustomTooltip
    value={(toolTip && "Overview") || ""}
    type={(toolTip && "children") || ""}
    placement="bottom-start"
  >
    <IconButton
      disabled={disabled}
      onClick={onClick}
      sx={[sx, { m: "0px !important", p: "5px !important", color: color }]}
    >
      {CustomIcons[Icon]}
    </IconButton>
  </CustomTooltip>
);

// -------------------------------------- Dialog Box ------------------------------------------

/* close dialog box */

const defaultContent =
  "CRMFarm found that some modification has been made. By cancelling the modification will not be saved";
export const DialogBox = ({
  onClickYes,
  disabled = false,
  onClickNo,
  open,
  Title = "Warning",
  Content = defaultContent,
  Subcontent = "",
  Icon1 = "checkIcon",
  Icon2 = "closeIcon",
  Label1 = "Yes",
  Label2 = "No",
  BtnWidth1 = "70px",
  BtnWidth2 = "70px",
  Buttons = true,
  maxWidth = "",
  fullWidth = false,
}) => {
  // alert(Boolean(maxWidth))
  return (
    <Dialog
      open={open}
      onClose={onClickNo}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      xs={12}
      // sx={{width:"300px !important"}}
    >
      <DialogTitle
        sx={[
          dialogheading,
          DisplayFlex,
          { height: "38px !important", margin: "0px !important" },
        ]}
      >
        {Title == "Warning" && (
          <CiWarning
            style={{
              color: colorCode?.textDanger.color,
              fontSize: 22,
              transform: "translateX(-10px)",
            }}
          />
        )}
        <Typography
          id="Typography-root"
          sx={[
            {
              fontSize: "14px !important",
              fontWeight: "600 !important",
              transform: "translateX(-10px)",
            },
          ]}
        >
          {Title}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          width: !Boolean(maxWidth) ? "380px !important" : "100%",
          fontSize: FontStyle.fontSize,
          fontWeight: Title !== "Warning" ? 300 : FontStyle.fontWeight,
          lineHeight: 2,
          backgroundColor: Colors?.dialogBgColor,
        }}
      >
        <Box
          sx={{
            minHeight: "80px",
            backgroundColor: "transparent !important",
            // py: 1.5,
          }}
        >
          <Typography sx={[FontStyle, { mt: 1 }]}>{Content}</Typography>
          <Typography sx={[FontStyle, { color: "#EA7135 !important", my: 2 }]}>
            {Subcontent}
          </Typography>
        </Box>

        {Buttons && (
          <Box
            sx={[
              DisplayFlex,
              {
                justifyContent: "center",
                gap: "10px !important",
                // mt: 1.5,
                flexWrap: "wrap",
              },
            ]}
          >
            <Div>
              {Boolean(Label1) && (
                <CustomButton
                  disabled={disabled}
                  width={BtnWidth1}
                  label={Label1}
                  Icon={Icon1}
                  onClick={onClickYes}
                  sx={{ mr: 1, height: "26px !important" }}
                />
              )}
              {Boolean(Label2) && (
                <Cancelbutton
                  disabled={disabled}
                  width={BtnWidth2}
                  Icon={Icon2}
                  label={Label2}
                  sx={{ height: "26px !important" }}
                  onClick={onClickNo}
                />
              )}
            </Div>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Upload dialog box

// -------------------------------------- Auto complete ----------------------------------------
const CustomPopper = styled(Popper)(({ theme }) => ({
  "& .MuiAutocomplete-listbox": [FontStyle, {}],
}));

export const SelectDropdown = ({
  options = [],
  onChange,
  placeholder = "",
  value,
  getOptionLabel,
  defaultValue,
  clearButton = true,
  border = true,
  name,
  sx,
  className = "search-select3",
  multiple = false,
  width = "200px",
}) => (
  <Autocomplete
    multiple={multiple}
    limitTags={1}
    disablePortal
    className={className}
    value={value}
    defaultValue={defaultValue}
    options={options}
    onChange={onChange}
    name="name"
    sx={[
      FontStyle,
      sx,
      {
        width: width,
        height: "34px !important",
        border: border ? "1px solid #e0e0e0 !important" : "none !important",
        borderRadius: "5px !important",
        backgroundColor: "white !important",
      },
    ]}
    getOptionLabel={(option) => {
      if (typeof option === "string") {
        return option;
      }
      if (Boolean(option) && option[getOptionLabel]) {
        return option[getOptionLabel];
      }
      return "";
    }}
    renderInput={(params) => (
      <TextField
        // className={`${((value?.length > 2))? 'search-select1' : 'search-select'}`}
        sx={[FontStyle, sx, { border: "none !important" }]}
        placeholder={placeholder}
        {...params}
        // label="Movie"
        InputProps={{
          ...params.InputProps,
          margin: 2,
          endAdornment: clearButton == false ? null : true, // Remove the caret
        }}
        // clearButton={clearButton} // Remove the clear button
      />
    )}
  />
);

const gifIcons = {
  // mail_sending,
  // mail_success,
};
export const LoadingFullPageSkel = ({ Icon = "" }) => {
  return (
    <Div
      sx={{
        position: "absolute",
        zIndex: 999999,
        backgroundColor: alpha(Colors?.Mblue, 0.1),
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ml: { md: "-50px ", xs: "-20px" },
        mt: { md: "-50px ", xs: "-20px" },
      }}
    >
      <Div sx={{ width: { md: "100px", xs: "70px" } }}>
        {/* <img src={gifIcons[Icon]} alt="Loading..." width={"100%"} /> */}
      </Div>
    </Div>
  );
};

// -------------------------------------- No Records page ------------------------------------------
export const NoRecordsPage = ({
  title = "",
  minWidth = "100px",
  minHeight = "100px",
  width = "30%",
  height = "30%",
}) => (
  <>
    <Div
      sx={[
        DisplayFlex,
        { justifyContent: "center", width: "100%", height: "100%" },
      ]}
    >
      <Empty description={`No ${title?.toLowerCase()} found.`} />
      {/* <Div sx={[DisplayFlex, { justifyContent: "center" }]}>
          <img
            style={{
              minWidth: minWidth,
              minHeight: minHeight,
              width: width,
              height: height,
            }}
            src={require("../../assets/images/No_record2.png")}
            alt="No Found"
          />
        </Div>
        <Div>
          <Typography sx={[{ textAlign: "center", fontSize: "12px" }]}>
            No {title} found.
          </Typography>
        </Div> */}
    </Div>
  </>
);

// -------------------------------------- Countup function ------------------------------------------
const useCounter = (minimum = 0, maximum, speed) => {
  const [count, setCount] = useState(minimum);

  useEffect(() => {
    // setCount(maximum)
    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount < maximum) {
          return prevCount + 1;
        } else {
          clearInterval(timer);
          return prevCount;
        }
      });
    }, speed);

    return () => clearInterval(timer);
  }, [minimum, maximum]);

  return count;
};

const Counter = ({ minimum = 0, maximum, speed = 50 }) => {
  let speedy =
    speed > 100
      ? 40
      : speed > 400
        ? 35
        : speed > 800
          ? 30
          : speed > 1500
            ? 20
            : 10;
  const count = useCounter(minimum, maximum, speedy);
  return (
    <>
      {count} <span style={{ fontSize: "11px" }}>Nos</span>
    </>
  );
};

export default Counter;

// -------------------------------------- Avatar Circle ------------------------------------------
export const AvatarCircle = ({
  fontSize = "10px",
  size = "25px",
  title = "",
  bgColor = Colors?.Mblue,
  textColor = "white",
  fullTitle = false,
  label = "",
  labelSize = "12px",
  labelColor = Colors?.Mblue,
  subLabel = "",
  subLabelColor = "black",
  subLabelSize = "11px",
  gap = 0,
  image = false,
}) => {
  return (
    <>
      <FormControlLabel
        sx={{ m: 0, ml: 0.1 }}
        control={
          <Avatar
            src={image}
            sx={[
              AvatarFont,
              {
                background: bgColor,
                width: size,
                height: size,
                color: textColor,
                fontSize: fontSize,
              },
            ]}
          >
            {
              Boolean(title) && (
                <Typography
                  sx={[
                    {
                      fontSize: fontSize,
                      color: textColor,
                      transform: Boolean(fullTitle)
                        ? "translateX(6px)"
                        : "translateX(0px)",
                    },
                  ]}
                >
                  {!Boolean(fullTitle)
                    ? title?.substring(0, 2)?.toUpperCase()
                    : title}
                </Typography>
              )
              // <PiUserCircleFill style={{color}} />
            }
          </Avatar>
        }
        label={
          label !== "" ? (
            <>
              <Typography
                sx={{
                  color: labelColor,
                  fontSize: labelSize,
                  ml: 0.5,
                  mb: gap,
                }}
              >
                {label}
              </Typography>

              {Boolean(subLabel) && (
                <Typography
                  sx={{
                    color: subLabelColor,
                    fontSize: subLabelSize,
                    ml: 0.5,
                    mt: gap,
                  }}
                >
                  {subLabel}
                </Typography>
              )}
            </>
          ) : (
            ""
          )
        }
      />
    </>
  );
};

export const ScrollheightForScreenSize = () => {
  const [scrollbarHeight, setScrollbarHeight] = useState([
    window.innerHeight,
    window.innerWidth,
  ]);

  useEffect(() => {
    const handleResize = () => {
      setScrollbarHeight([window.innerHeight, window.innerWidth]);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return scrollbarHeight;
};

//karthik add

export const CustomScrollBar = ({
  stateValue = true,
  childrens = <></>,
  fromDate = "",
  toDate = "",
  formName = "",
}) => {
  let [screenHeight, screenWidth] = ScrollheightForScreenSize();
  const CurrentDate = new Date().toJSON().slice(0, 10);

  if (stateValue) {
    return (
      <>
        <JumboScrollbar
          autoHeight={true}
          autoHideTimeout={4000}
          autoHeightMin={Math.round(screenHeight / 1.84)}
          autoHide={true}
          hideTracksWhenNotNeeded
          id="no-more-tables"
        >
          {childrens}
        </JumboScrollbar>
      </>
    );
  } else {
    return (
      <>
        <Div sx={{ px: 2 }}>
          <Typography
            sx={{
              fontWeight: 600,
              textAlign: "center",
              fontSize: "19px !important",
            }}
          >
            {formName} {" - "} Reports
          </Typography>
        </Div>
        <Div sx={{ display: "flex", fontSize: "14px", mt: 3, px: 2 }}>
          <Div item className="col-4" sx={{ textAlign: "left" }}>
            Date : {CurrentDate}
          </Div>
          <Div item className="col-4" sx={{ textAlign: "left" }}>
            From : {fromDate}
          </Div>
          <Div item className="col-4" sx={{ textAlign: "left" }}>
            To : {toDate}
          </Div>
        </Div>
        <Div sx={{ px: 1 }}>{childrens}</Div>
      </>
    );
  }
};

// Use Query
export const InvalidateQueryUpdates = (queryKey) => {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries(queryKey);
};

// colors func
export const avatarColorFun = (index = 0) =>
  index >= 10 ? avatarColors[index % 10] : avatarColors[index];

// <--------------------------------------------- Date format functions ------------------------------------------>
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const options = { month: "long", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

// <--------------------------------------------- Dragable dialog box ------------------------------------------>

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      sx
    >
      <Paper {...props} />
    </Draggable>
  );
}

export const Dragabledialog = ({
  open,
  onClose,
  children,
  dragable = true,
  maxWidth,
  title = "",
}) => {
  return (
    <Dialog
      maxWidth={maxWidth}
      fullWidth
      open={open}
      onClose={onClose}
      PaperComponent={dragable ? PaperComponent : ""}
      aria-labelledby="draggable-dialog-title"
      sx={{ borderRadius: "10px !important" }}
    >
      {Boolean(title) && (
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          sx={[
            dialogFontSize,
            DisplayFlex,
            { justifyContent: "space-between" },
          ]}
        >
          {title}
          <CustomIcon Icon={"closeIcon"} onClick={onClose} />
        </DialogTitle>
      )}

      {children}
    </Dialog>
  );
};

// <--------------------------------------------- Error Functins ------------------------------------------>

export const errorFilter = (err) => {
  let error = {};

  if (err && typeof err === "object" && !Array.isArray(err)) {
    Object.keys(err)?.forEach((field) => {
      if (
        (typeof err[field] === "string" && !err[field].trim()) ||
        (err[field] == null && err[field] === undefined && err[field] === "")
      ) {
        error[field] = "This field is required";
      } else if (Array.isArray(field)) {
        error[field] = field?.every((subfield) => Boolean(subfield));
      }
    });
  }

  console.log("error", err, error);
  return error;
};

// <--------------------------------------------- Custom Grid ------------------------------------------>
export const Customgrid = memo(
  ({ children, columnCount, staticColSpan = false }) => {
    // Calculate the column sizes for odd and even indexed children
    return (
      <Grid container spacing={2}>
        {React.Children.map(children, (child, index) => {
          let colSpan = child.props.colSpan;

          if (colSpan === undefined) {
            if (index % 2 === 0) {
              colSpan = columnCount === 4 ? 2 : 2.5;
            } else {
              colSpan = columnCount === 4 ? 4 : 9.5;
            }
          }

          // Override with staticColSpan if provided
          if (staticColSpan) {
            colSpan = columnCount;
          }
          return (
            <Grid item xs={12} md={colSpan} key={index}>
              {React.cloneElement(child)}
            </Grid>
          );
        })}
      </Grid>
    );
  },
);

// <--------------------------------------------- parseStringArray ------------------------------------------------>
export function parseStringArray(str) {
  // Replace single quotes with double quotes
  const jsonString = str.replace(/'/g, '"');
  // Parse the JSON string to a JavaScript array
  const array = JSON.parse(jsonString);
  return array;
}

// <--------------------------------------------- Locale string amount format ------------------------------------------------>
export const toLocaleCurrency = (
  value = 0,
  currencyCode = "INR",
  locale = "en-US",
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(value);
};

//ckEditorOnchange
export const ckEditorOnchange = (evt, editor, setstate) => {
  const value = editor.getData();
  // const parser = new DOMParser();
  // const doc = parser.parseFromString(value, "text/html");
  // const textContent = doc.body.textContent || "";
  setstate(value);
};

// <--------------------------------------------- Fetch Transaction Series ------------------------------------------------>
export const fetchTransactionSeries = async (name = "") => {
  const OrganizationId = parseInt(localStorage.getItem("OrganizationId"));
  const token = localStorage.getItem("accesstoken");
  try {
    // const response = await axios.get(
    //   `${BASE_URL}/useradmin/TransactionbyOrg/?Org_Id=${OrganizationId}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //     },
    //   },
    // );
    // console.log("responseTABLE", response?.data[name]?.Type);
    // return response?.data?.[name]?.Type;
    return "";
  } catch (error) {
    console.log("failed to fetch transaction series", error);
    // throw error;
  }
};

// <--------------------------------------------- format date and time ------------------------------------------------>

export const formatDateTime = (dateTimeString, type = "time") => {
  const dateObj = new Date(dateTimeString);
  console.log("format : ", dateObj, type, dateTimeString);

  switch (type) {
    case "time":
      return dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

    case "date":
      return dateObj.toLocaleDateString();

    case "datetime":
      return dateObj.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

    default:
      return "Invalid type";
  }
};

// <--------------------------------------------- format date and time ------------------------------------------------>

export const defaultFormatDate = (date, dateFormat) => {
  return format(new Date(date), dateFormat);
};

// <--------------------------------------------- format date and time ------------------------------------------------>

export const TextEditor = ({ value = "", onChange }) => {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={{
        toolbar: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
        ],
        clipboard: {
          matchVisual: false,
        },
      }}
      formats={[
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "video",
      ]}
    />
  );
};

// Customize Dialog Box
const defaultContentcampaign =
  "CRMFarm found that some modification has been made. By cancelling the modification will not be saved";
export const DialogBoxCampaign = ({
  onClickYes,
  disabled = false,
  onClickNo,
  open,
  Title = "Warning",
  Content = defaultContentcampaign,
  Subcontent = "",
  Icon1 = "checkIcon",
  Icon2 = "closeIcon",
  Label1 = "Yes",
  Label2 = "Cancel",
  BtnWidth1 = "70px",
  BtnWidth2 = "70px",
  Buttons = true,
  maxWidth = "",
  fullWidth = false,
}) => {
  // alert(Boolean(maxWidth))
  return (
    <Dialog
      open={open}
      // onClose={() => { setSave(false) }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      xs={12}
      // sx={{width:"300px !important"}}
    >
      <DialogTitle
        sx={[
          dialogheading,
          DisplayFlex,
          { height: "38px !important", margin: "0px !important" },
        ]}
      >
        {Title == "Warning" && (
          <CiWarning
            style={{
              color: colorCode?.textDanger.color,
              fontSize: 22,
              transform: "translateX(-10px)",
            }}
          />
        )}
        <Typography
          id="Typography-root"
          sx={[
            {
              fontSize: "14px !important",
              fontWeight: "600 !important",
              transform: "translateX(-10px)",
            },
          ]}
        >
          {Title}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          width: !Boolean(maxWidth) ? "380px !important" : "100%",
          fontSize: FontStyle.fontSize,
          fontWeight: Title !== "Warning" ? 300 : FontStyle.fontWeight,
          lineHeight: 2,
          backgroundColor: Colors?.dialogBgColor,
        }}
      >
        <Box
          sx={{
            minHeight: "80px",
            backgroundColor: "transparent !important",
            // py: 1.5,
          }}
        >
          <Typography sx={[FontStyle, { mt: 1 }]}>{Content}</Typography>
          <Typography sx={[FontStyle, { color: "#EA7135 !important", my: 2 }]}>
            {Subcontent}
          </Typography>
        </Box>
        {Buttons && (
          <Box
            sx={[
              DisplayFlex,
              {
                justifyContent: "end",
                gap: "10px !important",
                // mt: 1.5,
                flexWrap: "wrap",
              },
            ]}
          >
            <Div>
              {Boolean(Label2) && (
                <Cancelbutton
                  disabled={disabled}
                  width={BtnWidth2}
                  Icon={Icon2}
                  label={Label2}
                  sx={{ height: "26px !important" }}
                  onClick={onClickNo}
                />
              )}
            </Div>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

// <--------------------------------------------- Countdown functions ------------------------------------------------>
export const countdown = (start) => {
  let current = start;

  // Validate that start is a non-negative number
  if (typeof start !== "number" || start < 0) {
    console.error("Invalid start value. Please provide a non-negative number.");
    return;
  }

  const interval = setInterval(() => {
    console.log(current);
    if (current <= 0) {
      clearInterval(interval);
    } else {
      return current--;
    }
  }, 1000); // 1000 milliseconds = 1 second
};

// FirstLetterCaps
export const FirstLetterCaps = (value = "") => {
  return value?.charAt(0)?.toUpperCase() + value.slice(1);
};

export const CustomTableSkeleton = memo(({ rowCount = 10, headCount = 8 }) => {
  console.log("skeleton calling from styeld");
  return (
    <>
      {Array(rowCount)
        ?.fill()
        ?.map((item, index) => (
          <TableRow key={index + 1}>
            {Array(headCount)
              ?.fill()
              ?.map((data) => (
                <TableCell>
                  <Skeleton height={30} />
                </TableCell>
              ))}
          </TableRow>
        ))}
    </>
  );
});

export const CustomTooltip = memo(
  ({
    value = "",
    char = 10,
    type = "text",
    placement = "bottom-start",
    children,
  }) => {
    console.log("CustomTooltip calling from styeld");

    const textTooltip = (
      <Tooltip
        title={value?.length > char ? FirstLetterCaps(value) : ""}
        placement={placement}
      >
        <span>
          {FirstLetterCaps(
            value &&
              (value?.length > char ? value?.slice(0, char) + "..." : value),
          )}
        </span>
      </Tooltip>
    );

    const childrenTooltip = (
      <Tooltip title={value} placement={placement}>
        <span style={{ display: "inline-flex" }}>{children}</span>
      </Tooltip>
    );

    return type === "text" ? textTooltip : childrenTooltip;
  },
);

export const errorRequired = (err) => {
  // const camelCaseToSpaces = (str) => {
  //   return str.replace(/([a-z])([A-Z])/g, '$1 $2');
  // };

  const formatString = (str) => {
    str = str.replace(/_/g, " ");
    str = str.replace(/([a-z])([A-Z])/g, "$1 $2");
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  let error = {};

  if (err && typeof err === "object" && !Array.isArray(err)) {
    Object.keys(err)?.forEach((field) => {
      if (typeof err[field] === "string" && !Boolean(err[field].trim())) {
        error[field] = `${formatString(field)} is required.`;
      }
    });
  }
  console.log("errorRequired", error);
  return error;
};

export const StyledEditorWrapper = styledComponents.div`
  .ck-editor__editable {
    min-height: ${({ minHeight }) => minHeight || "200px"} !important;
    color: ${({ color }) => color || "black"} !important;
  }
`;

export const htmlToText = (html = "") => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

// <--------------------------------------------- Custom CKEditor ------------------------------------------------>
export const CustomCKEditor = ({ onChange, initData }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={initData}
      onChange={(event, editor) => {
        const value = editor.getData();
        // const parser = new DOMParser();
        // const doc = parser.parseFromString(value, "text/html");
        // const textContent = doc.body.textContent || "";
        onChange(value);
      }}
    />
  );
};

export const DateFormatter = ({ date }) => {
  const dispatch = useDispatch();
  // const dateFormat = useSelector(selectedDateFormat);
  const dateFormat = localStorage.getItem("DateFormat");

  // useEffect(() => {
  //   // Fetch the date format when the component mounts
  //   dispatch(fetchDateFormater());
  // }, [dispatch]);

  // Extract the date portion (YYYY-MM-DD) if the date is a string with a time component
  const correctedDate = date?.slice(0, 10);

  // Memoize the formatted date value to avoid unnecessary recalculations
  const formattedDate = React.useMemo(() => {
    if (dateFormat && correctedDate) {
      try {
        return format(new Date(correctedDate), dateFormat);
      } catch (error) {
        console.error("Date formatting error:", error);
        return correctedDate; // Fallback to the original date if formatting fails
      }
    }
    return correctedDate;
  }, [correctedDate, dateFormat]);

  return <span>{formattedDate || correctedDate}</span>;
};

export const CRMDateField = ({
  value,
  onChange,
  InputProps: parentInputProps,
  ...props
}) => {
  const [showDateField, setShowDateField] = useState(false);
  const dateFormat = useSelector(selectedDateFormat);
  const dateFieldRef = React.useRef(null);
  const handleBlurDateField = React.useCallback((event) => {
    if (dateFieldRef.current && !dateFieldRef.current.contains(event.target)) {
      setShowDateField(false);
    }
  }, []);
  useEffect(() => {
    document.addEventListener("click", handleBlurDateField, true);
    return () => {
      document.removeEventListener("click", handleBlurDateField, true);
    };
  }, [handleBlurDateField]);

  const formatDate = (date, formatString) => {
    if (!formatString || typeof formatString !== 'string' || formatString === "[object Object]") {
        return date;
    }
    try {
      return format(new Date(date), formatString);
    } catch (error) {
      console.error("Date formatting error:", error);
      return date;
    }
  };

  const formattedValue =
    !showDateField && value ? formatDate(value, dateFormat) : value;

  // Merge default InputProps with those from the parent
  const mergedInputProps = {
    ...parentInputProps,
    inputProps: {
      ...(parentInputProps?.inputProps || {}),
      min: parentInputProps?.inputProps?.min, // or any other specific props
      max: props?.inputProps?.max,
    },
    endAdornment: !showDateField && (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle calendar"
          onMouseEnter={() => setShowDateField(true)}
          edge="end"
          sx={{ pl: 0, pr: 1.28, mt: -0.2 }}
        >
          <MdCalendarToday
            size={13}
            color={Boolean(props?.disabled) ? "gray" : "#000"}
          />
        </IconButton>
      </InputAdornment>
    ),
  };

  const safeDateFormat = typeof dateFormat === 'string' && dateFormat !== "[object Object]" ? dateFormat : "dd/mm/yyyy";

  // console.log("mergedInputProps", { mergedInputProps, props, formattedValue })
  return (
    <TextField
      {...props}
      type={showDateField ? "date" : "text"}
      className={props?.className ? props?.className : `col-12 input-box2`}
      onFocus={() => setShowDateField(true)}
      onBlur={() => setShowDateField(false)}
      value={typeof formattedValue === 'string' ? formattedValue.split("T")[0] : ""}
      onChange={onChange}
      ref={dateFieldRef}
      placeholder={safeDateFormat}
      InputProps={mergedInputProps}
      sx={{
        "& input": {
          p: "10px !important",
          width: "100% !important",
          minWidth: "100px !important",
        },
        "& input::placeholder": {
          color: Boolean(props?.disabled) ? "gray" : "#000", // Adjust the color as needed
          opacity: Boolean(props?.disabled) ? 0.5 : 0.8, /// Adjust the color as needed
          marginTop: "3.5px",
        },
        "&:focus-within .MuiOutlinedInput-notchedOutline": {
          borderColor: "#00BFFF", // Adjust the border color as needed
        },
      }}
    />
  );
};

export const CRMCustomLoader = () => {
  return (
    <Div className="loader1">
      <CircularProgress />
    </Div>
  );
};

export const CRMSeparateDateTime = (timestamp) => {
  const dispatch = useDispatch();
  const dateFormat = useSelector(selectedDateFormat);

  useEffect(() => {
    dispatch(fetchDateFormater());
  }, [dispatch]);

  // Ensure timestamp is a string or handle Date objects
  const correctedData = React.useMemo(() => {
    if (!timestamp) return "";

    return typeof timestamp === "string"
      ? timestamp.slice(0, 10)
      : timestamp instanceof Date
        ? timestamp.toISOString().slice(0, 10)
        : "";
  }, [timestamp]);

  // Memoize the formatted date value based on the date and date format
  const formattedDate = React.useMemo(() => {
    if (dateFormat && correctedData) {
      try {
        return format(new Date(correctedData), dateFormat);
      } catch (error) {
        console.error("Date formatting error:", error);
        return correctedData; // Fallback to the original date if formatting fails
      }
    }
    return correctedData;
  }, [correctedData, dateFormat]);

  const dateObject = React.useMemo(() => {
    return typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  }, [timestamp]);

  if (!timestamp) {
    return "";
  }

  const timePart = dateObject.toLocaleTimeString("en-GB");
  const dateTimeString = `${formattedDate} ${timePart}`;

  return dateTimeString;
};

export const CommonPagination = ({
  totalPages,
  page = 1,
  onChange = () => {},
}) => {
  return (
    <Grid
      container
      spacing={1}
      sx={{ mt: 2, display: "flex", alignItems: "center" }}
    >
      <Grid item xs={12} md={0} lg={3} xl={4.5}></Grid>
      <Grid
        item
        xs={12}
        md={4}
        lg={4}
        xl={3.5}
        sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "flex-end" },
          alignItems: "center",
          gap: "10px !important",
        }}
      ></Grid>
      <Grid
        item
        xs={12}
        md={8}
        lg={5}
        xl={4}
        sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "flex-end" },
          alignItems: "center",
          gap: "10px !important",
        }}
      >
        <Pagination
          color="primary"
          count={totalPages}
          page={page}
          onChange={(e, newValue) => onChange(e, newValue)}
          variant="outlined"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Grid>
    </Grid>
  );
};

export const CRMCustomScrollTable = ({
  datas,
  scrollRef,
  children,
  ...props
}) => {
  return (
    <Grow in>
      <Div
        className="crmscrolltable"
        sx={{
          mb: 1,
          backgroundColor: "#52453317 !important",
          padding: "0px 30px 0px 30px !important",
          borderRadius: "10px !important",
        }}
      >
        {/* <List
          ref={scrollRef}
          {...props}
          sx={{
            mt: 0,
            height: '425px',
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: '425px !important',
            position: 'relative',
            '&::-webkit-scrollbar': {
              width: '2px',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#dad0d0',
              borderRadius: '50%',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#555',
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#dad0d0 transparent',
          }}
        >
          {children}
        </List> */}
        <CustomScrollbarBox ref={scrollRef} scrollHeight={AutoHeight(1.65)}>
          {children}
        </CustomScrollbarBox>
      </Div>
    </Grow>
  );
};

export const CRMCustomScrollCard = ({
  setFadeEdit = false,
  index,
  children,
}) => {
  return (
    <Div
      onMouseOver={() => (setFadeEdit ? setFadeEdit(index) : {})}
      onMouseLeave={() => (setFadeEdit ? setFadeEdit(null) : {})}
      className=""
      key={index}
      sx={{
        minHeight: "115px",
        p: { xs: 0.5, sm: 1.5 },
        px: { xs: 0.5, md: 7 },
        my: 2,
        bgcolor: "white",
        borderRadius: { xs: "5px !important", md: "10px !important" },
        border: `1px solid #ececec`,
        borderLeft: `5px solid ${Colors?.Mblue}`,
        scrollBehavior: "smooth",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          backgroundColor: "#fcfefd",
          borderColor: Colors?.Mblue,
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-2px)",
        },
        cursor: "default",
      }}
    >
      {children}
    </Div>
  );
};

export const CustomScrollbarBox = styled(Box)(
  ({
    scrollWidth = "100%",
    scrollHeight = "100%",
    overflowX = false,
    overflowY = false,
  }) => ({
    width: scrollWidth,
    height: scrollHeight,
    overflowX: "hidden",
    overflowY: "hidden",
    position: "relative",
    transition: "overflow 0.3s linear",
    scrollBehavior: "smooth",
    "&:hover": {
      overflowX: "auto",
      overflowY: "auto",
    },
    "&:hover::-webkit-scrollbar": {
      opacity: 1,
    },
    "&::-webkit-scrollbar": {
      height: true ? "7px" : "0px",
      width: true ? "7px" : "0px",
      transition: "opacity 0.3s ease",
      opacity: 0,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#D2D2D2",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#D2D2D2",
      cursor: "grabbing",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#EFEEED",
    },
  }),
);

const bellShake = keyframes`
  0% { transform: rotate(0); }
  25% { transform: rotate(-15deg); }
  50% { transform: rotate(15deg); }
  75% { transform: rotate(-10deg); }
  100% { transform: rotate(0); }
`;

const BellIcon = styled("i")`
  margin-left: 8px;
  animation: ${({ animate }) =>
    animate ? `${bellShake} 0.8s ease-in-out` : "none"};
`;

export const CRMCustomBellIcon = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return <BellIcon className="bi bi-bell-fill" animate={animate} />;
};

export const requiredSpan = <span className="required">*</span>;

// toast
export const ToastMsg = (
  type = "success",
  message = "created successfully",
) => {
  toast?.[type](message);
};

// axios instance ----------------------------------------------------------------start
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    Db: localStorage.getItem("DBName"),
  },
});

// Optionally add interceptors to handle dynamic headers or responses
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accesstoken");
    const dbName = localStorage.getItem("DBName");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (dbName) {
      config.headers["Db"] = dbName;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Redirecting to login...");
    }
    return Promise.reject(error);
  },
);

// axios instance ----------------------------------------------------------------end

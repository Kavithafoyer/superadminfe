import React, { useRef } from "react";
import Div from "@jumbo/shared/Div";
import {
  Avatar,
  Grid,
  Typography,
  Button,
  IconButton,
  DialogContent,
  DialogContentText,
  DialogActions,
  AppBar,
  Toolbar,
  Popover,
  List,
  ListItemButton,
  ListItemText,
  FormControl,
  OutlinedInput,
  Stack,
  InputBase,
  ButtonGroup,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallIcon from "@mui/icons-material/Call";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import { useState } from "react";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import {
  MdArrowCircleDown,
  MdGroupAdd,
  MdOutlineEmojiEmotions,
  MdSend,
} from "react-icons/md";
import { ImAttachment } from "react-icons/im";
import { useEffect } from "react";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Picker from "emoji-picker-react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { AiFillFile } from "react-icons/ai";
import {
  PiArrowDownLeft,
  PiArrowElbowLeft,
  PiArrowUpRight,
  PiCircleFill,
} from "react-icons/pi";
import CloseIcon from "@mui/icons-material/Close";
import CreateGroupAndUserlists from "./CreateGroupAndUserlists";
import { IoMdArrowBack, IoMdCall } from "react-icons/io";
import { LiaInfoCircleSolid } from "react-icons/lia";
import { HiOutlineUsers } from "react-icons/hi2";
import { TfiPencil } from "react-icons/tfi";
import { BiSolidCheckCircle } from "react-icons/bi";
import { FaCamera } from "react-icons/fa";
import { FcVideoCall } from "react-icons/fc";
import SearchBar from "app/pages/widgets/SearchField";
import TextToSpeech from "app/pages/widgets/TextToSpeech";
const LiveChatsRightCard = () => {
  const [users, setUsers] = useState([]);
  const [userChats, setUserChats] = useState([]);
  const [selectUser, setSelectUser] = useState([]);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);
  const [base64Data, setBase64Data] = useState("");
  const [fileName, setFileName] = useState("");
  const [deleteIcon, setDeleteIcon] = useState(null);
  const [sendLoader, setSendLoader] = useState(false);
  const [userOnline, setUserOnline] = useState(false);
  const [callingURI, setCallingURI] = useState("");
  const [randomColors, setRandomColors] = useState([]);
  const [save, setSave] = useState(false);
  const [showUserlists, setShowUserlists] = useState(false);

  const [myUsers, setMyUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [updateProfilePic, setUpdateProfilePic] = useState(false);
  const [profileImg, setProfileImg] = useState(false);
  const [localFile, setLocalFile] = useState("");
  const [dragging, setDragging] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [loaderLeft, setLoaderLeft] = useState(false);
  const [loaderRight, setLoaderRight] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const token = localStorage.getItem("accesstoken");
  const UserId = parseInt(localStorage.getItem("UserId"));
  const OrganizationId = parseInt(localStorage.getItem("OrganizationId"));
  const item = "crmuseradmin1";

  const FileFormats = [
    "js",
    "pdf",
    "PDF",
    "doc",
    "DOC",
    "docx",
    "DOCX",
    "pptx",
    "PPTX",
    "xlsx",
    "XLSX",
    "csv",
    "CSV",
    "txt",
    "TXT",
    "html",
    "HTML",
    "xml",
    "XML",
    "json",
    "JSON",
    "zip",
    "ZIP",
    "rar",
    "RAR",
    "7z",
    "7Z",
    "tar",
    "TAR",
    "gz",
    "GZ",
  ];
  const VideoFormats = [
    "mp4",
    "MP4",
    "avi",
    "AVI",
    "mkv",
    "MKV",
    "mov",
    "MOV",
    "wmv",
    "WMV",
    "flv",
    "FLV",
    "webm",
    "WEBM",
    "m4v",
    "M4V",
    "ogg",
    "OGG",
    "mpeg",
    "MPEG",
    "mpg",
    "MPG",
    "3gp",
    "3GP",
    "ts",
    "TS",
    "vob",
    "VOB",
    "swf",
    "SWF",
    "rm",
    "RM",
    "asf",
    "ASF",
  ];
  const ImageFormats = [
    "jfif",
    "jpg",
    "JPG",
    "jpeg",
    "JPEG",
    "png",
    "PNG",
    "gif",
    "GIF",
    "bmp",
    "BMP",
    "tiff",
    "TIFF",
    "svg",
    "SVG",
    "ico",
    "ICO",
    "heic",
    "HEIC",
    "apng",
    "APNG",
    "raw",
    "RAW",
  ];
  const AudioFormats = [
    "ogg",
    "OGG",
    "amr",
    "AMR",
    "3gp",
    "3GP",
    "aac",
    "AAC",
    "mpeg",
    "MPEG",
    "mp3",
    "MP3",
    "wav",
    "WAV",
    "flac",
    "FLAC",
  ];

  // drag and drop functions

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const files = e.dataTransfer
      ? Array.from(e.dataTransfer.files)
      : e.target.files;

    if (files.length > 0) {
      const file = files[0];
      setFileName(file);

      const fileURL = URL.createObjectURL(file);
      setLocalFile(fileURL);

      const reader = new FileReader();

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentLoaded = (event.loaded / event.total) * 100;
          setLoadingProgress(percentLoaded);
        }
      };

      reader.onload = () => {
        setBase64Data(reader.result?.split(",")[1]);
        setLoadingProgress(100); // Set progress to 100% when loading is complete
      };

      reader.readAsDataURL(file);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowEdit(false);
  };

  // overview sidebar select
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  // random color
  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // image handling functions
  const handleFileUploadImg = (event) => {
    const file = event.target.files[0];
    let base = "",
      selectuser = "";
    if (file) {
      const fileURL = URL.createObjectURL(file);
      selectuser = { ...selectUser, User_Photo: fileURL };
      setSelectUser({ ...selectUser, User_Photo: fileURL });
      setFileName(file.name || "");
      const reader = new FileReader();

      reader.onload = () => {
        base = reader.result?.split(",")[1];
        setBase64Data(reader.result?.split(",")[1]);
        // console.log("reader.result", e, reader.result?.split(",")[1]);

        // console.log("reader.result", reader?.result?.split(",")[1]);
        // console.log("updatepayload",reader.result?.split(","));

        // console.log('Dropped files:', fileURL, file, reader.result);
        updateGroupProfile(selectuser, base, file);
      };
      reader.readAsDataURL(file);
      // console.log(`setSelectUser`, selectUser, UserProfile, findIndex)
    }
  };

  //  get chat lists
  const getUsersChatLists = async () => {
    // let userLists = [...myUsers]
    setLoaderLeft(true);
    try {
      await axios
        .get(`${BASE_URL}/user/ChatUserGroupList/?id=${UserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: item,
          },
        })
        .then((response) => {
          console.log("console343434343434", response.data[0], UserId);

          // setUsers(response?.data[0] || [])
          // setMyUsers(response?.data[0] || [])
          let color = [];
          for (let i = 0; i < response.data[0].length; i++) {
            color.push(generateRandomColor());
          }

          let chatList = [];
          response?.data[0]?.map((item, index) => {
            if (item?.username) {
              chatList = [...chatList, item];
            } else if (item?.Group_Name) {
              item?.Assign_User?.filter((user) => {
                if (parseInt(user.id) === parseInt(UserId)) {
                  chatList = [...chatList, item];
                }
              });
            }
          });

          setUsers(chatList || []);
          setMyUsers(chatList || []);
          setRandomColors(color);
          // getGroupLists(response?.data)
          setLoaderLeft(false);
        });
    } catch (error) {
      console.log(error, error == "Request failed with status code 500");
      // toast.error("Network Error", {
      //   position: "top-right",
      //   autoClose: 2000,
      // })
    }
  };

  // chat group list
  // const getGroupLists = async (myUser) => {
  //   let userLists = [...myUser]
  //   setLoaderLeft(true)
  //   try {
  //     await axios
  //       .get(`${BASE_URL}/user/UserChatGroupList/`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //           "db": item
  //         },
  //       })
  //       .then((res) => {
  //         if (res?.data?.length > 0) {
  //           res?.data?.results?.forEach((item) => userLists?.unshift(item));
  //           setMyUsers(userLists);
  //         }
  //         setUserId(UserId)
  //         setLoaderLeft(false)
  //         // console.log("list2", userLists, users);

  //       })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // console.log("list2", users);

  // get handleOnclickUserProfile

  // user click handler
  const handleOnclickUserProfile = async (items) => {
    // setLoaderLeft(true)
    console.log("usersss", items);
    let recievedId = item.username && items?.id;
    try {
      await axios
        .get(
          `${BASE_URL}/user/UserChatMasterCRUD/?RecevierId=${items?.id}&SenderId=${UserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
              db: item,
            },
          }
        )
        .then((res) => {
          if (res.data) {
            const reversedArray = res?.data;
            console.log("userssschat", reversedArray);
            setSelectedIndex(0);

            setSelectUser({
              username: items?.username || "No Name",
              id: items?.id || "",
              User_Login_Status: items?.User_Login_Status || false,
              Created_Date: items?.Created_Date,
            });

            items?.User_Login_Status === true
              ? setUserOnline(true)
              : setUserOnline(false);

            setUserChats(reversedArray || []);
            scrollToBottom();
            setDeleteIcon(null);
            // setCallingURI("")
          }
        });
    } catch (error) {
      console.log(error);
      if (error) {
        // toast.error("Network Error", {
        //   position: "top-right",
        //   autoClose: 2000,
        // })
      }
    }
  };

  // group click handlers
  const handleOnclickGroupProfile = async (items, user) => {
    // setLoaderLeft(true)

    try {
      await axios
        .get(
          `${BASE_URL}/user/UserGroupChatMasterCRUD/?RecevierId=${user}&SenderId=${UserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
              db: item,
            },
          }
        )
        .then((res) => {
          if (res.data) {
            const reversedArray = res?.data?.Messages;
            setSelectedIndex(0);
            let AssignUser = items?.Assign_User?.filter(
              (item) => item.id !== parseInt(UserId)
            );
            let myAccount = items?.Assign_User?.find(
              (item) => item.id === parseInt(UserId)
            );
            AssignUser?.unshift(myAccount);

            console.log("groupsss", items, AssignUser, myAccount);
            setSelectUser({
              username: items?.Group_Name || items?.username || "No Name",
              id: items?.id || "",
              User_Photo: items?.User_Photo,
              Created_Date: items?.Created_Date,
              Description: items?.Description || "",
              Assign_User: AssignUser || [],
            });

            // item?.User_Login_Status === true ? setUserOnline(true) : setUserOnline(false)

            setUserChats(reversedArray || []);
            scrollToBottom();
            setDeleteIcon(null);
            // setCallingURI("")
          }
        });
    } catch (error) {
      console.log(error);
      if (error) {
        // toast.error("Network Error", {
        //   position: "top-right",
        //   autoClose: 2000,
        // })
      }
    }
  };

  // send user message
  const sendUsersMessage = async (sendUsersMessage, type) => {
    // let selectuser = selectUser?.Assign_User?.length === 0 ? parseInt(selectUser?.id) :
    //   selectUser?.Assign_User?.map(userId => userId?.id);
    // console.log("selectUser", selectuser, selectUser)
    if (
      (message !== "" && message !== undefined && message !== null) ||
      (base64Data !== "" && fileName?.name !== "") ||
      sendUsersMessage !== ""
    ) {
      try {
        const payload = {
          RecevierName: selectUser?.username,
          Meassage: message,
          File: base64Data || "",
          Jitci: sendUsersMessage,
          Audio: null,
          Video_Answer: type === "video" ? "connecting" : "",
          Audio_Answer: type === "audio" ? "connecting" : "",
          File_Name: fileName?.name || "",
          Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
          SenderId: parseInt(localStorage.getItem("UserId")),
          Receiver_Id: selectUser?.id,
        };
        console.log("userChats", payload);
        await axios
          .post(`${BASE_URL}/user/UserChatMasterCRUD/`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
              db: item,
            },
          })
          .then((res) => {
            setMessage("");
            let datas = [...users];
            if (selectUser?.id) {
              let findIndex = datas.findIndex(
                (user) => user.id === selectUser?.id
              );
              let backup = datas.splice(findIndex, 1);
              datas.unshift(backup[0]);
              setUsers(datas);
              // console.log("error", datas, backup)
            }
            setBase64Data("");
            setFileName("");
            setLocalFile("");
            setSendLoader(false);
            handleOnclickUserProfile(selectUser);
          })
          .catch((error) => {
            if (error.response && error.response.status === 403) {
              const errorMessage =
                error.response.data.details ||
                "You don't have permission to do it";
              console.log(errorMessage);
              toast.error(errorMessage, {
                position: "top-right",
                autoClose: 100,
              });
            } else {
              toast.error(`${error}`, {
                position: "top-right",
                autoClose: 100,
              });
            }
          });
      } catch (error) {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
          console.log(errorMessage);
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 100,
          });
        } else {
          toast.error(`${error}`, {
            position: "top-right",
            autoClose: 100,
          });
        }
        setSendLoader(false);
      }
    } else {
      toast.error("can't send empty", {
        position: "top-right",
        autoClose: 1000,
      });
      setSendLoader(false);
    }
  };

  // send group messages
  const sendGroupMessage = async (sendUsersMessage, type) => {
    // let selectuser = selectUser?.Assign_User?.length === 0 ? parseInt(selectUser?.id) :
    let selectuser = selectUser?.Assign_User?.map((user) => user?.id);
    // console.log("selectUser", selectuser, selectUser)
    if (
      (message !== "" && message !== undefined && message !== null) ||
      (base64Data !== "" && fileName?.name !== "") ||
      sendUsersMessage !== ""
    ) {
      try {
        const payload = {
          RecevierName: localStorage.getItem("Username"),
          Meassage: message,
          File: base64Data || "",
          Jitci: sendUsersMessage,
          Audio: null,
          Video_Answer: type === "video" ? "connecting" : "",
          Audio_Answer: type === "audio" ? "connecting" : "",
          File_Name: fileName?.name || "",
          Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
          SenderId: parseInt(localStorage.getItem("UserId")),
          Receiver_Id: selectuser,
        };
        console.log("userChats", payload);
        await axios
          .post(`${BASE_URL}/user/UserGroupChatMasterCRUD/`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
              db: item,
            },
          })
          .then((res) => {
            setMessage("");
            let datas = [...users];
            if (selectUser?.id) {
              let findIndex = datas.findIndex(
                (user) => user.id === selectUser?.id
              );
              let backup = datas.splice(findIndex, 1);
              datas.unshift(backup[0]);
              setUsers(datas);
              // console.log("error", datas, backup)
            }
            setBase64Data("");
            setFileName("");
            setLocalFile("");
            setSendLoader(false);
            handleOnclickGroupProfile(selectUser, selectuser);
          })
          .catch((error) => {
            if (error.response && error.response.status === 403) {
              const errorMessage =
                error.response.data.details ||
                "You don't have permission to do it";
              console.log(errorMessage);
              toast.error(errorMessage, {
                position: "top-right",
                autoClose: 100,
              });
            } else {
              toast.error(`${error}`, {
                position: "top-right",
                autoClose: 100,
              });
            }
          });
      } catch (error) {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
          console.log(errorMessage);
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 100,
          });
        } else {
          toast.error(`${error}`, {
            position: "top-right",
            autoClose: 100,
          });
        }
        setSendLoader(false);
      }
    } else {
      toast.error("can't send empty", {
        position: "top-right",
        autoClose: 1000,
      });
      setSendLoader(false);
    }
  };

  // call handling function api
  const handlingUserCalls = async (types, chats) => {
    // console.log("types", types, types === "callend", userChats[userChats.length - 1])
    let chat = types === "callend" ? userChats[userChats.length - 1] : chats;
    types === "callend" || types === "declined"
      ? setCallingURI("")
      : setCallingURI(chat?.Jitci);

    try {
      const payload = {
        id: chat?.id,
        RecevierName: chat?.RecevierName || "",
        Meassage: chat?.Meassage,
        File: chat?.File || "",
        Jitci: chat?.Jitci || "",
        Video_Answer:
          (chat?.Video_Answer &&
            (chat?.Video_Answer === "connecting"
              ? types === "answer"
                ? "speaking"
                : "declined"
              : chat?.Video_Answer === "speaking"
              ? "callend"
              : "declined")) ||
          "",
        Audio_Answer:
          (chat?.Audio_Answer &&
            (chat?.Audio_Answer === "connecting"
              ? types === "answer"
                ? "speaking"
                : "declined"
              : chat?.Audio_Answer === "speaking"
              ? "callend"
              : "declined")) ||
          "",
        Audio: null,
        File_Name: "",
        Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
        SenderId: parseInt(localStorage.getItem("UserId")),
        Receiver_Id: chat?.Receiver_Id,
      };
      console.log("userChats", payload, chat);
      await axios
        .put(`${BASE_URL}/user/UserChatMasterCRUD/`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: item,
          },
        })
        .then((res) => {
          setMessage("");
          let datas = [...users];
          if (selectUser?.id) {
            let findIndex = datas.findIndex(
              (user) => user.id === selectUser?.id
            );
            let backup = datas.splice(findIndex, 1);
            datas.unshift(backup[0]);
            setUsers(datas);
            // console.log("error", datas, backup)
          }

          setBase64Data("");
          setFileName("");
          handleOnclickUserProfile(selectUser);
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            const errorMessage =
              error.response.data.details ||
              "You don't have permission to do it";
            console.log(errorMessage);
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 100,
            });
          } else {
            toast.error(`${error}`, {
              position: "top-right",
              autoClose: 100,
            });
          }
        });
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const errorMessage =
          error.response.data.details || "You don't have permission to do it";
        console.log(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 100,
        });
      } else {
        toast.error(`${error}`, {
          position: "top-right",
          autoClose: 100,
        });
      }
    }
  };

  const handlingGroupCalls = async (types, chats) => {
    // console.log("types", types, types === "callend", userChats[userChats.length - 1])
    let chat = types === "callend" ? userChats[userChats.length - 1] : chats;
    types === "callend" || types === "declined"
      ? setCallingURI("")
      : setCallingURI(chat?.Jitci);
    let Assign_Users = selectUser?.Assign_User?.map((item) => item.id);
    try {
      const payload = {
        id: chat?.id,
        RecevierName: chat?.RecevierName || "",
        Meassage: chat?.Meassage,
        File: chat?.File || "",
        Jitci: chat?.Jitci || "",
        Video_Answer:
          (chat?.Video_Answer &&
            (chat?.Video_Answer === "connecting"
              ? types === "answer"
                ? "speaking"
                : "declined"
              : chat?.Video_Answer === "speaking"
              ? "callend"
              : "declined")) ||
          "",
        Audio_Answer:
          (chat?.Audio_Answer &&
            (chat?.Audio_Answer === "connecting"
              ? types === "answer"
                ? "speaking"
                : "declined"
              : chat?.Audio_Answer === "speaking"
              ? "callend"
              : "declined")) ||
          "",
        Audio: null,
        File_Name: "",
        Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
        SenderId: parseInt(localStorage.getItem("UserId")),
        Receiver_Id: Assign_Users,
      };
      console.log("userChats", payload, chat);
      await axios
        .put(`${BASE_URL}/user/UserGroupChatMasterCRUD/`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: item,
          },
        })
        .then((res) => {
          setMessage("");
          let datas = [...users];
          if (selectUser?.id) {
            let findIndex = datas.findIndex(
              (user) => user.id === selectUser?.id
            );
            let backup = datas.splice(findIndex, 1);
            datas.unshift(backup[0]);
            setUsers(datas);
            // console.log("error", datas, backup)
          }

          setBase64Data("");
          setFileName("");
          handleOnclickGroupProfile(selectUser, Assign_Users);
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            const errorMessage =
              error.response.data.details ||
              "You don't have permission to do it";
            console.log(errorMessage);
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 100,
            });
          } else {
            toast.error(`${error}`, {
              position: "top-right",
              autoClose: 100,
            });
          }
        });
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const errorMessage =
          error.response.data.details || "You don't have permission to do it";
        console.log(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 100,
        });
      } else {
        toast.error(`${error}`, {
          position: "top-right",
          autoClose: 100,
        });
      }
    }
  };

  // delete message
  const userDeleteMsg = async (chat) => {
    // console.log("users", chat);
    // setLoaderLeft(true)
    try {
      await axios
        .delete(`${BASE_URL}/user/UserChatMasterCRUD/?id=${chat?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: item,
          },
        })
        .then((res) => {
          handleOnclickUserProfile(selectUser);
          setDeleteIcon(null);
          // setLoaderLeft(false)
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            const errorMessage =
              error.response.data.details ||
              "You don't have permission to do it";
            console.log(errorMessage);
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 100,
            });
          } else {
            toast.error(`${error}`, {
              position: "top-right",
              autoClose: 100,
            });
          }
        });
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 403) {
        const errorMessage =
          error.response.data.details || "You don't have permission to do it";
        console.log(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 100,
        });
      } else {
        toast.error(`${error}`, {
          position: "top-right",
          autoClose: 100,
        });
      }
    }
  };

  const groupDeleteMsg = async (chat) => {
    // console.log("users", chat);
    // setLoaderLeft(true)
    try {
      await axios
        .delete(`${BASE_URL}/user/UserGroupChatMasterCRUD/?id=${chat?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: item,
          },
        })
        .then((res) => {
          let Assign_Users = selectUser?.Assign_User?.map((item) => item.id);
          handleOnclickGroupProfile(selectUser, Assign_Users);
          setDeleteIcon(null);
          // setLoaderLeft(false)
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            const errorMessage =
              error.response.data.details ||
              "You don't have permission to do it";
            console.log(errorMessage);
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 100,
            });
          } else {
            toast.error(`${error}`, {
              position: "top-right",
              autoClose: 100,
            });
          }
        });
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 403) {
        const errorMessage =
          error.response.data.details || "You don't have permission to do it";
        console.log(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 100,
        });
      } else {
        toast.error(`${error}`, {
          position: "top-right",
          autoClose: 100,
        });
      }
    }
  };

  // update Group Profile
  const updateGroupProfile = async (selectuser, baseUrl, file) => {
    let Assign_Users = (
      selectuser?.Assign_User || selectUser?.Assign_User
    )?.map((item) => item.id);
    Assign_Users?.push(parseInt(UserId));
    // setLoaderLeft(true)

    console.log("updatepayload", selectuser, "baseUrl", baseUrl, file);

    const payload = {
      id: selectUser?.id,
      Group_Name: groupName === "" ? selectUser?.username : groupName,
      // "Assign_User_Name": [],
      Updated_Date: new Date().toISOString(),
      User_Photo: baseUrl || selectUser?.User_Photo,
      File_Name: file?.name || "nothing",
      Description: selectUser?.Description || "",
      Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
      Created_By: parseInt(localStorage.getItem("UserId")),
      Updated_By: parseInt(localStorage.getItem("UserId")),
      Assign_User: Assign_Users,
    };
    try {
      await axios
        .put(`${BASE_URL}/user/UserChatGroupCRUD/`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: item,
          },
        })
        .then(async (json) => {
          // getGroupLists();
          toast.success("Update successfully", {
            position: "top-right",
            autoClose: 2000,
          });
          setAnchorEl(null);
          setShowEdit(false);
          // setLoaderLeft(false)
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            const errorMessage =
              error.response.data.details ||
              "You don't have permission to do it";
            console.log(errorMessage);
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 100,
            });
          } else {
            toast.error(`${error}`, {
              position: "top-right",
              autoClose: 100,
            });
          }
        });
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 403) {
        const errorMessage =
          error.response.data.details || "You don't have permission to do it";
        console.log(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 100,
        });
      } else {
        toast.error(`${error}`, {
          position: "top-right",
          autoClose: 100,
        });
      }
    }
  };

  // search api
  const SearchData = (e) => {
    e.target.value !== "" ? handleSearch(e.target.value) : getUsersChatLists();
  };
  const handleSearch = (search) => {
    axios
      .get(
        `${BASE_URL}/user/ChatUsersGroupSearchList/?User_Name=${search}&id=${localStorage.getItem(
          "UserId"
        )}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        let color = [];
        for (let i = 0; i < response.data[0].length; i++) {
          color.push(generateRandomColor());
        }

        let chatList = [];
        response?.data[0]?.map((item, index) => {
          if (item?.username) {
            chatList = [...chatList, item];
          } else if (item?.Group_Name) {
            item?.Assign_User?.filter((user) => {
              if (parseInt(user.id) === parseInt(UserId)) {
                chatList = [...chatList, item];
              }
            });
          }
        });

        setUsers(chatList || []);
        setMyUsers(chatList || []);
        setRandomColors(color);
        // getGroupLists(response?.data)
        setLoaderLeft(false);
      });
  };

  useEffect(() => {
    getUsersChatLists();
    setUserId(localStorage.getItem("UserId"));
    // scrollToBottom()
  }, [showUserlists]);

  // chat scrollintoview
  useEffect(() => {
    scrollToBottom();
  }, [userChats, userId]);

  // useEffect(()=>{
  //   getUsersChatLists();
  //   handleOnclickUserProfile(selectUser)
  // },[showEdit])

  const scrollToBottom = () => {
    // if (scrollRef.current) {
    //   const lastMessage = scrollRef.current.lastChild;
    //   lastMessage?.scrollIntoView({ behavior: 'auto', block: 'end' });
    // }
  };

  // useEffect(() => {
  //   const clear = setInterval(() => {
  //     let users = selectUser?.Assign_User?.map(id => id?.id)
  //     selectUser?.Assign_User ? handleOnclickGroupProfile(selectUser, users) : handleOnclickUserProfile(selectUser)
  //   }, 2000)

  //   return () => {
  //     clearInterval(clear)
  //   }
  // }, [userChats]);

  // emoji function
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showEmojiPicker1, setShowEmojiPicker1] = useState(false);
  const handleEmojiClick = (event, emojiObject) => {
    const emoji = event.emoji;
    // console.log("emoji", event, emojiObject)
    setMessage(message + emoji);
    setShowEmojiPicker(false); // Close the emoji picker
  };

  const handleEmojiClick1 = (event, emojiObject) => {
    const emoji = event.emoji;
    // console.log("emoji", event, emojiObject)
    setGroupName(groupName + emoji);
    setShowEmojiPicker1(false); // Close the emoji picker
  };

  // video and audio call generated
  const generateURL = (type) => {
    let ran = "";
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 50; i++) {
      ran += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    let meetingUrl = "";
    if (type === "audio") {
      meetingUrl = `https://meet.jit.si/FoyerTech/${ran}#config.prejoinPageEnabled=false&config.startWithAudioMuted=true&config.startWithVideoMuted=true&interfaceConfig.TOOLBAR_BUTTONS=["microphone"]`;
    } else {
      meetingUrl = `https://meet.jit.si/FoyerTech/${ran}`;
    }
    console.log("jitsi check", selectUser);
    // window.open(meetingUrl, '_blank')
    setCallingURI(meetingUrl);
    meetingUrl !== "" && !selectUser?.Assign_User
      ? sendUsersMessage(meetingUrl, type)
      : sendGroupMessage(meetingUrl, type);

    console.log("meetingUrl", meetingUrl);
  };

  // handling name change function
  // const handlingNameChange = () => {
  //   let UserProfile = [...myUsers];
  //   const findIndex = UserProfile?.findIndex(user => user?.id === selectUser?.id)
  //   UserProfile[findIndex].username = groupName || "";
  //   setShowEdit(false);
  //   setMyUsers(UserProfile)
  //   setSelectUser({ ...selectUser, username: groupName })
  // }

  return (
    <JumboContentLayoutMain>
      <ToastContainer />

      <Div sx={{ position: "relative" }}>
        <Grid container>
          {/* left side */}
          <Grid
            item
            xs={12}
            md={4}
            lg={4}
            xl={4}
            sx={{ backgroundColor: "rgba(53, 109, 101,0.1)" }}
          >
            <Div>
              <AppBar
                sx={{ backgroundColor: "rgba(53, 109, 101,1) !important" }}
                position="static"
              >
                <Toolbar
                  sx={{ padding: "0px !important", m: "0px !important" }}
                >
                  {showUserlists && (
                    <IconButton
                      onClick={() => {
                        setShowUserlists(false);
                      }}
                    >
                      <IoMdArrowBack color="white" />
                    </IconButton>
                  )}
                  <SearchBar SearchData={SearchData} />
                  {!showUserlists && (
                    <IconButton
                      onClick={() => {
                        setShowUserlists(true);
                      }}
                    >
                      <MdGroupAdd size={22} color="white" />
                    </IconButton>
                  )}
                </Toolbar>
              </AppBar>
              <Div sx={{ height: "100%" }}>
                <JumboScrollbar
                  autoHeight={true}
                  autoHeightMin={"88vh"}
                  autoHideTimeOut={4000}
                >
                  {!showUserlists && myUsers.length > 0 ? (
                    myUsers?.map((item, index) => {
                      let pic = item?.User_Photo;
                      console.log("item", pic !== "", item);

                      return (
                        <>
                          <Div
                            onClick={() => {
                              let users = item?.Assign_User
                                ? item?.Assign_User?.map((id) => id?.id)
                                : [item?.id];
                              {
                                !item?.Group_Name
                                  ? handleOnclickUserProfile(item)
                                  : handleOnclickGroupProfile(item, users);
                              }
                            }}
                            key={index}
                            sx={{
                              boxShadow: "0px 0px 4px lightgray",
                              backgroundColor: "rgba(255,255,255,0.8)",
                              ":hover": {
                                backgroundColor: "rgba(247,247,247,1)",
                                cursor: "pointer",
                              },
                              m: 1,
                              p: 1.3,
                              borderRadius: "5px",
                              px: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Div
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Div>
                                {item?.User_Photo !== "" &&
                                !item?.Group_Name ? (
                                  <Avatar
                                    sx={{
                                      bgcolor: randomColors[index] || "",
                                      width: "30px",
                                      height: "30px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {item?.username
                                      ?.substring(0, 2)
                                      ?.toUpperCase() ||
                                      item?.Group_Name?.substring(
                                        0,
                                        2
                                      )?.toUpperCase() ||
                                      ""}
                                  </Avatar>
                                ) : (
                                  <img
                                    src={BASE_URL + item?.User_Photo}
                                    alt="user"
                                    width={30}
                                    height={30}
                                    className="rounded-pill"
                                  />
                                )}
                              </Div>
                              <Div>
                                <Typography sx={{ fontSize: "13px" }}>
                                  {item?.username?.substring(0, 30) ||
                                    item?.Group_Name?.substring(0, 30) ||
                                    ""}
                                </Typography>
                              </Div>
                            </Div>
                            <Div
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              {!item?.Group_Name && (
                                <Typography sx={{ fontSize: "10px" }}>
                                  <span
                                    sx={{ color: "#1DB700", fontSize: "10px" }}
                                  >
                                    <PiCircleFill
                                      color={
                                        item?.User_Login_Status
                                          ? "#4cbb17"
                                          : "lightgray"
                                      }
                                    />{" "}
                                  </span>
                                  {item?.User_Login_Status
                                    ? "Online"
                                    : "Offline"}
                                </Typography>
                              )}

                              {/* <Div><Typography sx={{ fontSize: "13px" }}>10 min</Typography></Div> */}
                              {/* <Div>
                            <MoreVertIcon
                              sx={{ pr: 1, fontSize: 26 }}
                            />
                          </Div> */}
                            </Div>
                          </Div>
                        </>
                      );
                    })
                  ) : (
                    <Div
                      onClick={() => {
                        setShowUserlists(true);
                      }}
                      sx={{
                        display: myUsers.length > 0 ? "none" : "flex",
                        cursor: "pointer",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "80vh",
                      }}
                    >
                      <Typography
                        sx={{
                          textAlign: "center",
                          width: "80%",
                          fontSize: "14px",
                        }}
                      >
                        To start messsaging contacts who have CRMForm, tap on
                        your screen.{" "}
                      </Typography>
                    </Div>
                  )}

                  {showUserlists && (
                    <Div>
                      <CreateGroupAndUserlists
                        myUsers={myUsers}
                        setMyUsers={setMyUsers}
                        randomColors={randomColors}
                        users={users}
                        setShowUserlists={setShowUserlists}
                      />
                    </Div>
                  )}
                </JumboScrollbar>
              </Div>
            </Div>
          </Grid>

          {/* right side */}

          {/* overview */}
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: "1px",
                boxShadow: 2,
                bgcolor: "rgba(230,230,230,0.9)",
              },
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <Div>
              <Grid container sx={{ minWidth: "400px", height: "100%" }}>
                <Grid
                  item
                  xs={4}
                  md={4}
                  lg={4}
                  mt={3}
                  pr={1}
                  sx={{ width: "100%", height: "100%" }}
                >
                  {/* <Box sx={{ bgcolor: 'background.paper' }}> */}
                  <List component="nav" aria-label="main overview">
                    <ListItemButton
                      sx={{
                        py: "5px !important",
                        gap: 1,
                        boxSizing: "border-box",
                        borderRadius: "3px",
                        borderLeft:
                          selectedIndex === 0
                            ? "3px solid rgba(53, 109, 101,1)"
                            : "3px solid rgba(53, 109, 101,0)",
                      }}
                      selected={selectedIndex === 0}
                      onClick={(event) => {
                        handleListItemClick(event, 0);
                        setShowEdit(false);
                      }}
                    >
                      {/* <ListItemIcon> */}
                      <LiaInfoCircleSolid
                        size={18}
                        style={{ marginLeft: "-7px" }}
                      />
                      {/* </ListItemIcon> */}
                      <ListItemText primary="Overview" />
                    </ListItemButton>
                    {selectUser?.Assign_User?.length > 0 && (
                      <ListItemButton
                        sx={{
                          py: "5px !important",
                          gap: 1,
                          boxSizing: "border-box",
                          borderRadius: "3px",
                          borderLeft:
                            selectedIndex === 1
                              ? "3px solid rgba(53, 109, 101,1)"
                              : "3px solid rgba(53, 109, 101,0)",
                        }}
                        selected={selectedIndex === 1}
                        onClick={(event) => {
                          handleListItemClick(event, 1);
                          setShowEdit(false);
                        }}
                      >
                        {/* <ListItemIcon> */}
                        <HiOutlineUsers
                          size={18}
                          style={{ marginLeft: "-7px" }}
                        />
                        {/* </ListItemIcon> */}
                        <ListItemText primary="Participants" />
                      </ListItemButton>
                    )}
                  </List>

                  {/* </Box> */}
                </Grid>

                <Grid
                  item
                  xs={8}
                  md={8}
                  lg={8}
                  sx={{ width: "300px", height: "450px", bgcolor: "#FAFAFA" }}
                >
                  {/* group or personal Info */}
                  {selectedIndex === 0 && (
                    <Div>
                      <Div sx={{ px: "10px", py: 3 }}>
                        <Div
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Div
                            sx={{
                              width: "70px",
                              height: "70px",
                              position: "relative",
                              cursor: "pointer",
                            }}
                            onMouseOver={() => {
                              selectUser?.Assign_User &&
                                setUpdateProfilePic(true);
                            }}
                            onMouseLeave={() => {
                              selectUser?.Assign_User &&
                                setUpdateProfilePic(false);
                            }}
                          >
                            {!selectUser?.Assign_User ? (
                              <Avatar
                                sx={{
                                  bgcolor: generateRandomColor() || "",
                                  width: "100%",
                                  height: "100%",

                                  // ":hover":setUpdateProfilePic(true)
                                }}
                              >
                                {selectUser?.username
                                  ?.substring(0, 2)
                                  ?.toUpperCase() ||
                                  selectUser?.Group_Name?.substring(
                                    0,
                                    2
                                  )?.toUpperCase() ||
                                  ""}
                              </Avatar>
                            ) : (
                              <img
                                style={{
                                  border: "5px solid gray",
                                  width: "100%",
                                  height: "100%",
                                }}
                                src={BASE_URL + selectUser?.User_Photo}
                                alt="user"
                                className="rounded-pill"
                              />
                            )}
                            {updateProfilePic && selectUser?.Assign_User && (
                              <Div
                                sx={{
                                  cursor: "pointer",
                                  position: "absolute",
                                  borderRadius: "50%",
                                  top: 0,
                                  width: "100%",
                                  height: "100%",
                                  backgroundColor: "rgba(0,0,0,0.4)",
                                }}
                              >
                                <IconButton
                                  style={{ transform: "translate(36%, 36%)" }}
                                >
                                  <input
                                    type="file"
                                    id="groupProfile"
                                    style={{ display: "none" }}
                                    onChange={handleFileUploadImg}
                                  />
                                  <label
                                    htmlFor="groupProfile"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <FaCamera color="lightgray" size={25} />
                                  </label>
                                </IconButton>
                              </Div>
                            )}
                          </Div>
                        </Div>
                        <Div>
                          <Div sx={{ my: 2 }}>
                            {!showEdit && (
                              <Div
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 1,
                                }}
                              >
                                <Typography variant="h3" mt={0.5}>
                                  {selectUser?.username}
                                </Typography>
                                {selectUser?.Assign_User && (
                                  <IconButton
                                    onClick={() => {
                                      setShowEdit(true);
                                      setGroupName(selectUser?.username || "");
                                    }}
                                  >
                                    <TfiPencil size={15} />
                                  </IconButton>
                                )}
                              </Div>
                            )}

                            {showEdit && selectUser?.Assign_User && (
                              <Div sx={{ position: "relative" }}>
                                <FormControl sx={{ width: "100% !important" }}>
                                  <OutlinedInput
                                    value={groupName}
                                    onChange={(e) =>
                                      setGroupName(e.target.value)
                                    }
                                    sx={{
                                      width: "100%",
                                      maxHeight: "33px !important",
                                      textAlign: "center",
                                    }}
                                    placeholder="Enter name"
                                  />
                                </FormControl>
                                {showEmojiPicker1 && (
                                  <Div
                                    sx={{
                                      position: "absolute",
                                      top: 0,
                                      zIndex: 11,
                                      left: 0,
                                    }}
                                  >
                                    <Picker onEmojiClick={handleEmojiClick1} />
                                  </Div>
                                )}
                                <Div sx={{ float: "right" }}>
                                  <IconButton
                                    onClick={() =>
                                      setShowEmojiPicker1(!showEmojiPicker1)
                                    }
                                  >
                                    <MdOutlineEmojiEmotions
                                      style={{ cursor: "pointer" }}
                                      size={18}
                                    />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      updateGroupProfile();
                                    }}
                                  >
                                    <BiSolidCheckCircle
                                      size={18}
                                      color="green"
                                    />
                                  </IconButton>
                                </Div>
                              </Div>
                            )}
                          </Div>
                          <Div sx={{ my: 1 }}>
                            <Typography>Created</Typography>
                            <Typography sx={{ color: "black" }}>
                              {new Date(
                                selectUser?.Created_Date
                              )?.toDateString() || ""}
                            </Typography>
                          </Div>

                          {selectUser?.Assign_User && (
                            <Div sx={{ my: 1 }}>
                              <Typography>Description</Typography>
                              <Typography sx={{ color: "black" }}>
                                {selectUser?.Description}
                              </Typography>
                            </Div>
                          )}
                          {/* {selectUser?.Assign_User && <Typography >Group - {selectUser?.Assign_User?.length} participants</Typography>} */}
                        </Div>

                        {/* <Div sx={{ textAlign: 'center', mt: 2 }}>
                        <IconButton onClick={() => generateURL("video")} type="button" sx={{ p: '8px', }}><VideocamIcon sx={{ color: "green" }} /></IconButton>
                        <IconButton onClick={() => generateURL("audio")} type="button" sx={{ p: '8px', }}><CallIcon sx={{ color: "#007BFF" }} /></IconButton>
                      </Div> */}
                      </Div>
                    </Div>
                  )}

                  {selectedIndex === 1 &&
                    selectUser?.Assign_User?.length > 0 && (
                      <Div>
                        <Stack
                          sx={{
                            backgroundColor: "transparent !important",
                            p: 2,
                            pl: 0,
                            boxShadow: "none !important",
                          }}
                          position="static"
                        >
                          <SearchBar color={"gray"} border={1} />
                        </Stack>
                        <Div>
                          <Typography>
                            {" "}
                            Participants {selectUser?.Assign_User?.length}
                          </Typography>
                          <JumboScrollbar
                            autoHeight={true}
                            autoHeightMin={"360px"}
                            autoHideTimeOut={4000}
                          >
                            {selectUser?.Assign_User?.length > 0 ? (
                              selectUser?.Assign_User?.map((item, index) => {
                                let pic = item?.User_Photo;
                                // console.log("item", pic !== "")

                                return (
                                  <Div
                                    onClick={() => {
                                      handleOnclickUserProfile(item);
                                      setAnchorEl(null);
                                      setShowEdit(false);
                                    }}
                                    key={index}
                                    sx={{
                                      ":hover": {
                                        backgroundColor: "rgba(247,247,247,1)",
                                        cursor: "pointer",
                                      },
                                      p: 1,
                                      borderRadius: "5px",
                                      px: 1,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Div
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <Div>
                                        {item?.User_Photo !== "" ? (
                                          <Avatar
                                            sx={{
                                              bgcolor:
                                                randomColors[index] || "",
                                              width: "25px",
                                              height: "25px",
                                              fontSize: "10px",
                                            }}
                                          >
                                            {item?.username
                                              ?.substring(0, 2)
                                              ?.toUpperCase() ||
                                              item?.Group_Name?.substring(
                                                0,
                                                2
                                              )?.toUpperCase() ||
                                              ""}
                                          </Avatar>
                                        ) : (
                                          <img
                                            src={BASE_URL + item?.User_Photo}
                                            alt="user"
                                            width={25}
                                            height={25}
                                            className="rounded-pill"
                                          />
                                        )}
                                      </Div>
                                      <Div>
                                        <Typography
                                          sx={{
                                            fontSize: "13px",
                                            color:
                                              parseInt(item?.id) === UserId
                                                ? "green"
                                                : "",
                                          }}
                                        >
                                          {parseInt(item?.id) ===
                                          parseInt(UserId)
                                            ? "You"
                                            : item?.username}
                                        </Typography>
                                      </Div>
                                    </Div>
                                  </Div>
                                );
                              })
                            ) : (
                              <Div
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  sx={{
                                    textAlign: "center",
                                    width: "80%",
                                    fontSize: "14px",
                                  }}
                                >
                                  No membership
                                </Typography>
                              </Div>
                            )}
                          </JumboScrollbar>
                        </Div>
                      </Div>
                    )}
                </Grid>
              </Grid>
            </Div>
          </Popover>

          <Grid item xs={12} md={8} lg={8} xl={8} sx={{ bgcolor: "#FAFAFA" }}>
            <Div>
              {/* video and audio meeting or calling */}
              <Div
                style={{
                  position: "relative",
                  height: "100%",
                  display: callingURI === "" ? "none" : "",
                }}
              >
                {callingURI !== "" && (
                  <Div
                    sx={{ width: "100%", height: "102%", position: "relative" }}
                  >
                    {
                      <iframe
                        title="Jitsi Meet Video Call"
                        src={callingURI}
                        allow="camera; microphone; fullscreen; display-capture"
                        style={{ width: "100%", height: "100vh" }}
                      />
                    }

                    {save && (
                      <Div
                        sx={{
                          bgcolor: "rgba(0,0,0,0.9)",
                          width: "100%",
                          height: "100%",
                          top: 0,
                          position: "absolute",
                        }}
                      >
                        <Div
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                          }}
                        >
                          <Div
                            sx={{
                              bgcolor: "rgba(255,255,255,0.8)",
                              width: "450px",
                            }}
                          >
                            <DialogContent>
                              <DialogContentText
                                id="alert-dialog-slide-description"
                                sx={{
                                  fontSize: "16px",
                                  fontWeight: 600,
                                  color: "black",
                                  lineHeight: 2,
                                  width: "400px",
                                }}
                              >
                                Are you sure you want to end the call?
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button
                                className="dialog-save-btn"
                                sx={{ textAlign: "center" }}
                                onClick={() => {
                                  setSave(false);
                                  !selectUser?.Assign_User
                                    ? handlingUserCalls("callend")
                                    : handlingGroupCalls("callend");
                                  setCallingURI("");

                                  // handleReset();
                                }}
                              >
                                Yes
                              </Button>
                              <Button
                                variant="outlined"
                                className="dialog-cancel-btn"
                                onClick={() => {
                                  setSave(false);
                                }}
                              >
                                No
                              </Button>
                            </DialogActions>
                          </Div>
                        </Div>
                      </Div>
                    )}
                  </Div>
                )}

                <IconButton
                  onClick={() => {
                    setSave(true);
                  }}
                  sx={{
                    color: "red",
                    display: save ? "none" : "",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    zIndex: 1,
                  }}
                >
                  <CloseIcon color="red" />
                </IconButton>
              </Div>

              {/* header */}
              {Object?.keys(selectUser)?.length > 0 && (
                <Div sx={{ px: 1, display: callingURI !== "" ? "none" : "" }}>
                  <Div
                    sx={{
                      borderBottom: "1px solid lightgray",
                      py: 1.4,
                      gap: 1,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Div
                      onClick={handleClick}
                      sx={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Div>
                        {selectUser?.User_Photo !== "" &&
                        !selectUser?.Assign_User ? (
                          <Avatar
                            sx={{
                              bgcolor: generateRandomColor() || "",
                              width: "30px",
                              height: "30px",
                              fontSize: "14px",
                            }}
                          >
                            {selectUser?.username
                              ?.substring(0, 2)
                              ?.toUpperCase() ||
                              selectUser?.Group_Name?.substring(
                                0,
                                2
                              )?.toUpperCase() ||
                              ""}
                          </Avatar>
                        ) : (
                          <img
                            src={BASE_URL + selectUser?.User_Photo}
                            alt="user"
                            width={30}
                            height={30}
                            className="rounded-pill"
                          />
                        )}
                      </Div>
                      <Div>
                        <Typography
                          variant="h3"
                          sx={{ paddingLeft: "8px", m: 0, fontSize: "18px" }}
                        >
                          {selectUser?.username || ""}
                          {userOnline && !selectUser?.Assign_User ? (
                            <Typography sx={{ fontSize: "10px" }}>
                              <span sx={{ color: "#1DB700", fontSize: "10px" }}>
                                🟢{" "}
                              </span>
                              Online
                            </Typography>
                          ) : (
                            <Div
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              {selectUser?.Assign_User?.map((member, index) => {
                                if (index <= 10) {
                                  return (
                                    <Typography
                                      sx={{ fontSize: "10px" }}
                                      key={index}
                                    >
                                      {parseInt(member?.id) === parseInt(UserId)
                                        ? "You"
                                        : member?.username?.split("_" || " ")[0]
                                            ?.length < 10
                                        ? member?.username?.split("_" || " ")[0]
                                        : member?.username?.substring(0, 9) +
                                          "..."}
                                      ,
                                    </Typography>
                                  );
                                }
                              })}
                            </Div>
                          )}
                        </Typography>
                      </Div>
                    </Div>
                    <Div
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "right",
                      }}
                    >
                      <Div></Div>
                      <Div>
                        <IconButton
                          onClick={() => generateURL("video")}
                          type="button"
                          sx={{ p: "8px" }}
                        >
                          <VideocamIcon sx={{ color: "green" }} />
                        </IconButton>
                        <IconButton
                          onClick={() => generateURL("audio")}
                          type="button"
                          sx={{ p: "8px" }}
                        >
                          <CallIcon sx={{ color: "#007BFF" }} />
                        </IconButton>
                      </Div>
                    </Div>
                  </Div>

                  <Div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    sx={{ position: "relative !important" }}
                  >
                    <JumboScrollbar
                      autoHeight={true}
                      autoHeightMin={"75vh"}
                      autoHideTimeOut={1000}
                      ref={scrollRef}
                    >
                      {
                        <Div>
                          {userChats?.length > 0 &&
                            userChats?.map((chat, index) => {
                              const date = new Date(chat?.SendedDate);
                              const options = {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true, // Use 12-hour format (AM/PM)
                                // timeZoneName: 'short',
                                // timeZone: 'Asia/Kolkata', // Indian Standard Time
                              };
                              const formattedTime = date?.toLocaleString(
                                "en-US",
                                options
                              );
                              // console.log("summa", chat?.SenderId, "userId", userId, chat?.SenderId != userId)
                              let lastPart = "";
                              let fileName = "";
                              if (chat?.File) {
                                const parts = chat?.File?.split(".");
                                lastPart = parts[parts?.length - 1];
                                const partsName = chat?.File?.split("/");
                                fileName = partsName[partsName?.length - 1];
                              }

                              console.log("chat", chat, UserId);
                              // alert(`${chat?.SenderId } ,${userId}`)
                              return (
                                <Div
                                  key={index}
                                  ref={
                                    index === userChats.length - 1
                                      ? scrollRef
                                      : null
                                  }
                                  sx={{ m: 2 }}
                                >
                                  {parseInt(chat?.SenderId) === UserId ? (
                                    <Div
                                      sx={{
                                        my: "25px !important",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Div>
                                        <Div
                                          mb={2}
                                          sx={{
                                            position: "relative",
                                          }}
                                        >
                                          <Div
                                            sx={{
                                              display: "flex",
                                              justifyContent: "end",
                                            }}
                                          >
                                            {
                                              <Div
                                                sx={{
                                                  padding: 1,
                                                  mr: 1,
                                                  borderRadius: "5px",
                                                  bgcolor: "#d6e5db",
                                                  width: "100% !important",
                                                }}
                                              >
                                                <Typography
                                                  sx={{ mb: -0.2 }}
                                                  variant="h3"
                                                >
                                                  {chat?.SenderId === UserId
                                                    ? "You"
                                                    : chat?.RecevierName || ""}
                                                </Typography>
                                                {
                                                  <Div
                                                    style={{
                                                      marginTop: "10px",
                                                      marginRight: "7px",
                                                    }}
                                                  >
                                                    {AudioFormats?.includes(
                                                      lastPart
                                                    ) && (
                                                      <audio controls>
                                                        <source
                                                          src={
                                                            BASE_URL +
                                                              chat?.File ||
                                                            "no file"
                                                          }
                                                          type="audio/ogg"
                                                        />
                                                        <source
                                                          src={
                                                            BASE_URL +
                                                              chat?.File ||
                                                            "no file"
                                                          }
                                                          type="audio/mpeg"
                                                        />
                                                        <source
                                                          src={
                                                            BASE_URL +
                                                              chat?.File ||
                                                            "no file"
                                                          }
                                                          type="audio/mp3"
                                                        />
                                                      </audio>
                                                    )}

                                                    {VideoFormats?.includes(
                                                      lastPart
                                                    ) && (
                                                      <video
                                                        width="320"
                                                        height="240"
                                                        controls
                                                      >
                                                        <source
                                                          src={
                                                            BASE_URL +
                                                              chat?.File ||
                                                            "no file"
                                                          }
                                                          type="video/mp4"
                                                        />
                                                        <source
                                                          src={
                                                            BASE_URL +
                                                              chat?.File ||
                                                            "no file"
                                                          }
                                                          type="video/ogg"
                                                        />
                                                      </video>
                                                    )}

                                                    {ImageFormats?.includes(
                                                      lastPart
                                                    ) && (
                                                      <img
                                                        src={
                                                          BASE_URL +
                                                            chat?.File ||
                                                          "no file"
                                                        }
                                                        width="280"
                                                        height="200"
                                                        type="image/jpeg"
                                                      />
                                                    )}

                                                    {FileFormats?.includes(
                                                      lastPart
                                                    ) && (
                                                      <Div
                                                        sx={{
                                                          padding: 1,
                                                          mr: 2,
                                                          borderRadius: "5px",
                                                          bgcolor: "ghostwhite",
                                                          width:
                                                            "100% !important",
                                                          display: "flex",
                                                          alignItems: "center",
                                                          gap: 5,
                                                        }}
                                                      >
                                                        <a
                                                          style={{
                                                            textDecoration:
                                                              "none",
                                                            color: "#000",
                                                          }}
                                                          href={
                                                            BASE_URL +
                                                            chat?.File
                                                          } // Replace with the path to your PDF file
                                                          target="_blank"
                                                          download={
                                                            BASE_URL +
                                                            chat?.File
                                                          }
                                                        >
                                                          <AiFillFile
                                                            size={20}
                                                            color="gray"
                                                          />{" "}
                                                          {fileName}
                                                        </a>

                                                        <a
                                                          style={{
                                                            textDecoration:
                                                              "none",
                                                          }}
                                                          href={
                                                            BASE_URL +
                                                            chat?.File
                                                          } // Replace with the path to your PDF file
                                                          target="_blank"
                                                          download={
                                                            BASE_URL +
                                                            chat?.File
                                                          }
                                                          // download={true}
                                                        >
                                                          <MdArrowCircleDown
                                                            size={20}
                                                            color="gray"
                                                          />
                                                        </a>
                                                      </Div>
                                                    )}

                                                    {chat?.Jitci !== "" &&
                                                      chat?.Jitci !== null && (
                                                        <Div sx={{ px: 1 }}>
                                                          <Div
                                                            sx={{
                                                              display: "flex",
                                                              alignItems:
                                                                "center",
                                                              gap: 1,
                                                              justifyContent:
                                                                "space-between",
                                                            }}
                                                          >
                                                            <Div>
                                                              {/* <Typography sx={{ mb: -0.2 }} variant="h3">{chat?.SenderId === UserId?"You" : chat?.RecevierName || ""}</Typography> */}
                                                              {chat?.Audio_Answer !==
                                                                "" &&
                                                                chat?.Audio_Answer !==
                                                                  null &&
                                                                chat?.SenderId ==
                                                                  userId && (
                                                                  <Typography>
                                                                    Outgoing
                                                                    Voice Call
                                                                  </Typography>
                                                                )}
                                                              {chat?.Video_Answer !==
                                                                "" &&
                                                                chat?.Video_Answer !==
                                                                  null &&
                                                                chat?.SenderId ==
                                                                  userId && (
                                                                  <Typography>
                                                                    Outgoing
                                                                    Video Call
                                                                  </Typography>
                                                                )}
                                                              {chat?.Audio_Answer ===
                                                                "" &&
                                                                chat?.Audio_Answer !==
                                                                  null &&
                                                                chat?.SenderId !=
                                                                  userId && (
                                                                  <Typography>
                                                                    Incoming
                                                                    Voice Call
                                                                  </Typography>
                                                                )}
                                                              {chat?.Video_Answer ===
                                                                "" &&
                                                                chat?.Audio_Answer !==
                                                                  null &&
                                                                chat?.SenderId !=
                                                                  userId && (
                                                                  <Typography>
                                                                    Incoming
                                                                    Video Call
                                                                  </Typography>
                                                                )}
                                                              {(chat?.Video_Answer ===
                                                                "declined" ||
                                                                chat?.Audio_Answer ===
                                                                  "declined") && (
                                                                <Typography
                                                                  sx={{
                                                                    color:
                                                                      "red",
                                                                    mt: 1,
                                                                    mb: 0,
                                                                  }}
                                                                >
                                                                  Declined
                                                                </Typography>
                                                              )}
                                                              {(chat?.Video_Answer ===
                                                                "connecting" ||
                                                                chat?.Audio_Answer ===
                                                                  "connecting") &&
                                                                chat?.SenderId ==
                                                                  userId && (
                                                                  <Typography
                                                                    sx={{
                                                                      color:
                                                                        "green",
                                                                    }}
                                                                  >
                                                                    connecting...
                                                                  </Typography>
                                                                )}
                                                              {(chat?.Video_Answer ===
                                                                "speaking" ||
                                                                chat?.Audio_Answer ===
                                                                  "speaking") && (
                                                                <Typography
                                                                  sx={{
                                                                    color:
                                                                      "green",
                                                                  }}
                                                                >
                                                                  speaking...
                                                                </Typography>
                                                              )}
                                                              {(chat?.Video_Answer ===
                                                                "callend" ||
                                                                chat?.Audio_Answer ===
                                                                  "callend") && (
                                                                <Typography
                                                                  variant="h6"
                                                                  sx={{
                                                                    color:
                                                                      "red",
                                                                    mt: 1,
                                                                    mb: 0,
                                                                  }}
                                                                >
                                                                  Call End
                                                                </Typography>
                                                              )}
                                                            </Div>
                                                            <Div>
                                                              {chat?.SenderId !=
                                                                userId && (
                                                                <PiArrowDownLeft
                                                                  color="green"
                                                                  size={20}
                                                                />
                                                              )}
                                                              {chat?.SenderId ==
                                                                userId && (
                                                                <PiArrowUpRight
                                                                  color="navy"
                                                                  size={20}
                                                                />
                                                              )}
                                                              {chat?.SenderId ===
                                                                userId && (
                                                                <PiArrowElbowLeft
                                                                  color="red"
                                                                  size={20}
                                                                />
                                                              )}
                                                            </Div>
                                                          </Div>
                                                          {
                                                            <Div
                                                              sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                  "center",
                                                                gap: 1,
                                                                mt: 1,
                                                              }}
                                                            >
                                                              {(chat?.Video_Answer ===
                                                                "connecting" ||
                                                                chat?.Video_Answer ===
                                                                  "speaking" ||
                                                                chat?.Audio_Answer ===
                                                                  "connecting" ||
                                                                chat?.Audio_Answer ===
                                                                  "speaking") && (
                                                                <Button
                                                                  onClick={() => {
                                                                    !selectUser?.Assign_User
                                                                      ? handlingUserCalls(
                                                                          "declined",
                                                                          chat
                                                                        )
                                                                      : handlingGroupCalls(
                                                                          "declined",
                                                                          chat
                                                                        );
                                                                  }}
                                                                  variant="contained"
                                                                  sx={{
                                                                    ":hover": {
                                                                      bgcolor:
                                                                        "#F84F31",
                                                                      opacity: 0.9,
                                                                    },
                                                                    bgcolor:
                                                                      "#F84F31",
                                                                    width:
                                                                      "100%",
                                                                    py: 1,
                                                                  }}
                                                                >
                                                                  <Typography>
                                                                    DECLINE
                                                                  </Typography>
                                                                </Button>
                                                              )}

                                                              {chat?.SenderId !=
                                                                userId &&
                                                                (chat?.Video_Answer !==
                                                                  "speaking" ||
                                                                  chat?.Audio_Answer !==
                                                                    "speaking") && (
                                                                  <a
                                                                    onClick={() => {
                                                                      !selectUser?.Assign_User
                                                                        ? handlingUserCalls(
                                                                            "answer",
                                                                            chat
                                                                          )
                                                                        : handlingGroupCalls(
                                                                            "answer",
                                                                            chat
                                                                          );
                                                                    }}
                                                                    style={{
                                                                      textDecoration:
                                                                        "none",
                                                                      width:
                                                                        "100%",
                                                                    }}
                                                                    href={
                                                                      chat?.Jitci
                                                                    }
                                                                    target="_blank"
                                                                  >
                                                                    <Button
                                                                      variant="contained"
                                                                      sx={{
                                                                        ":hover":
                                                                          {
                                                                            bgcolor:
                                                                              "#23C552",
                                                                            opacity: 0.9,
                                                                          },
                                                                        bgcolor:
                                                                          "#23C552",
                                                                        width:
                                                                          "100%",
                                                                        py: 1,
                                                                      }}
                                                                    >
                                                                      <Typography>
                                                                        ANSWER
                                                                      </Typography>
                                                                    </Button>
                                                                  </a>
                                                                )}
                                                            </Div>
                                                          }
                                                        </Div>
                                                      )}
                                                  </Div>
                                                }

                                                {chat?.Meassage !== "" && (
                                                  <Typography
                                                    xs={6}
                                                    sx={{ mt: 1 }}
                                                    sx={{ fontSize: "14px" }}
                                                  >
                                                    {chat?.Meassage || ""}
                                                  </Typography>
                                                )}
                                                {chat?.Meassage !== "" && (
                                                  <TextToSpeech
                                                    Meassage={
                                                      chat?.Meassage || ""
                                                    }
                                                  />
                                                )}
                                                <Grid align="right">
                                                  <Typography
                                                    variant="p"
                                                    noWrap={true}
                                                    sx={{
                                                      color: "black",
                                                      fontSize:
                                                        "10px !important",
                                                    }}
                                                  >
                                                    {formattedTime || ""}
                                                  </Typography>
                                                </Grid>
                                              </Div>
                                            }
                                          </Div>

                                          <Div
                                            sx={{
                                              ":after": {
                                                width: 0,
                                                position: "absolute",
                                                content: "'.'",
                                                height: 0,
                                                bottom: -10,
                                                right: 8,
                                                borderTop: "0px solid ",
                                                borderBottom:
                                                  "20px solid  transparent",
                                                // borderLeft: "none",
                                                borderRight:
                                                  "20px solid  #d6e5db",
                                              },
                                              zIndex: -2,
                                              // display: chat?.Meassage !== "" ? "" : 'none'
                                            }}
                                          ></Div>
                                        </Div>
                                      </Div>

                                      <Div sx={{ alignSelf: "flex-start" }}>
                                        {deleteIcon === index ? (
                                          <IconButton
                                            onClick={() =>
                                              selectUser?.Assign_User
                                                ? groupDeleteMsg(chat)
                                                : userDeleteMsg(chat)
                                            }
                                            sx={{
                                              backgroundColor: "red",
                                              ":hover": {
                                                backgroundColor: "red",
                                                opacity: 0.9,
                                              },
                                            }}
                                          >
                                            <RiDeleteBin5Fill
                                              color="white"
                                              size={18}
                                            />
                                          </IconButton>
                                        ) : (
                                          <Avatar
                                            onClick={() => {
                                              deleteIcon === index
                                                ? setDeleteIcon(null)
                                                : setDeleteIcon(index);
                                            }}
                                            sx={{
                                              bgcolor: "#050A30",
                                              width: "30px",
                                              height: "30px",
                                              fontSize: "16px",
                                              cursor: "pointer",
                                              // mr:-1
                                            }}
                                          >
                                            {/* {selectUser?.substring(0, 2)?.toUpperCase() || ""} */}
                                          </Avatar>
                                        )}
                                      </Div>
                                    </Div>
                                  ) : (
                                    <Div
                                      sx={{
                                        my: "25px !important",
                                        display: "flex",
                                        // justifyContent: "flex-start",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Div sx={{ alignSelf: "flex-start" }}>
                                        {deleteIcon === index ? (
                                          <IconButton
                                            onClick={() => {
                                              selectUser?.Assign_User
                                                ? groupDeleteMsg(chat)
                                                : userDeleteMsg(chat);
                                            }}
                                            sx={{
                                              backgroundColor: "red",
                                              ":hover": {
                                                backgroundColor: "red",
                                                opacity: 0.9,
                                              },
                                            }}
                                          >
                                            <RiDeleteBin5Fill
                                              color="white"
                                              size={18}
                                            />
                                          </IconButton>
                                        ) : (
                                          <Avatar
                                            onClick={() => {
                                              deleteIcon === index
                                                ? setDeleteIcon(null)
                                                : setDeleteIcon(index);
                                            }}
                                            sx={{
                                              bgcolor: "#050A30",
                                              width: "30px",
                                              height: "30px",
                                              fontSize: "16px",
                                              cursor: "pointer",
                                              // mr:-1
                                            }}
                                          >
                                            {/* {selectUser?.substring(0, 2)?.toUpperCase() || ""} */}
                                          </Avatar>
                                        )}
                                      </Div>

                                      <Div>
                                        <Div
                                          mb={2}
                                          sx={{
                                            position: "relative",
                                            ml: 1,
                                          }}
                                        >
                                          <Div
                                            sx={{
                                              display: "flex",
                                              justifyContent: "end",
                                            }}
                                          >
                                            {
                                              <Div
                                                sx={{
                                                  padding: 1,
                                                  mr: 1,
                                                  borderRadius: "5px",
                                                  bgcolor: "#D2E9EC",
                                                  width: "100% !important",
                                                }}
                                              >
                                                <Typography
                                                  sx={{ mb: -0.2 }}
                                                  variant="h4"
                                                >
                                                  {chat?.SenderId === UserId
                                                    ? "You"
                                                    : chat?.RecevierName || ""}
                                                </Typography>

                                                {
                                                  <Div
                                                    style={{
                                                      marginTop: "10px",
                                                      marginRight: "7px",
                                                    }}
                                                  >
                                                    {AudioFormats?.includes(
                                                      lastPart
                                                    ) && (
                                                      <audio controls>
                                                        <source
                                                          src={
                                                            BASE_URL +
                                                              chat?.File ||
                                                            "no file"
                                                          }
                                                          type="audio/ogg"
                                                        />
                                                        <source
                                                          src={
                                                            BASE_URL +
                                                              chat?.File ||
                                                            "no file"
                                                          }
                                                          type="audio/mpeg"
                                                        />
                                                        <source
                                                          src={
                                                            BASE_URL +
                                                              chat?.File ||
                                                            "no file"
                                                          }
                                                          type="audio/mp3"
                                                        />
                                                      </audio>
                                                    )}

                                                    {VideoFormats?.includes(
                                                      lastPart
                                                    ) && (
                                                      <video
                                                        width="320"
                                                        height="240"
                                                        controls
                                                      >
                                                        <source
                                                          src={
                                                            BASE_URL +
                                                              chat?.File ||
                                                            "no file"
                                                          }
                                                          type="video/mp4"
                                                        />
                                                        <source
                                                          src={
                                                            BASE_URL +
                                                              chat?.File ||
                                                            "no file"
                                                          }
                                                          type="video/ogg"
                                                        />
                                                      </video>
                                                    )}

                                                    {ImageFormats?.includes(
                                                      lastPart
                                                    ) && (
                                                      <img
                                                        src={
                                                          BASE_URL +
                                                            chat?.File ||
                                                          "no file"
                                                        }
                                                        width="280"
                                                        height="200"
                                                        type="image/jpeg"
                                                      />
                                                    )}

                                                    {FileFormats?.includes(
                                                      lastPart
                                                    ) && (
                                                      <Div
                                                        sx={{
                                                          padding: 1,
                                                          mr: 2,
                                                          borderRadius: "5px",
                                                          bgcolor: "ghostwhite",
                                                          width:
                                                            "100% !important",
                                                          display: "flex",
                                                          alignItems: "center",
                                                          gap: 5,
                                                        }}
                                                      >
                                                        <a
                                                          style={{
                                                            textDecoration:
                                                              "none",
                                                            color: "#000",
                                                          }}
                                                          href={
                                                            BASE_URL +
                                                            chat?.File
                                                          } // Replace with the path to your PDF file
                                                          target="_blank"
                                                          // download
                                                        >
                                                          <AiFillFile
                                                            size={20}
                                                            color="gray"
                                                          />{" "}
                                                          {fileName}
                                                        </a>

                                                        <a
                                                          style={{
                                                            textDecoration:
                                                              "none",
                                                          }}
                                                          href={
                                                            BASE_URL +
                                                            chat?.File
                                                          } // Replace with the path to your PDF file
                                                          target="_blank"
                                                          download={true}
                                                        >
                                                          <MdArrowCircleDown
                                                            size={20}
                                                            color="gray"
                                                          />
                                                        </a>
                                                      </Div>
                                                    )}

                                                    {chat?.Jitci !== "" &&
                                                      chat?.Jitci !== null && (
                                                        <Div sx={{ px: 1 }}>
                                                          <Div
                                                            sx={{
                                                              display: "flex",
                                                              alignItems:
                                                                "center",
                                                              gap: 1,
                                                              justifyContent:
                                                                "space-between",
                                                            }}
                                                          >
                                                            <Div>
                                                              <Typography
                                                                sx={{
                                                                  mb: -0.2,
                                                                }}
                                                                variant="h3"
                                                              >
                                                                {chat?.SenderId ===
                                                                UserId
                                                                  ? "You"
                                                                  : chat?.RecevierName ||
                                                                    ""}
                                                              </Typography>
                                                              {chat?.Audio_Answer !==
                                                                "" &&
                                                                chat?.Audio_Answer !==
                                                                  null &&
                                                                chat?.SenderId ==
                                                                  userId && (
                                                                  <Typography>
                                                                    Outgoing
                                                                    Voice Call
                                                                  </Typography>
                                                                )}
                                                              {chat?.Video_Answer !==
                                                                "" &&
                                                                chat?.Video_Answer !==
                                                                  null &&
                                                                chat?.SenderId ==
                                                                  userId && (
                                                                  <Typography>
                                                                    Outgoing
                                                                    Video Call
                                                                  </Typography>
                                                                )}
                                                              {chat?.Audio_Answer !==
                                                                "" &&
                                                                chat?.Audio_Answer !==
                                                                  null &&
                                                                chat?.SenderId !=
                                                                  userId && (
                                                                  <Typography>
                                                                    Incoming
                                                                    Voice Call
                                                                  </Typography>
                                                                )}
                                                              {chat?.Video_Answer !==
                                                                "" &&
                                                                chat?.Video_Answer !==
                                                                  null &&
                                                                chat?.SenderId !=
                                                                  userId && (
                                                                  <Typography>
                                                                    Incoming
                                                                    Video Call
                                                                  </Typography>
                                                                )}
                                                              {(chat?.Video_Answer ===
                                                                "declined" ||
                                                                chat?.Audio_Answer ===
                                                                  "declined") &&
                                                                chat?.SenderId !=
                                                                  userId && (
                                                                  <Typography
                                                                    sx={{
                                                                      color:
                                                                        "red",
                                                                      mt: 1,
                                                                      mb: 0,
                                                                    }}
                                                                  >
                                                                    Missed Call
                                                                  </Typography>
                                                                )}
                                                              {(chat?.Video_Answer ===
                                                                "connecting" ||
                                                                chat?.Audio_Answer ===
                                                                  "connecting") &&
                                                                chat?.SenderId ==
                                                                  userId && (
                                                                  <Typography
                                                                    sx={{
                                                                      color:
                                                                        "green",
                                                                    }}
                                                                  >
                                                                    connecting...
                                                                  </Typography>
                                                                )}
                                                              {(chat?.Video_Answer ===
                                                                "speaking" ||
                                                                chat?.Audio_Answer ===
                                                                  "speaking") && (
                                                                <Typography
                                                                  sx={{
                                                                    color:
                                                                      "green",
                                                                  }}
                                                                >
                                                                  speaking...
                                                                </Typography>
                                                              )}
                                                              {(chat?.Video_Answer ===
                                                                "callend" ||
                                                                chat?.Audio_Answer ===
                                                                  "callend") && (
                                                                <Typography
                                                                  variant="h6"
                                                                  sx={{
                                                                    color:
                                                                      "red",
                                                                    mt: 1,
                                                                    mb: 0,
                                                                  }}
                                                                >
                                                                  Call End
                                                                </Typography>
                                                              )}
                                                            </Div>
                                                            <Div>
                                                              {chat?.SenderId !=
                                                                userId && (
                                                                <PiArrowDownLeft
                                                                  color="green"
                                                                  size={20}
                                                                />
                                                              )}
                                                              {chat?.SenderId ==
                                                                userId && (
                                                                <PiArrowUpRight
                                                                  color="navy"
                                                                  size={20}
                                                                />
                                                              )}
                                                              {chat?.SenderId ===
                                                                userId && (
                                                                <PiArrowElbowLeft
                                                                  color="red"
                                                                  size={20}
                                                                />
                                                              )}
                                                            </Div>
                                                          </Div>
                                                          {
                                                            <Div
                                                              sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                  "center",
                                                                gap: 1,
                                                                mt: 1,
                                                              }}
                                                            >
                                                              {(chat?.Video_Answer ===
                                                                "connecting" ||
                                                                chat?.Audio_Answer ===
                                                                  "connecting" ||
                                                                chat?.Audio_Answer ===
                                                                  "speaking" ||
                                                                chat?.Video_Answer ===
                                                                  "speaking") && (
                                                                <Button
                                                                  onClick={() => {
                                                                    !selectUser?.Assign_User
                                                                      ? handlingUserCalls(
                                                                          "declined",
                                                                          chat
                                                                        )
                                                                      : handlingGroupCalls(
                                                                          "declined",
                                                                          chat
                                                                        );
                                                                  }}
                                                                  variant="contained"
                                                                  sx={{
                                                                    ":hover": {
                                                                      bgcolor:
                                                                        "#F84F31",
                                                                      opacity: 0.9,
                                                                    },
                                                                    bgcolor:
                                                                      "#F84F31",
                                                                    width:
                                                                      "100%",
                                                                    py: 1,
                                                                  }}
                                                                >
                                                                  <Typography>
                                                                    DECLINE
                                                                  </Typography>
                                                                </Button>
                                                              )}

                                                              {chat?.SenderId !=
                                                                userId &&
                                                                (chat?.Video_Answer ===
                                                                  "connecting" ||
                                                                  chat?.Audio_Answer ===
                                                                    "connecting") && (
                                                                  <Button
                                                                    onClick={() => {
                                                                      !selectUser?.Assign_User
                                                                        ? handlingUserCalls(
                                                                            "answer",
                                                                            chat
                                                                          )
                                                                        : handlingGroupCalls(
                                                                            "answer",
                                                                            chat
                                                                          );
                                                                    }}
                                                                    variant="contained"
                                                                    sx={{
                                                                      ":hover":
                                                                        {
                                                                          bgcolor:
                                                                            "#23C552",
                                                                          opacity: 0.9,
                                                                        },
                                                                      bgcolor:
                                                                        "#23C552",
                                                                      width:
                                                                        "100%",
                                                                      py: 1,
                                                                    }}
                                                                  >
                                                                    <Typography>
                                                                      ANSWER
                                                                    </Typography>
                                                                  </Button>
                                                                )}
                                                            </Div>
                                                          }
                                                        </Div>
                                                      )}
                                                  </Div>
                                                }

                                                {chat?.Meassage !== "" && (
                                                  <Typography
                                                    xs={6}
                                                    sx={{ mt: 1 }}
                                                    sx={{ fontSize: "14px" }}
                                                  >
                                                    {chat?.Meassage || ""}
                                                  </Typography>
                                                )}
                                                {chat?.Meassage !== "" && (
                                                  <TextToSpeech
                                                    Meassage={
                                                      chat?.Meassage || ""
                                                    }
                                                  />
                                                )}

                                                <Grid align="right">
                                                  <Typography
                                                    variant="p"
                                                    noWrap={true}
                                                    sx={{
                                                      color: "black",
                                                      fontSize:
                                                        "10px !important",
                                                    }}
                                                  >
                                                    {formattedTime || ""}
                                                  </Typography>
                                                </Grid>
                                              </Div>
                                            }
                                          </Div>

                                          <Div
                                            sx={{
                                              ":after": {
                                                width: 0,
                                                position: "absolute",
                                                content: "'.'",
                                                height: 0,
                                                bottom: -10,
                                                left: 0,
                                                borderTop: "0px solid ",
                                                borderBottom:
                                                  "20px solid  transparent",
                                                // borderLeft: "none",
                                                borderLeft:
                                                  "20px solid  #D2E9EC",
                                              },
                                              zIndex: -2,
                                              // display: chat?.Meassage !== "" ? "" : 'none'
                                            }}
                                          ></Div>
                                        </Div>
                                      </Div>
                                    </Div>
                                  )}
                                </Div>
                              );
                            })}
                        </Div>
                      }
                    </JumboScrollbar>

                    <Div
                      sx={{
                        border: "1px solid #C0C0C0 !important",
                        px: 0.5,
                        borderRadius: "5px",
                        position: "relative",
                        bottom: 0,
                        backgroundColor: "white !important",
                      }}
                    >
                      {localFile !== "" && (
                        <Div
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            bgcolor: "#E5E4E2 !important",
                            p: 1,
                            position: "relative",
                          }}
                        >
                          <Div sx={{ width: "80%", height: "250px" }}>
                            <embed
                              src={localFile}
                              type="application/pdf"
                              width="100%"
                              height="100%"
                            />
                          </Div>
                          <IconButton
                            onClick={() => {
                              setLocalFile("");
                              setLoadingProgress(0);
                              setFileName("");
                              setBase64Data("");
                            }}
                            sx={{ position: "absolute", top: 0, right: 5 }}
                          >
                            <CloseIcon color="black" />
                          </IconButton>
                        </Div>
                      )}

                      <InputBase
                        sx={{ flex: 1, width: "100%", px: 0.5, py: 1.4 }}
                        placeholder="Text chat..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        multiline
                        maxRows={5}
                        inputProps={{ "aria-label": "search google maps" }}
                      />
                      <Div
                        sx={{
                          borderTop: "1px solid ghostwhite",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <ButtonGroup
                          variant="text"
                          aria-label="text button group"
                        >
                          {showEmojiPicker && (
                            <Div
                              sx={{ position: "absolute", bottom: 60, left: 0 }}
                            >
                              <Picker onEmojiClick={handleEmojiClick} />
                            </Div>
                          )}

                          <IconButton
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          >
                            <MdOutlineEmojiEmotions
                              style={{ cursor: "pointer", color: "darkgreen" }}
                              size={18}
                            />
                          </IconButton>

                          <IconButton>
                            <input
                              type="file"
                              onChange={handleDrop}
                              accept="image/*,video/*,audio/*,.pdf,.zip"
                              id="fileInput"
                              style={{ display: "none" }}
                            />

                            <label htmlFor="fileInput">
                              <ImAttachment
                                style={{
                                  cursor: "pointer",
                                  color: "darkgreen",
                                }}
                                size={15}
                              />
                            </label>
                          </IconButton>
                          <IconButton
                            onClick={() => generateURL("video")}
                            type="button"
                          >
                            <FcVideoCall size={18} color="green" />
                          </IconButton>
                          <IconButton
                            onClick={() => generateURL("audio")}
                            type="button"
                          >
                            <IoMdCall size={18} color="green" />
                          </IconButton>
                        </ButtonGroup>
                        <Div
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {fileName?.size && (
                            <Typography>{`${fileName?.size} KB`}</Typography>
                          )}
                          {fileName?.size && (
                            <Typography>
                              {loadingProgress?.toFixed(2)} %
                            </Typography>
                          )}
                          <IconButton
                            onClick={() => {
                              setSendLoader(true);
                              !selectUser?.Assign_User
                                ? sendUsersMessage()
                                : sendGroupMessage();
                            }}
                            disabled={
                              (message.trim() === "" && base64Data === "") ||
                              sendLoader
                            }
                          >
                            {!sendLoader ? (
                              <MdSend
                                size={18}
                                color={
                                  message.trim() !== "" || base64Data !== ""
                                    ? "darkgreen"
                                    : "#C0C0C0"
                                }
                              />
                            ) : (
                              <div
                                class="spinner-grow text-success"
                                role="status"
                                style={{ width: "20px", height: "20px" }}
                              ></div>
                            )}
                          </IconButton>
                        </Div>
                      </Div>
                    </Div>

                    {/* <Grid container spacing={1} sx={{ position: "relative", bottom: 0, backgroundColor: "white !important" }} >

                    <Grid item xs={10.5} md={10.5} lg={10.5} xl={10.5} >
                      <Div id="outlined-search"
                        sx={{
                          display: 'flex', flexWrap: "nowrap", alignItems: 'center',
                          position: 'relative',
                          // backgroundColor:"#E9E9E9",
                          borderRadius: "5px",
                          gap: 1,
                          minWidth: 130,
                        }} >
                        {showEmojiPicker && (
                          <Div sx={{ position: "absolute", bottom: 60, left: 0 }}>
                            <Picker onEmojiClick={handleEmojiClick} />
                          </Div>
                        )}
                        <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                          <MdOutlineEmojiEmotions style={{ cursor: 'pointer' }} size={22} />
                        </IconButton>
                        <TextField
                          className="col-10"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          multiline
                          maxRows={5}
                          type="search"
                          placeholder="Type your message here"

                        />

                        <IconButton>
                          <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileUpload} />

                          <label htmlFor="fileInput">
                            <ImAttachment style={{ cursor: 'pointer' }} size={20} />
                          </label>
                        </IconButton>
                      </Div>
                    </Grid>

                    <Grid item align="center" alignSelf={"flex-end"} xs={2} md={1} lg={1} xl={1}>
                      <Button
                        size="small"
                        variant="contained"
                        className="col-12"
                        onClick={() => sendLoader === false ? sendUsersMessage() : null}
                        sx={{
                          bgcolor: "green",
                          paddingRight: "10px",
                          py: 1.4,
                          fontSize: "25px",
                        }}
                      >
                        {sendLoader === false ?
                          <SendIcon fontSize="23px" /> :
                          <div class="spinner-border text-white spinner-border-sm"></div>
                        }
                      </Button>
                    </Grid>
                  </Grid> */}
                  </Div>
                </Div>
              )}
            </Div>
          </Grid>
        </Grid>
        {loaderLeft && (
          <Div
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              bgcolor: "rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              width: "100%",
            }}
          >
            <div class="spinner-grow text-success"></div>
          </Div>
        )}
      </Div>
    </JumboContentLayoutMain>
  );
};

export default LiveChatsRightCard;

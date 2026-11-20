import JumboScrollbar from '@jumbo/components/JumboScrollbar'
import Div from '@jumbo/shared/Div'
import { Avatar, IconButton, Input, Typography } from '@mui/material'
import { BASE_URL } from 'app/services/auth-services'
import React, { memo } from 'react'
import { useState } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import { FaUsers } from 'react-icons/fa'
import { HiCheckCircle } from 'react-icons/hi2'
import { FiChevronRight } from "react-icons/fi";
import { BsCheck } from 'react-icons/bs'
import { IoCamera } from 'react-icons/io5'
import { toast } from 'react-toastify'
import { MdOutlineEmojiEmotions } from 'react-icons/md'
import Picker from 'emoji-picker-react';
import axios from 'axios'

function CreateGroupAndUserlists({ users, randomColors, setMyUsers, myUsers, setShowUserlists }) {
    const [groupCreat, setGroupCreat] = useState([]);
    const [showUsers, setShowUsers] = useState(true);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupImg, setGroupImg] = useState("");
    const [groupImg1, setGroupImg1] = useState("");
    const [imgName, setImgName] = useState("");
    const [description, setDescription] = useState("Always fun");


    const token = localStorage.getItem("accesstoken")
    const UserId = localStorage.getItem("UserId")
    const OrganizationId = localStorage.getItem("OrganizationId")
    const item = "crmuseradmin1"

    // file handling functions
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file); // Create a URL for the selected file
            setGroupImg1(fileURL);
            //   console.log('Upload',fileURL)
        }

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                // if (file.type.startsWith('video/')) {
                //   const base64Data = btoa(reader.result);
                //   setBase64Data(base64Data);
                //   console.log("Upload2", file.type, base64Data);
                //   setFileName(file?.name || "")
                // } else {
                const base64String = e.target.result?.split(",")[1];
                setImgName(file?.name || "")
                setGroupImg(base64String);
                // console.log("upload2", base64String);

                // }
            };


            // Read the file as a Data URL, which works for all file types
            reader.readAsDataURL(file);
        }
    };

    const setGroupsUsers = (user) => {
        const isDuplicate = groupCreat?.some(group => group?.id === user?.id);

        if (isDuplicate) {
            setGroupCreat(groupCreat?.filter(group => group?.id !== user?.id));
        } else {
            setGroupCreat([...groupCreat, user]);
        }
    };

    // console.log("Group", groupCreat)

    // create Group Function 
    const createGroupFunc = async () => {
        if (groupName.trim() === "") {
            toast.error("Group names must contain at least one character")
        }
        else if (groupCreat.length === 0) {
            toast.error("Group membership must include at least one person")

        }
        else {

            let Assign_Users = groupCreat?.map((item) => item.id)
            Assign_Users?.push(parseInt(UserId))
            // console.log("Assign_Users", Assign_Users)
            const payload = {
                "Group_Name": groupName || "New Group",
                "File_Name": imgName,
                "Description": description || "",
                "User_Photo": groupImg ,
                "Created_Date":new Date().toISOString(),
                "Updated_Date": new Date().toISOString(),
                "Organization_Id":parseInt(OrganizationId) ,
                "Created_By": parseInt(UserId),
                "Updated_By": parseInt(UserId),
            
                "Assign_User": Assign_Users
            }

            try {
                await axios
                    .post(`${BASE_URL}/user/UserChatGroupCRUD/`, payload, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            "db": item
                        },
                    }).then((json) => {
                        toast.success("Group created successfully", {
                            position: "top-right",
                            autoClose: 2000,
                        })
                        setShowUserlists(false)
                    })
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    const errorMessage = error.response.data.details || "You don't have permission to do it";
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


        }
    }

    // emoji 
    const handleEmojiClick = (event, emojiObject) => {
        const emoji = event.emoji;
        let names = groupName + emoji
        console.log("emoji", event, names)
        setGroupName(names);
        // setShowEmojiPicker(false); 
    };
    return (
        <div style={{ position: 'relative' }}>

            <Div sx={{ position: 'relative', mb: 2, display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                <input type='file' onChange={handleFileUpload} style={{ display: 'none' }} id='img' />
                <label htmlFor='img'>
                    <Avatar
                        sx={{
                            bgcolor: "lightgray",
                            width: "40px",
                            height: "40px",

                        }}
                    >
                        {groupImg === "" ? <IoCamera size={20} /> :
                            <img src={groupImg1} alt='group pic' style={{ width: "100%", height: "100%" }} />
                        }
                    </Avatar>
                </label>
                <Div sx={{ width: "100%", display: "flex" }}>
                    <Input placeholder="Group name " value={groupName} onChange={(e) => setGroupName(e.target.value)} sx={{ width: "90%", py: 1 }} inputProps={"ariaLabel"} />
                    <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                        <MdOutlineEmojiEmotions style={{ cursor: 'pointer' }} size={22} />
                    </IconButton>
                </Div>

                {showEmojiPicker && (
                    <Div sx={{ position: "absolute", top: 80, left: 0, width: "100%", zIndex: 2 }}>
                        <Picker onEmojiClick={handleEmojiClick} />
                    </Div>
                )}

            </Div>
            <Typography sx={{ ml: 1 }}>participants : {groupCreat?.length}</Typography>
            <Div>

                <JumboScrollbar
                    autoHeight={true}
                    //  autoHeightMax={250}
                    autoHideTimeOut={4000}
                >

                    <Div sx={{ borderBottom: groupCreat.length > 0 && "1px solid rgba(0,0,0,0.2)", px: 1, py: groupCreat.length > 0 && 1, display: 'flex', alignItems: 'center', gap: 2 }}>

                        {
                            groupCreat?.length > 0 && groupCreat?.map((group, ind) => {
                                // alert(group?.username?.length)
                                const findIndex = users?.findIndex(item => item?.id === group?.id);

                                return (
                                    <Div key={ind}>
                                        <Div  >
                                            <Div onClick={() => setGroupsUsers(group)} sx={{ cursor: "pointer", position: "relative", display: 'flex', justifyContent: 'center' }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: "gray",
                                                        width: "31px",
                                                        height: "31px",
                                                        left: 5

                                                    }}
                                                >
                                                    <Typography sx={{
                                                        bgcolor: randomColors[findIndex],
                                                        width: "27px",
                                                        height: "27px",
                                                        fontSize: "10px",
                                                        borderRadius: "50%",
                                                        textAlign: "center",
                                                        pt: 0.7,

                                                    }}>{group?.username?.substring(0, 2)?.toUpperCase() || ""}</Typography>

                                                </Avatar>
                                                <span style={{ position: "relative", left: -6, bottom: -1, alignSelf: "end" }}>
                                                    <AiFillCloseCircle style={{ backgroundColor: "rgba(255,255,255,0.8)", borderRadius: "50%" }} color='gray' size={16} />
                                                </span>

                                            </Div>
                                            <Div>
                                                <Typography sx={{ fontSize: "12px", color: "black", textAlign: 'center' }}>
                                                    {group?.username?.split("_" || " ")[0]?.length < 10 ? group?.username?.split("_" || " ")[0] : group?.username?.substring(0, 9)}
                                                </Typography>
                                            </Div>
                                        </Div>

                                    </Div>
                                )
                            })
                        }
                    </Div>
                </JumboScrollbar>


                {
                    users?.length > 0 && users?.map((item, index) => {
                        // console.log("idid", item, groupCreat)
                        const check = groupCreat?.some(group => group?.id === item?.id);
                    
                        if(!item?.Group_Name){
                            return (
                            <Div key={index}
                                onClick={() => setGroupsUsers(item)}
                                sx={{
                                    cursor: "pointer", ":hover": { backgroundColor: "rgba(53, 109, 101,0.2)" },
                                    p: 1.3, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                }}>
                                <Div sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                                    <Div sx={{ position: "relative", display: 'flex', justifyContent: 'center' }}>
                                        {item?.User_Photo !== "" && item?.User_Photo !== null ?
                                            <Avatar
                                                sx={{
                                                    bgcolor: "gray",
                                                    width: "31px",
                                                    height: "31px",

                                                }}
                                            >
                                                <Typography sx={{
                                                    bgcolor: randomColors[index],
                                                    width: "27px",
                                                    height: "27px",
                                                    fontSize: "10px",
                                                    borderRadius: "50%",
                                                    textAlign: "center",
                                                    pt: 0.7,

                                                }}>{item?.username?.substring(0, 2)?.toUpperCase() || ""}</Typography>

                                            </Avatar> :
                                            <img src={`${BASE_URL}${item?.User_Photo}`} alt="user" width={30} height={30} className="rounded-pill" />
                                        }
                                        {check && <span style={{ position: "relative", left: -12, bottom: 2, alignSelf: "end" }}>
                                            <HiCheckCircle style={{ backgroundColor: "rgba(255,255,255,0.8)", borderRadius: "50%" }} color='green' size={16} />
                                        </span>}

                                    </Div>
                                    <Div>
                                        <Typography sx={{ fontSize: "13px", color: "black" }}>
                                            {item?.username || ""}
                                        </Typography>
                                    </Div>
                                </Div>
                                {/* <Div sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {item?.User_Login_Status === true ? 
                                <Typography sx={{ fontSize: "10px" }}>
                                    <span sx={{ color: "#1DB700", fontSize: "10px" }}>
                                        <PiCircleFill color="#4cbb17" />{" "}
                                    </span>
                                    Online
                                </Typography>:
                                <Typography sx={{ fontSize: "10px" }}>
                                <span sx={{fontSize: "10px" }}>
                                    <PiCircleFill color="#a3a3a3" />{" "}
                                </span>
                                Offline
                            </Typography>
                                }
                            </Div> */}
                            </Div>
                        )}
                    })
                }
            </Div>
            {groupCreat?.length > 0 && <IconButton onClick={() => createGroupFunc()} sx={{ position: "sticky", left: "80% !important", bottom: 20, zIndex: 1 }}>
                <BsCheck size={30} color='white' style={{ backgroundColor: "green", borderRadius: "3px", }} />
            </IconButton>}
        </div>
    )
}

export default memo(CreateGroupAndUserlists)

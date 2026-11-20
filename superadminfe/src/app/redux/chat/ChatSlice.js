import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { DBname, UserId, token } from "../auth/localStorage";
import { generateRandomColor } from "app/pages/widgets/CRMStyles";
import { BASE_URL } from "app/services/auth-services";

// select conversation user
const initialState = {
    selectUser: {},
    selectUserColor: "",
    selectUserMsg: [],
    allDatas: [],
    avatarColors: [],
    getChatListFunction: "",
    selectUserFunc: ""
}

export const chatSlice = createSlice({
    name: "selectuser",
    initialState,
    reducers: {
        selectperson: (state, action) => {
            state.selectUser = action.payload.user
            state.selectUserColor = action.payload.color
        },
        getSelectedUserMsg: (state, action) => {
            state.selectUserMsg = action.payload
        },
        getAllUser: (state, action) => {
            state.allDatas = action.payload
        },
        selectUserFun: (state, action) => {
            state.selectUserFunc = action.payload
        },
        avatarColors: (state, action) => {
            state.avatarColors = action.payload
        },
        getChatListFunction: (state, action) => {
            state.getChatListFunction = action.payload
        }
    }
})

export const { selectperson, getSelectedUserMsg, selectUserFun, getAllUser, avatarColors, getChatListFunction } = chatSlice.actions;
export default chatSlice.reducer

export const getUsersChatLists = () => {
    return async (dispatch, getState) => {
        // try {
        //     await axios
        //         .get(`${BASE_URL}/user/ChatUserGroupList/?id=${UserId}`, {
        //             headers: {
        //                 Authorization: `Bearer ${token}`,
        //                 "Content-Type": "application/json",
        //                 Accept: "application/json",
        //                 "db": DBname
        //             },
        //         })
        //         .then((response) => {
        //             // console.log("console343434343434", response.data[0], UserId);

        //             let color = []
        //             for (let i = 0; i < response.data[0].length; i++) {
        //                 color.push(generateRandomColor())
        //             }

        //             let chatList = []
        //             response?.data[0]?.map((item, index) => {
        //                 if (item?.username) {
        //                     chatList = [...chatList, item]
        //                 }
        //                 else if (item?.Group_Name) {
        //                     item?.Assign_User?.filter((user) => {
        //                         if (parseInt(user.id) === parseInt(UserId)) {
        //                             chatList = [...chatList, item]
        //                         }
        //                     })
        //                 }
        //             })

        //             // console.log("all datas",chatList)
        //             dispatch(chatSlice.actions.getAllUser(chatList))
        //             dispatch(chatSlice.actions.avatarColors(color))

        //         })

        // } catch (error) {
        //     console.log(error, error == "Request failed with status code 500")

        // }
    }
}

// get user messages
export const handleOnclickUserProfile = (user, color) => {
    console.log("reversed21", user, color);
    return async (dispatch, getState) => {
        try {
            await axios.get(`${BASE_URL}/user/UserChatMasterCRUD/?RecevierId=${user?.id}&SenderId=${UserId}`, {
                headers: {
                    // Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "db": DBname
                },
            })
                .then((res) => {
                    if (res.data) {
                        const reversedArray = res?.data
                        console.log("reversed", user, color, reversedArray);
                        dispatch(chatSlice.actions.getSelectedUserMsg(reversedArray))
                        dispatch(chatSlice.actions.selectperson({ user, color }))
                    }
                })
        } catch (error) {
            console.log(error)
            if (error) {
                // toast.error("Network Error", {
                //   position: "top-right",
                //   autoClose: 2000,
                // })
            }
        }
    }
}
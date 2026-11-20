import { BASE_URL, Tenantname } from "app/services/auth-services";
import axios from "axios";

import { BsFileRuledFill } from "react-icons/bs";
import CFList from "./CFList";

// import { addCustompath } from 'app/redux/CustomeFormRedux/action_CustomForm';
// import { useDispatch, useSelector } from 'react-redux';

// export let CustomFormList_Data = []; // Separate export variable for results data

const CustomFormList = async (token) => {
  let dynamicForm = [];
  // const dispatch = useDispatch();

  if (token) {
    try {
      const res = await axios.get(`${BASE_URL}/user/CustomizeFormlist/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("CustomList res.data:", res?.data);

      // Assigning to CustomFormList_Data
      // CustomFormList_Data = res?.data?.results;

      dynamicForm = res?.data?.map((form) => ({
        id: null,
        type: "nav-item",
        title: form?.FormName, // Assuming FormName is the title
        icon: (
          <BsFileRuledFill
            className="sideBarIcon"
            style={{
              fontSize: 14,
              color: form?.Is_Active === true ? "#666565" : "#CDCDCD",
            }}
          />
        ),
        // if(form?.Is_Active === true){

        path: form?.Is_Active === true ? `/CFList/${form?.id}` : null,
        // }
      }));
      // dispatch(addCustompath(dynamicForm))
      return dynamicForm;
    } catch (error) {
      console.error("error:", error);
      return []; // Return empty array or handle error as needed
    }
  }
};

export default CustomFormList;

// export const CustomList = () => {
//     console.log("CustomList on CustomFormList Entry")
//     let li = useSelector((state) => state.CustomFormPathList)
//     console.log("li", li)
//     return li
// }

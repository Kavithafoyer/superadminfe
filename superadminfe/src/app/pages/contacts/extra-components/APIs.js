import { BASE_URL, BASE_URL1 } from "app/services/auth-services";
import axios from "axios";
import moment from "moment";
import randomColor from "randomcolor";
import { toast } from "react-toastify";

// < ------------------------------------- Headers -------------------------------------------------------->
const item = "crmuseradmin1";
const header = {
  get headers() {
    return {
      db: item,
      Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }
};

// < < =================================== Contacts Section ==================================== > >
// < ------------------------------------- Profile Image Upload --------------------------------------->
export const ProfileImageUpload = async (
  arg,
  setOpenUploadEdit,
  endPoint,
  getData,
  domin = "superadmin"
) => {
  let payload = {
    id: Number(arg?.id),
  };
  if (arg?.username) {
    payload.username = arg?.username;
    payload.User_Photo = arg?.base64;
    payload.User_Photo_Name = arg?.imageName;
  } else {
    payload.File = arg?.base64;
    payload.FileName = arg?.imageName;
  }
  let message = "";
  try {
    const res = await axios.patch(
      `${BASE_URL}/${domin}/${endPoint}/`,
      payload,
      header
    );

    if (res) {
      //   setOpenUploadEdit(false)
      message = toast?.success("upload successful", {
        position: "top-right",
        autoClose: 2000,
      });
      getData(res);
    }
  } catch (error) {
    message = toast?.error(error.message, {
      position: "top-right",
      autoClose: 2000,
    });
  }
  return message;
};

// < ------------------------------------- Add Notes Sumbit --------------------------------------->
export const contactAddNoteSubmit = async (
  arg,
  setOpenNotes,
  endPoint,
  historyEndpoint,
  extraPayload,
  getData
) => {
  let payload = {
    Notes: arg?.notes,
    Subject: arg?.subject,
    Active_Flag: true,
    Is_Deleted: false,
    Organization_Id: localStorage.getItem("OrganizationId"),
    Created_By: localStorage.getItem("UserId"),
    Updated_By: localStorage.getItem("UserId"),
    ...extraPayload,
  };
  let message = "";
  console.log("Create payload Contact Notes", arg, payload);
  try {
    return await axios
      .post(`${BASE_URL}/superadmin/${endPoint}/`, payload, header)
      .then(async (res) => {
        setOpenNotes(false);
        getData && getData();
        message = toast.success("Created successfully", {
          position: "top-right",
          autoClose: 100,
        });
        let editUser = localStorage.getItem("Username");

        let hispayload = historyEndpoint?.payload;
        let histotypayload = {
          Document_Id: res.data.ContactNotes_Id,
          Updated_Person: `${editUser} Created this Contact Notes.`,
          Module_Name: "Contact Notes",
          Updated_By: parseInt(localStorage.getItem("UserId")),
          ...hispayload,
        };
        console.log("histotypayload", histotypayload);
        await axios
          .post(
            `${BASE_URL}/superadmin/${historyEndpoint?.point}/`,
            histotypayload,
            header
          )
          .then((res) => {
            console.log("Result", res.data);
          })
          .catch((res) => {
            console.log(res.message);
          });
      });
  } catch (error) {
    if (error.response && error.response.status === 403) {
      const errorMessage =
        error.response.data.details || "You don't have permission to do it";
      console.log(errorMessage);
      message = toast.error(errorMessage, {
        position: "top-right",
        autoClose: 100,
      });
    } else {
      message = toast.error(`${error}`, {
        position: "top-right",
        autoClose: 100,
      });
    }
  }

  return message;
};

// < ------------------------------------- Add Notes Sumbit --------------------------------------->
export const contactEditNoteSubmit = async (
  arg,
  setOpenNotes,
  endPoint,
  historyEndpoint,
  extraPayload,
  getData
) => {
  let payload = {
    id: arg?.id,
    AccountNotes_Id: arg?.AccountNotes_Id,
    Subject: arg?.subject,
    Notes: arg?.notes,
    Active_Flag: true,
    Is_Deleted: false,
    Created_Date: arg?.Created_Date,
    Updated_Date: new Date().toISOString(),
    Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
    Account_Id: extraPayload?.Account_Id,
    Created_By: arg?.Created_By,
    Updated_By: parseInt(localStorage.getItem("UserId")),
  };
  let message = "";
  console.log("Edit payload Contact Notes", arg, extraPayload, payload);
  try {
    return await axios
      .put(`${BASE_URL}/superadmin/${endPoint}/`, payload, header)
      .then(async (res) => {
        message = toast.success("Updated successfully", {
          position: "top-right",
          autoClose: 100,
        });
        getData && getData();
        setOpenNotes(false);
        let editUser = localStorage.getItem("Username");

        let hispayload = historyEndpoint?.payload;
        let histotypayload = {
          Document_Id: res.data.ContactNotes_Id,
          Modified_By: `${editUser} Updated this Contact Notes.`,
          Module_Name: "Contact Notes",
          Updated_By: parseInt(localStorage.getItem("UserId")),
          ...hispayload,
        };
        console.log("histotypayload", histotypayload);
        await axios
          .post(
            `${BASE_URL}/superadmin/${historyEndpoint?.point}/`,
            histotypayload,
            header
          )
          .then((res) => {
            console.log("Result", res.data);
          })
          .catch((res) => {
            console.log(res.message);
          });
      });
  } catch (error) {
    if (error.response && error.response.status === 403) {
      const errorMessage =
        error.response.data.details || "You don't have permission to do it";
      console.log(errorMessage);
      message = toast.error(errorMessage, {
        position: "top-right",
        autoClose: 100,
      });
    } else {
      message = toast.error(`${error}`, {
        position: "top-right",
        autoClose: 100,
      });
    }
  }

  return message;
};

// < ------------------------------------- Add Activity Sumbit ------------------------------------>
export const contactAddActivitySubmit = async (
  arg,
  setOpenActivity,
  endPoint,
  historyEndpoint,
  extraPayload,
  getData
) => {
  let payload = {
    [arg.FormId]: arg?.seriesValue === "Manual" && arg?.ActivityId,
    Task: arg?.activity_name,
    Task_Description: arg?.description,
    Expected_Date: arg?.expected_date,
    Expected_Time: arg?.expected_time,
    Reminder_Payload: arg?.Reminder_Payload,
    Activity_Type: "For Morning",
    Organization_Id: localStorage.getItem("OrganizationId"),
    Created_By: localStorage.getItem("UserId"),
    Updated_By: localStorage.getItem("UserId"),
    ...extraPayload,
  };
  let message = "";
  console.log("payload Activity", arg, payload);
  try {
    return await axios
      .post(`${BASE_URL}/superadmin/${endPoint}/`, payload, header)
      .then(async (res) => {
        setOpenActivity(false);
        message = toast.success("Created successfully", {
          position: "top-right",
          autoClose: 100,
        });
        let editUser = localStorage.getItem("Username");
        let hispayload = historyEndpoint?.payload;

        let histotypayload = {
          Document_Id: res.data.ContactActivities_Id,
          Updated_Person: `${editUser} Created this Contact Activity.`,
          Module_Name: "Contact Activitiy",
          Updated_By: parseInt(localStorage.getItem("UserId")),
          ...hispayload,
        };
        // console.log("histotypayload", histotypayload);
        await axios
          .post(
            `${BASE_URL}/superadmin/${historyEndpoint?.point}/`,
            histotypayload,
            header
          )
          .then((res) => {
            console.log("Result", res.data);
            getData && getData();
          })
          .catch((res) => {
            console.log(res.message);
          });
      });
  } catch (error) {
    if (error.response && error.response.status === 403) {
      const errorMessage =
        error.response.data.details || "You don't have permission to do it";
      console.log(errorMessage);
      message = toast.error(errorMessage, {
        position: "top-right",
        autoClose: 100,
      });
    } else {
      message = toast.error(`${error}`, {
        position: "top-right",
        autoClose: 100,
      });
    }
  }

  return message;
};

// < ------------------------------------- Edit Activity Sumbit ------------------------------------>
export const contactEditActivitySubmit = async (
  arg,
  setOpenActivity,
  endPoint,
  historyEndpoint,
  extraPayload,
  getData
) => {
  let payload = {
    id: arg?.id,
    Task: arg?.activity_name,
    Task_Description: arg?.description,
    Expected_Date: arg?.Expected_Date,
    Expected_Time: arg?.Expected_Time,
    Reminder_Id: arg?.Reminder_Payload,
    Updated_Date: moment().format("YYYY-MM-DD"),
    Created_Date: arg?.Created_Date,
    Activity_Type: arg?.Activity_Type,
    Active_Flag: arg?.Active_Flag,
    Is_Deleted: arg?.Is_Deleted,
    Organization_Id: localStorage.getItem("OrganizationId"),
    Created_By: localStorage.getItem("UserId"),
    Updated_By: localStorage.getItem("UserId"),
    ...extraPayload,
  };
  let message = "";
  //   console.log("payload Contact Notes", arg, payload);
  try {
    return await axios
      .put(`${BASE_URL}/superadmin/${endPoint}/`, payload, header)
      .then(async (res) => {
        setOpenActivity(false);
        getData && getData();
        message = toast.success("Updated successfully", {
          position: "top-right",
          autoClose: 100,
        });
        let editUser = localStorage.getItem("Username");
        let hispayload = historyEndpoint?.payload;

        let histotypayload = {
          Document_Id: res.data.ContactActivities_Id,
          Updated_Person: `${editUser} Updated this Contact Activity.`,
          Module_Name: "Contact Activitiy",
          Updated_By: parseInt(localStorage.getItem("UserId")),
          ...hispayload,
        };
        // console.log("histotypayload", histotypayload);
        await axios
          .post(
            `${BASE_URL}/superadmin/${historyEndpoint?.point}/`,
            histotypayload,
            header
          )
          .then((res) => {
            console.log("Result", res.data);
          })
          .catch((res) => {
            console.log(res.message);
          });
      });
  } catch (error) {
    if (error.response && error.response.status === 403) {
      const errorMessage =
        error.response.data.details || "You don't have permission to do it";
      console.log(errorMessage);
      message = toast.error(errorMessage, {
        position: "top-right",
        autoClose: 100,
      });
    } else {
      message = toast.error(`${error}`, {
        position: "top-right",
        autoClose: 100,
      });
    }
  }

  return message;
};

// < ------------------------------------- Add Appointment Sumbit ------------------------------------>
export const contactAddAppointmentSubmit = async (
  arg,
  setOpenAppointment,
  endPoint,
  historyEndpoint,
  extraPayload,
  getData
) => {
  let payload = {
    [arg.FormId]: arg?.seriesValue === "Manual" && arg?.AppointmentId,
    Subject: arg?.subject,
    ToDate_Time: arg?.to_time,
    FromDate_Time: arg?.from_time,
    Date: arg?.expected_date,
    Location: arg?.location,
    Venue: arg?.venue,
    Details: arg?.details,
    Reminder_Payload: arg?.Reminder_Payload,
    Organization_Id: localStorage.getItem("OrganizationId"),
    Created_By: localStorage.getItem("UserId"),
    Updated_By: localStorage.getItem("UserId"),
    ...extraPayload,
  };
  console.log("payload", payload);
  let message = "";
  console.log("payload apointments", arg, payload);
  try {
    return await axios
      .post(`${BASE_URL}/superadmin/${endPoint}/`, payload, header)
      .then(async (res) => {
        getData && getData();
        setOpenAppointment(false);
        message = toast.success("Created successfully", {
          position: "top-right",
          autoClose: 100,
        });
        let editUser = localStorage.getItem("Username");
        let hispayload = historyEndpoint?.payload;

        let histotypayload = {
          Document_Id: res.data.ContactActivities_Id,
          Updated_Person: `${editUser} Created this Contact Activity.`,
          Module_Name: "Contact Activitiy",
          Updated_By: parseInt(localStorage.getItem("UserId")),
          ...hispayload,
        };
        // console.log("histotypayload", histotypayload);
        await axios
          .post(
            `${BASE_URL}/superadmin/${historyEndpoint?.point}/`,
            histotypayload,
            header
          )
          .then((res) => {
            console.log("Result", res.data);
          })
          .catch((res) => {
            console.log(res.message);
          });
      });
  } catch (error) {
    if (error.response && error.response.status === 403) {
      const errorMessage =
        error.response.data.details || "You don't have permission to do it";
      console.log(errorMessage);
      message = toast.error(errorMessage, {
        position: "top-right",
        autoClose: 100,
      });
    } else {
      message = toast.error(`${error}`, {
        position: "top-right",
        autoClose: 100,
      });
    }
  }

  return message;
};

// < ------------------------------------- Edit Appointment Sumbit ------------------------------------>
export const contactEditAppointmentSubmit = async (
  arg,
  setOpenAppointment,
  endPoint,
  historyEndpoint,
  extraPayload,
  getData
) => {
  let payload = {
    id: arg?.id,
    Subject: arg?.subject,
    ToDate_Time: arg?.to_time,
    FromDate_Time: arg?.from_time,
    Date: arg?.expected_date,
    Location: arg?.location,
    Venue: arg?.venue,
    Details: arg?.details,
    Created_Date: arg?.Created_Date,
    Reminder_Id: arg?.Reminder_Payload,
    Updated_Date: moment().format("YYYY-MM-DD"),
    Organization_Id: localStorage.getItem("OrganizationId"),
    Created_By: localStorage.getItem("UserId"),
    Updated_By: localStorage.getItem("UserId"),
    ...extraPayload,
  };
  let message = "";
  console.log("payload apointments", arg, payload);
  try {
    return await axios
      .put(`${BASE_URL}/superadmin/${endPoint}/`, payload, header)
      .then(async (res) => {
        getData && getData();
        setOpenAppointment(false);
        message = toast.success("Created successfully", {
          position: "top-right",
          autoClose: 100,
        });
        let editUser = localStorage.getItem("Username");
        let hispayload = historyEndpoint?.payload;

        let histotypayload = {
          Document_Id: res.data.ContactActivities_Id,
          Updated_Person: `${editUser} Created this Contact Activity.`,
          Module_Name: "Contact Activitiy",
          Updated_By: parseInt(localStorage.getItem("UserId")),
          ...hispayload,
        };
        // console.log("histotypayload", histotypayload);
        await axios
          .post(
            `${BASE_URL}/superadmin/${historyEndpoint?.point}/`,
            histotypayload,
            header
          )
          .then((res) => {
            console.log("Result", res.data);
          })
          .catch((res) => {
            console.log(res.message);
          });
      });
  } catch (error) {
    if (error.response && error.response.status === 403) {
      const errorMessage =
        error.response.data.details || "You don't have permission to do it";
      console.log(errorMessage);
      message = toast.error(errorMessage, {
        position: "top-right",
        autoClose: 100,
      });
    } else {
      message = toast.error(`${error}`, {
        position: "top-right",
        autoClose: 100,
      });
    }
  }

  return message;
};
console.log("fileNames");
// < ------------------------------------- send Email Sumbit ------------------------------------>
const mailBody = (fileNames, message, responses) =>
  `<div class='card'>
    <div class='card-body'>
      <h4 className="card-subtitle mb-2 text-muted">Dear Sir,</h4>
      <div class='card-text'>
        <p>${message}</p>
        <p>Click the button to download the attachment </p>
       <div> ${responses?.map((opt) => {
         return `<a href=${BASE_URL}${opt?.data?.File} target="_blank">
      <button type='button' style='color: #000000; border: 1px #00BFFF; border-radius: 4px; padding: 8px 16px; margin-right: 5px; cursor: pointer; text-decoration: none;'>${opt?.data?.FileID}</button></a>`;
       })}
      </div>
    </div>
    </div>`;

export const contactSendEmailSubmit = (
  arg,
  setOpenSendMail,
  base64DataList,
  fileNames,
  endPoint,
  extraPayload,
  getData
) => {
  try {
    const promises = fileNames?.map(async (file, index) => {
      console.log(`Uploading `, base64DataList);
      const payload = {
        File: base64DataList[index],
        FileName: (randomColor() + file?.name)?.split("#")[1],
        Urls: "url",
        Description: "Upload File",
        Organization_Id: localStorage.getItem("OrganizationId"),
        Created_By: localStorage.getItem("UserId"),
        Updated_By: localStorage.getItem("UserId"),
        ...extraPayload,
      };
      const response = await axios.post(
        `${BASE_URL}/superadmin/UserFilesandUrlsCRUD/`,
        payload,
        header
      );
      console.log("response", response);
      return response;
    });
    if (fileNames.length > 0) {
      Promise.all(promises).then((responses) => {
        console.log("responsesresponses", responses);
        contactSendEmail(
          arg,
          setOpenSendMail,
          fileNames,
          endPoint,
          extraPayload,
          responses,
          getData
        );
      });
    } else {
      contactSendEmail(arg, setOpenSendMail, fileNames, endPoint, extraPayload, null, getData);
    }
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

export const contactSendEmail = async (
  arg,
  setOpenSendMail,
  fileNames,
  endPoint,
  extraPayload,
  responses,
  getData
) => {
  console.log(
    "kkkresponses",
    responses?.map((item) => item?.data?.FileName)
  );
  let payload = {
    MailId: "",
    MailSubject: arg?.Subject,
    Cc: [arg?.Cc || ""],
    MailBody: mailBody(fileNames, arg?.content, responses),
    file:
      responses?.length > 0
        ? responses?.map((item) => item?.data?.FileName) ?? []
        : [],
    RecevierMailId: arg?.To,

    Organization_Id: localStorage.getItem("OrganizationId"),
    UserId: localStorage.getItem("UserId"),
    ...extraPayload,
  };
  let message = "";
  //   console.log("payload Contact Notes", arg, payload);
  try {
    return await axios
      .post(`${BASE_URL}/superadmin/${endPoint}/`, payload, header)
      .then(async (res) => {
        setOpenSendMail(false);
        message = toast.success("Created successfully", {
          position: "top-right",
          autoClose: 100,
        });
        getData && getData();
      });
  } catch (error) {
    if (error.response && error.response.status === 403) {
      const errorMessage =
        error.response.data.details || "You don't have permission to do it";
      console.log(errorMessage);
      message = toast.error(errorMessage, {
        position: "top-right",
        autoClose: 100,
      });
    } else {
      message = toast.error(`${error}`, {
        position: "top-right",
        autoClose: 100,
      });
    }
  }

  return message;
};

// < < =================================== Leads Section ======================================== > >

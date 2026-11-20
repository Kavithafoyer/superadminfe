import { useQuery } from "react-query";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";

// Create an axios instance with default headers
const axiosInstance = axios.create({
  headers: {
    db: localStorage.getItem("DBName"),
    Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// < --------------------------------------------------  get Task All List --------------------------------------------------
const getTaskAllList = async () => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/user/NewTaskManagemntAdditional/?Is_Deleted=False`
    );
    // console.log("getOrganisation", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching  Task Management Additional:", error);
    return { error: error };

    throw new Error(error.response?.data?.message || "Error fetching data");
  }
};
// < --------------------------------------------------  get Task My List --------------------------------------------------
const getTaskMyList = async () => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/user/NewTaskManagemntMyAdditional/?Created_By=${localStorage.getItem(
        "UserId"
      )}`
    );
    // console.log("getOrganisation", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching  Task Management Additional:", error);
    return { error: error };

    throw new Error(error.response?.data?.message || "Error fetching data");
  }
};

// < --------------------------------------------------  get CUD  --------------------------------------------------
const TaskCUD = async (type, payload) => {
  let query = type === "delete" ? { params: { id: payload } } : payload;
  try {
    const response = await axiosInstance?.[type](
      `${BASE_URL}/user/NewTaskManagemntCRUD/`,
      query
    );
    // console.log("getOrganisation", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching  CRUD :", error);

    return { error: error };

    throw new Error(error.response?.data?.message || "Error fetching data");
  }
};

// < --------------------------------------------------  get Project Additional  --------------------------------------------------
const getProjectAdditional = async () => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/user/ProjectAdditional/`
    );
    // console.log("getOrganisation", response.data);
    return response.data?.results;
  } catch (error) {
    console.error("Error fetching  Project Additional :", error);
    return { error: error };

    throw new Error(error.response?.data?.message || "Error fetching data");
  }
};

// < --------------------------------------------------  get Users Additional  --------------------------------------------------
const getUsersAdditional = async () => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/useradmin/UsersList/`
    );
    // console.log("getOrganisation", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching  Users List :", error);
    return { error: error };

    throw new Error(error.response?.data?.message || "Error fetching data");
  }
};

// ---------------------------------------------------------- use query's ---------------------------------------------------
const useTaskAllList = () => {
  const {
    data: taskAllData,
    isLoading: isLoadingTaskAllData,
    isError: isErrorTaskAllData,
    refetch: refetchTaskAllData,
  } = useQuery("refetchTaskAllList", getTaskAllList, {
    staleTime: Infinity,
  });

  return {
    taskAllData,
    isLoadingTaskAllData,
    isErrorTaskAllData,
    refetchTaskAllData,
  };
};

const useTaskMyList = () => {
  const {
    data: taskMyData,
    isLoading: isLoadingTaskMyData,
    isError: isErrorTaskMyData,
    refetch: refetchTaskMyData,
  } = useQuery("refetchTaskMyList", getTaskMyList, {
    staleTime: Infinity,
  });

  return {
    taskMyData,
    isLoadingTaskMyData,
    isErrorTaskMyData,
    refetchTaskMyData,
  };
};

const useProjectAdditional = () => {
  const {
    data: projectData,
    isLoading: isLoadingProject,
    isError: isErrorProject,
    refetch: refetchProject,
  } = useQuery("refetchProjectAdditional", getProjectAdditional, {
    staleTime: Infinity,
  });

  return {
    projectData,
    isLoadingProject,
    isErrorProject,
    refetchProject,
  };
};

const useUsersList = () => {
  const {
    data: usersData,
    isLoading: isLoadingUsersList,
    isError: isErrorUsersList,
    refetch: refetchUsersList,
  } = useQuery("refetchUsersList", getUsersAdditional, {
    staleTime: Infinity,
  });

  return {
    usersData,
    isLoadingUsersList,
    isErrorUsersList,
    refetchUsersList,
  };
};

export {
  useTaskAllList,
  useTaskMyList,
  TaskCUD,
  useProjectAdditional,
  useUsersList,
};

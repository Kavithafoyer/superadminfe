import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from 'app/services/auth-services';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

const NotificationProvider = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const [datas1, setDatas1] = useState([]);
  const prevEmailCountRef = useRef(0); // Ref to store the previous email count

  const showNotification = (message, newData) => {
    // Use the newData to display the newly added email details in the notification
    if (newData.length > 0) {
      const emailDetails = newData[0]; // Assuming you only add one email at a time
      const notificationMessage = `New email added:
      "Subject": ${emailDetails.subject} -
      "Sender": ${emailDetails.sender}`;
      toast.info(notificationMessage);
    }
  };

const token = localStorage.getItem("accesstoken");
const item = "crmuseradmin1";
  const getData = async () => {
    try {
      const res1 = await axios.get(
        `${BASE_URL}/user/InboxEmailStoring/?UserId=1&MailId=ravimech476@gmail.com`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      const res2 = await axios.get(
        `${BASE_URL}/user/InboxEmailCRUD/`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      setDatas1(res2.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn === 'true') {
      // Only fetch data if the user is logged in
      getData();
      const interval = setInterval(() => {
        getData();
      }, 5000); // Fetch data every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // This effect runs whenever datas1 state changes
    if (isLoggedIn === 'true') {
      const currentEmailCount = datas1.length;
      if (currentEmailCount > prevEmailCountRef.current) {
        const newlyAddedData = datas1.slice(prevEmailCountRef.current);
        showNotification('New email added!', newlyAddedData);
      }
      prevEmailCountRef.current = currentEmailCount; // Update the previous email count with the current count
    }
  }, [datas1, isLoggedIn]);

  return (
    <NotificationContext.Provider value={{ datas1 }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

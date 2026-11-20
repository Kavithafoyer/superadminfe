import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (url, options) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(url, options);
        setData(response.data);
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error data:", error.response.data);
          console.error("Error status:", error.response.status);
          console.error("Error headers:", error.response.headers);
          setError(`Request failed with status code ${error.response.status}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Error request:", error.request);
          setError("No response received from the server.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options]);

  return { data, error, loading };
};

export default useFetch;

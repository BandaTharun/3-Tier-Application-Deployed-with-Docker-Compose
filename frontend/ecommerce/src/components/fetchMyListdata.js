import { useState, useEffect } from "react";
import axios from "axios";

const useMyList = () => {
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    async function fetchMyList() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          "/mylist/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setMyList(response.data); // Set myList directly with response.data
      } catch (error) {
        console.error("Error fetching myList:", error);
      }
    }
    fetchMyList();
  }, []);

  return myList;
};

export default useMyList;

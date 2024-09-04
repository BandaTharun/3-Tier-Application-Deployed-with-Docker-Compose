import { useState, useEffect } from "react";
import axios from "axios";

const useMyratings = () => {
  const [MyRatings, setRatings] = useState([]);

  useEffect(() => {

    async function fetchRatings() {

      try {

        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
            `/rating/`,
            {  // Specify the request body with the movie title
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        setRatings(response.data); // Set myList directly with response.data
      } catch (error) {
        console.error("Error fetching myList:", error);
      }
    }
    fetchRatings();
  }, []);

  return MyRatings;
};

export default useMyratings;

import { useState, useEffect } from "react";
import axios from "axios";

function useMyList() {
    // Initialize state to store movie list
    const [movieList, setMovieList] = useState([]);

    // Fetch data and update movieList
    useEffect(() => {
        // Fetch data function
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                // Use axios directly without converting response to JSON
                const response = await axios.get("/recommend/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                // Update state with response data
                setMovieList(response.data.movie_list);
            } catch (error) {
                console.error('Error fetching movie list:', error);
            }
        };

        fetchData(); // Call the fetch function
    }, []); // Empty dependency array to run only once

    return movieList;
}

export default useMyList;

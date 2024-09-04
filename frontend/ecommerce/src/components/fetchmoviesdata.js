import { useState, useEffect } from "react";
import axios from "axios";

const useProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Uncomment this section if you need to include an access token
        // const accessToken = localStorage.getItem('accessToken');
        // const { data } = await axios.get("/movies/", {
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`
        //   }
        // });

        // Make sure the endpoint is correct and returns the expected movie data
        const { data } = await axios.get("/movies/");

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  return products;
};

export default useProducts;

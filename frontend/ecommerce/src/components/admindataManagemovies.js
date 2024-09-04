import React from 'react';
import axios from 'axios';
import { useState, useEffect } from "react";

export const addMovie = (movieTitle, movieGenre, imageUrl) => {
  const accessToken = localStorage.getItem("accessToken");
  return axios.post('/adminmanage_movies/', {
    title: movieTitle,
    genre: movieGenre,
    image_url: imageUrl
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    // Handle success
    console.log('Movie added successfully:', response.data);
    return response.data; // Return response data
  })
  .catch(error => {
    // Handle error
    console.error('Error adding movie:', error);
    throw error; // Throw error to catch it in the calling function
  });
};


export const deleteMovie = (movieTitle) => {
  const accessToken = localStorage.getItem("accessToken");
  return axios.delete('/adminmanage_movies/', {
      data: { title : movieTitle,}, // Specify the request body with the movie title
      headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json" ,
      },
  })
  .then(response => {
    // Handle success
    console.log('Movie deleted successfully:', response.data);
    return response.data; // Return response data
  })
  .catch(error => {
    // Handle error
    console.error('Error deleting movie:', error);
    throw error; // Throw error to catch it in the calling function
  });
};



export const updateMovie = (movieTitle, movieGenre, imageUrl) => { // Changed the parameters to include genre and imageUrl
  const accessToken = localStorage.getItem("accessToken");
  return axios.put(`/adminmanage_movies/${movieTitle}`, { // Changed the URL to include movie title
    genre: movieGenre, // Added genre field
    image_url: imageUrl // Added imageUrl field
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    // Handle success
    console.log('Movie updated successfully:', response.data);
    return response.data; // Return response data
  })
  .catch(error => {
    // Handle error
    console.error('Error updating movie:', error);
    throw error; // Throw error to catch it in the calling function
  });
};



export default function AdmindataManageMovies() {
  // No need to return JSX from this component
  return null;
}



import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Container,Nav } from "react-bootstrap";
import { Routes, Route, Link } from 'react-router-dom';
import ManageMovies from "./Managemovies";
import ManageUsers from "./Manageusers";


import Footer from "./Footer";

function MyList() {
  const [successToken, setSuccessToken] = useState(""); // Corrected variable name
  
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      // Set the success token value
      setSuccessToken(accessToken);

    } else {
      // Display message to the user if not logged in
      console.log("You haven't been logged in.");
    }
  }, []);

  return (
    <div className="text-center mt-5">
      {successToken ? (
        <>
    <div className="text-center mt-5">
          <Container>
            <h1>WELCOME TO ADMIN PAGE</h1>
            <ul>
              <li>
                <Link to="/admin/manage-movies">Manage Movies</Link>
              </li>
              <li>
                <Link to="/admin/manage-users">Manage Users</Link>
              </li>
            </ul>
          </Container>
          <Footer /> {/* Include Footer component here */}
        </div>
        </>
      ) : (
        <>
          <h2>
             You are not authourised to use You have to be a  registered Admin and logged-in .
          </h2>
          <LinkContainer to="/login">
            <Nav.Link className="navbar-link active">
              <h5> Click Here To Login </h5>
            </Nav.Link>
          </LinkContainer>
        </>
      )}
    </div>
  );
}

export default MyList;

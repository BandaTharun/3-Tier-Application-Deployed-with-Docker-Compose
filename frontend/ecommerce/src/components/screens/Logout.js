import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Nav } from "react-bootstrap";

function Logout() {
  const [Successtoken, setSuccesstoken] = useState(""); // Declare state variable

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      // Set the success token value
      setSuccesstoken(accessToken);
      // Remove access token from localStorage
      localStorage.removeItem("accessToken");
    } else {
      // Display message to the user if not logged in
      console.log("You haven't been logged in.");
    }
  }, []);

  return (
    <div className="text-center mt-5">
      {Successtoken ? (
        <>
          <h2>You have successfully logged out</h2>
          <p>Thank you for using Movie-Recommendation.</p>
          <LinkContainer to="/">
            <Nav.Link className="navbar-link active">Home <i className="fa-solid fa-house"></i></Nav.Link>
          </LinkContainer>
        </> 
      ) : (
        <>
          <h2>You haven't logged in yet to Logout </h2>
          <LinkContainer to="/login">
          <Nav.Link className="navbar-link active"> <h5>  Click Here To Login  </h5>  </Nav.Link>
          </LinkContainer>
        </>
      )}
    </div>
  );
}

export default Logout;



import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Container, Row, Col, Nav } from "react-bootstrap";
import useMyList from "./fetchMyListdata";


import Mylistsscreen from "./Mylistsscreen";
import Footer from "./Footer";

function MyList() {
  const myListDetails = useMyList();
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
          <Container>
            <br />
            <h1>MyList</h1>
            <Row>
              {myListDetails.map((product) => (
                <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                  <Mylistsscreen product={product} /> {/* Ensure product prop is passed correctly */}
                </Col>
              ))}
            </Row>
          </Container>
          <Footer /> {/* Include Footer component here */}
        </>
      ) : (
        <>
          <h2>
            To save your movie MyList and showcase them, You need to be a registered and logged-in user.
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

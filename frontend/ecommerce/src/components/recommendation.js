




import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Container, Row, Col, Nav } from "react-bootstrap";

import useMyList from './fetchrecommenddata'; // Importing the custom hook


import Recommendation  from "./recommendationscreen";
import Footer from "./Footer";

function MovieDisplay() {
    const movieList = useMyList(); // Using the custom hook
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

    if (!Array.isArray(movieList)) {
        // If movieList is not an array, return a message or an empty div
        return <div>No movies available</div>;
    }

    return (
        <div className="text-center mt-5">
            {successToken ? (
                <>
                    <Container>
                        <br />
                        <h1>Recommendations</h1>
                        <Row>
                            {movieList.map((product) => (
                                <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                                    <Recommendation product={product} /> {/* Ensure product prop is passed correctly */}
                                </Col>
                            ))}
                        </Row>
                    </Container>
                    <Footer /> {/* Include Footer component here */}
                </>
            ) : (
                <>
                    <h2> You need to be a logged-in user to Showcase Recommendations.</h2>
                    <LinkContainer to="/login">
                        <Nav.Link className="navbar-link active">
                            <h5>Click Here To Login</h5>
                        </Nav.Link>
                    </LinkContainer>
                </>
            )}
        </div>
    );
}

export default MovieDisplay;

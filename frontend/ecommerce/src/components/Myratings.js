import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Container, Row, Col, Nav } from "react-bootstrap";
import Footer from "./Footer";
import Myratingscreen from "./myratingscreen";
import myratings from "./fetchMyRatingdata";
import movies_data from "./fetchmoviesdata";

function Myratings() {
  const rating = myratings();
  const movies = movies_data();

  const usermovieIds = rating.map((item) => item.movie);
  const userratings = rating.map((item) => item.rating);

  const [Successtoken, setSuccesstoken] = useState(""); // Declare state variable

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      // Set the success token value
      setSuccesstoken(accessToken);
    } else {
      // Display message to the user if not logged in
      console.log("You haven't been logged in.");
    }
  }, []);

  function getMovieDetails(usermovieIds) {
    return usermovieIds.map((movieId) => {
      const movie = movies.find((movie) => movie.id === movieId);
      return movie ? movie : `Movie with ID ${movieId} not found`;
    });
  }

  const usermovieDetails = getMovieDetails(usermovieIds);

  // Zip usermovieDetails with userratings
  const zippedData = usermovieDetails.map((movie, index) => ({
    movie,
    rating: userratings[index],
  }));

  return (
    <div className="text-center mt-5">
      {Successtoken ? (
        <>
          <Container>
            <br />
            <h1>MyRatings</h1>
            <Row>
              {zippedData.map(({ movie, rating }) => (
                <Col key={movie.id} sm={12} md={6} lg={4} xl={3}>
                  <Myratingscreen product={movie} rating={rating} />
                </Col>
              ))}
            </Row>
          </Container>
          <Footer /> {/* Assuming Footer is imported and declared somewhere */}
        </>
      ) : (
        <>
          <h2>
            Your data wasn't present in your Database. To save your movie Ratings and showcase them, you need to be a registered and logged-in user.
          </h2>
          <LinkContainer to="/login">
            <Nav.Link className="navbar-link active">
              <h5> Click Here To Login </h5>{" "}
            </Nav.Link>
          </LinkContainer>
        </>
      )}
    </div>
  );
}

export default Myratings;

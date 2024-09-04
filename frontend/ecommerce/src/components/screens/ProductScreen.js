import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Container, Form } from "react-bootstrap";
import Rating from "../Rating_symbol";
import axios from "axios";
import Footer from "../Footer";
import movies_data from "../fetchmoviesdata";
import MovieDetailsFetcher from "../fetchapitmbd";


function ProductScreen() {
  const { id } = useParams();
  const moviesData = movies_data();
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [movieDetails, setMovieDetails] = useState(null);

  const handleMovieDetailsFetched = (data) => {
    setMovieDetails(data);
    };



  const getMovieImageURL = (movieId) => {
    const movie = moviesData.find((movie) => movie.id === parseInt(movieId));
    return movie ? movie.image_url : null;
  };

  const getMovieTitle = (movieId) => {
    const movie = moviesData.find((movie) => movie.id === parseInt(movieId));
    return movie ? movie.title : null;
  };


  const getMoviegenre = (movieId) => {
    const movie = moviesData.find((movie) => movie.id === parseInt(movieId));
    return movie ? movie.genre : null;
  };


  const movieImageURL = getMovieImageURL(id);
  const currentMovieTitle = getMovieTitle(id);
  const currentMovieGenre = getMoviegenre(id);

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    if (checked) {
      addToMyList(); // Call addToMyList when the checkbox is checked
    }
  };

  const submitRating = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `/rating/`,
        {
          movie: currentMovieTitle,
          rating: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { message } = response.data;

      if (response.status === 201) {
        setSuccessMessage(message);
        setError("");
      } else {
        setError("Error adding rating. Please try again later.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      setError("You have already added this movie Rating checkout your Myratings.");
      setSuccessMessage("");
    }
  };

  const addToMyList = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `/mylist/`,
        {
          movie: currentMovieTitle,
        },  
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { message } = response.data;

      if (response.status === 201) {
        setSuccessMessage(message);
        setError("");
      } else {
        setError("Error adding rating. Please try again later.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      setError("You have already added this movie to your Mylist checkout.");
      setSuccessMessage("");
    }
  };

  function MovieDetailsDisplay({ movieDetails }) {
    if (!movieDetails) {
        return <div>No movie details available</div>;
    }
  
    return (
  <div>
      <h1>{movieDetails.original_title}</h1>
      <p>Overview: {movieDetails.overview}</p>
      <p>original_language: {movieDetails.original_language}</p>
      <p>Movie_Genres: {currentMovieGenre}</p>
      <p>Release Date: {movieDetails.release_date}</p>
      <p>Popularity: {movieDetails.popularity}</p>
      <p>Vote Average: {movieDetails.vote_average}</p>
      <p>Vote Count: {movieDetails.vote_count}</p>
      <p>
          Watch trailer: <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movieDetails.original_title)}`}>Trailer</a>
      </p>
      <hr /> {/* Add a separator between movies */}
  </div>
  
    );
  }
  

  return (
    <Container>
      <br />
      <div>
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
      </div>
      <div>
        <Link to="/" className="btn btn-dark my-3">
          Go Back
        </Link>

        <Row>
          <h1>{currentMovieTitle}</h1>

          <Col md={6}>
            <Image src={movieImageURL} style={{ height: "1000px" }}  fluid />
          </Col>

          <Col md={3}>
            <ListGroup variant="flush">

            <MovieDetailsFetcher movieName={currentMovieTitle} onMovieDetailsFetched={handleMovieDetailsFetched} />
            <MovieDetailsDisplay movieDetails={movieDetails} />


            <h4>Give Your Presonal Rating </h4>
              <ListGroup.Item>
                <Rating value={rating} onChange={(value) => setRating(value)} />
              </ListGroup.Item>

              <ListGroup.Item>
                <Button onClick={submitRating} className="btn-block" disabled={rating === 0}>
                  Submit Rating
                </Button>
              </ListGroup.Item>
              <ListGroup.Item>
                <Form.Check
                  type="checkbox"
                  label="Add to My List"
                  onChange={handleCheckboxChange}
                />
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </div>
      <Footer />
    </Container>
  );
}

export default ProductScreen;

import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Container, Nav, Col, Button, Modal, Form, Alert } from "react-bootstrap";
import fetchMoviesData from "./fetchmoviesdata";
import Footer from "./Footer";
import { addMovie, deleteMovie } from './admindataManagemovies'; // Importing functions from AdmindataManageMovies

function MyList() {
  const movies = fetchMoviesData();
  const [successToken, setSuccessToken] = useState("");
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [formValues, setFormValues] = useState({
    movieName: "",
    movieGenre: "",
    movieURL: ""
  });
  const [submitMessage, setSubmitMessage] = useState({
    variant: "success",
    message: ""
  });

  useEffect(() => {
    if (accessToken) {
      setSuccessToken(accessToken);
    } else {
      console.log("You haven't been logged in.");
    }
  }, [accessToken]);

  const handleShowAddMovieModal = () => setShowAddMovieModal(true);
  const handleCloseAddMovieModal = () => setShowAddMovieModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleAddMovie = () => {
    addMovie(formValues.movieName, formValues.movieGenre, formValues.movieURL)
      .then(response => {

        // Clear form values
        setFormValues({
          movieName: "",
          movieGenre: "",
          movieURL: ""
        });
        // Close the modal
        setShowAddMovieModal(false);

        // Reload page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      // Handle success - maybe show a success message or update some state
      setSubmitMessage({
        variant: "success",
        message: "Movie added successfully."
      });

      console.log('Movie added successfully:', response.data);


      })
      .catch(error => {

        // Handle success - maybe show a success message or update some state
        setSubmitMessage({
          variant: "warning",
          message: "Error adding movie. Please try again later."
        });

        console.error('Error adding movie:', error);
      });
  };


  const handleDeleteMovie = (movietitle) => {
    deleteMovie(movietitle) 
      .then(response => {

      // Move screen up from down
      window.scrollTo({ top: 0, behavior: 'smooth' });

        // Reload page after 2 seconds
          setTimeout(() => {
            window.location.reload();
          }, 1000);

          
        // Handle success - maybe show a success message or update some state
        setSubmitMessage({
          variant: "success",
          message: "Movie deleted successfully."
        });

        // Handle success - maybe show a success message or update some state
        console.log('Movie deleted successfully:', response.data);


      })
      .catch(error => {

        // Move screen up from down
        window.scrollTo({ top: 0, behavior: 'smooth' });


        // Reload page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 1000);

        // Handle error - maybe show an error message to the user
        setSubmitMessage({
          variant: "danger",
          message: "Error deleted movie. Please try again later."
        });

      // Handle error - maybe show an error message to the user
      console.error('Error deleting movie:', error);

      });
  };



  return (
    <div className="text-center mt-5">
      {successToken ? (
        <div>
          <h2>Manage Movies</h2>

          {submitMessage.message && (
            <Alert variant={submitMessage.variant}>
              {submitMessage.message}
            </Alert>
          )}

          <Button variant="primary" onClick={handleShowAddMovieModal}>Add Movie</Button>

          <table className="table table-borderless table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Genre</th>
                <th scope="col">URL</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie, index) => (
                <tr key={movie._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{movie.title}</td>
                  <td>{movie.genre}</td>
                  <td>
                    <a href={movie.image_url} target="_blank" rel="noopener noreferrer">
                      {movie.image_url.split("/").slice(-2)[0]}
                    </a>
                  </td>
                  <td>
                     {/* <Button variant="outline-success" onClick={handleAddMovie}>UPDATE</Button>*/} 
                     <Button variant="outline-success" onClick={handleAddMovie}>UPDATE</Button>
                    <Button variant="outline-danger" onClick={() => { handleDeleteMovie(movie.title); }}>DELETE</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <h2>
            You are not authorized to use. You have to be a registered Admin and logged-in.
          </h2>
          <LinkContainer to="/Admin">
            <Nav.Link className="navbar-link active">
              <h5> Click Here To Login </h5>
            </Nav.Link>
          </LinkContainer>
        </>
      )}

      <Modal show={showAddMovieModal} onHide={handleCloseAddMovieModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMovie}>
            <Form.Group controlId="formMovieName">
              <Form.Label>Movie Name</Form.Label>
              <Form.Control type="text" placeholder="Enter movie name" name="movieName" value={formValues.movieName} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formMovieGenre">
              <Form.Label>Genre</Form.Label>
              <Form.Control type="text" placeholder="Enter movie genre" name="movieGenre" value={formValues.movieGenre} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formMovieURL">
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="text" placeholder="Enter image URL" name="movieURL" value={formValues.movieURL} onChange={handleInputChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  );
}

export default MyList;

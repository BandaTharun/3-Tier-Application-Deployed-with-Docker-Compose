import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LinkContainer } from "react-router-bootstrap";
import { Nav } from "react-bootstrap";

function SignupScreen() {
  const [successToken, setSuccessToken] = useState("");
  const [formData, setFormData] = useState({
    username: '',
    email: '',       // Changed from Email to email
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/signup/', formData);
      const { data } = response;
      if (data && data.message) {
        // Display success message from the server
        setSuccessMessage(data.message);
        // Reset error message
        setError('');
        // Clear form data
        setFormData({
          username: '',
          email: '',
          password: '',
        });
      }
    } catch (error) {
      setError('Failed to register. Please try again.');
    }
  };

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
          <h2>Your'e Already a Registered User and You have Successfully logined. You can start using.</h2>
          <p>Thank you for using Movie-Recommendation.</p>
          <LinkContainer to="/">
            <Nav.Link className="navbar-link active">Home <i className="fa-solid fa-house"></i></Nav.Link>
          </LinkContainer>
        </>
      ) : (
        <>
          <section className="vh-100" style={{ backgroundColor: '#eee' }}>
            <div className="container h-100">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-lg-12 col-xl-11">
                  <div className="card text-black" style={{ borderRadius: '25px' }}>
                    <div className="card-body p-md-5">
                      <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                          <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Signup</p>
                          {error && <div className="alert alert-danger">{error}</div>}
                          {successMessage && <div className="alert alert-success">{successMessage}</div>}
                          <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                            <div className="d-flex flex-row align-items-center mb-4">
                              <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                              <div data-mdb-input-init className="form-outline flex-fill mb-0">
                                <input
                                  type="text"
                                  id="form3Example1c"
                                  className="form-control"
                                  name="username"
                                  value={formData.username}
                                  onChange={handleChange}
                                />
                                <label className="form-label" htmlFor="form3Example1c">User Name</label>
                              </div>
                            </div>

                            <div className="d-flex flex-row align-items-center mb-4">
                              <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                              <div data-mdb-input-init className="form-outline flex-fill mb-0">
                                <input
                                  type="email"
                                  id="form3Example1c"
                                  className="form-control"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                />
                                <label className="form-label" htmlFor="form3Example1c">Email</label>
                              </div>
                            </div>

                            <div className="d-flex flex-row align-items-center mb-4">
                              <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                              <div data-mdb-input-init className="form-outline flex-fill mb-0">
                                <input
                                  type="password"
                                  id="form3Example4c"
                                  className="form-control"
                                  name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                />
                                <label className="form-label" htmlFor="form3Example4c">Password</label>
                              </div>
                            </div>
                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                              <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-lg">Signup</button>
                            </div>
                          </form>
                          <LinkContainer to="/login">
                            <Nav.Link className="navbar-link active"> <h5> If You Are the Registered User click Here </h5> </Nav.Link>
                          </LinkContainer>
                        </div>
                        <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp" className="img-fluid" alt="Sample image" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default SignupScreen;

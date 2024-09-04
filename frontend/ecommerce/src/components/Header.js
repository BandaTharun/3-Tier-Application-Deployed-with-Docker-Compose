


import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav } from "react-bootstrap";


function Header() {
  return (
    <>

      <Navbar className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
        <div className="container-fluid">

          <LinkContainer to="/">
            <Nav.Link className="navbar-brand"> Movie-Recommendation  </Nav.Link>
          </LinkContainer>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor02"
            aria-controls="navbarColor02"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarColor02">
            <ul className="navbar-nav me-auto">



              <li className="nav-item">
                <LinkContainer to="/">
                  <Nav.Link className="navbar-link active">Home <i className="fa-solid fa-house"></i></Nav.Link>
                </LinkContainer>
              </li>



            </ul>


            {/* Move these items to the right */}



            

            <ul className="navbar-nav ml-auto">

            <li className="nav-item">
                <LinkContainer to="/Getrecommendation">
                  <Nav.Link className="navbar-link active"> <h6>GetRecommendation</h6> </Nav.Link>
                </LinkContainer>
              </li>



              <li className="nav-item">
                <LinkContainer to="/MyRatings">
                  <Nav.Link className="navbar-link active"> MyRatings </Nav.Link>
                </LinkContainer>
              </li>


              <li className="nav-item">
                <LinkContainer to="/mylist">
                  <Nav.Link className="navbar-link active"> Mylist </Nav.Link>
                </LinkContainer>
              </li>


              <li className="nav-item">
                <LinkContainer to="/login">
                  <Nav.Link className="navbar-link active"> Login </Nav.Link>
                </LinkContainer>
              </li>

              <li className="nav-item">
                <LinkContainer to="/signup">
                  <Nav.Link className="navbar-link active"> Signup </Nav.Link>
                </LinkContainer>
              </li>

              <li className="nav-item">
                <LinkContainer to="/logout">
                  <Nav.Link className="navbar-link active">Logout </Nav.Link>
                </LinkContainer>
              </li>
            </ul>


          </div>
        </div>
      </Navbar>
    </>
  );
}

export default Header;
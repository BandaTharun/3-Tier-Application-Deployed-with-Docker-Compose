


import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav } from "react-bootstrap";


function Header() {
  return (
    <>

      <Navbar className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
        <div className="container-fluid">

          <LinkContainer to="/Adminpage">
            <Nav.Link className="navbar-brand"> Movie-Recommendation Admin Page  </Nav.Link>
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
                <LinkContainer to="/Adminpage">
                  <Nav.Link className="navbar-link active"> Main Page  <i className="fa-solid fa-house"></i></Nav.Link>
                </LinkContainer>
              </li>

            </ul>


            {/* Move these items to the right */}

            <ul className="navbar-nav ml-auto">

            <li className="nav-item">
                <LinkContainer to="/admin/manage-movies">
                  <Nav.Link className="navbar-link active"> <h6> Manage Movies </h6> </Nav.Link>
                </LinkContainer>
              </li>



              <li className="nav-item">
                <LinkContainer to="/admin/manage-users">
                  <Nav.Link className="navbar-link active"> <h6> Manage Users  </h6></Nav.Link>
                </LinkContainer>
              </li>

              <li className="nav-item">
                <LinkContainer to="/">
                  <Nav.Link className="navbar-link active"> <h6> Home Website Page </h6> </Nav.Link>
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
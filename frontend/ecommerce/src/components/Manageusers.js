import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Container, Nav, Col, Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios"; // Import axios
import fetchuserdata from "./fetchusersData";
import Footer from "./Footer";

function MyList() {
  const [USERSDATA, setUSERSDATA] = useState([]); // State to store user data
  const [successToken, setSuccessToken] = useState("");
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [submitMessage, setSubmitMessage] = useState({ variant: "success", message: "" });
  const Users = fetchuserdata();

  const deleteuser = (username) => {
    // Get accessToken directly from state
    const accessToken = localStorage.getItem("accessToken");
    axios.delete('/adminmanage_users/', {
      data: { username: username }, // Specify the request body with the username
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

      .then(response => {
        // Move screen up from down
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Reload page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 1000);

        // Handle success
        setSubmitMessage({
          variant: "success",
          message: "User deleted successfully."
        });

        console.log('User deleted successfully:', response.data);
      })
      .catch(error => {
        // Move screen up from down
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Reload page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 1000);

        // Handle error
        setSubmitMessage({
          variant: "danger",
          message: "Error deleting user. Please try again later."
        });

        console.error('Error deleting user:', error);
      });
  };

  return (
    <div className="text-center mt-5">
      {accessToken ? (
        <div>
          <h2>Manage Users</h2>

          {submitMessage.message && (
            <Alert variant={submitMessage.variant}>
              {submitMessage.message}
            </Alert>
          )}

          <table className="table table-borderless table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">id</th>
                <th scope="col">username</th>
                <th scope="col">email</th>
                <th scope="col">IS_STAFF</th>
                <th scope="col">IS_SUPERUSER</th>
                <th scope="col">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {Users.map((user, index) => (
                <tr key={user.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.is_staff ? "Yes" : "No"}</td>
                  <td>{user.is_superuser ? "Yes" : "No"}</td>
                  <td>
                    {/* Pass the username to deleteuser */}
                    <Button variant="outline-danger" onClick={() => deleteuser(user.username)}>DELETE USER</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <h2>You are not authorized to use. You have to be a registered Admin and logged-in.</h2>
          <LinkContainer to="/Admin">
            <Nav.Link className="navbar-link active">
              <h5> Click Here To Login </h5>
            </Nav.Link>
          </LinkContainer>
        </>
      )}
      <Footer />
    </div>
  );
}

export default MyList;

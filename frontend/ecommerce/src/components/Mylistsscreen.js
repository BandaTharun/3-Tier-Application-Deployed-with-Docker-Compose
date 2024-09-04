import React, { useState } from 'react';
import { Card, ListGroup, Form, Alert } from "react-bootstrap";
import axios from 'axios'; // Import axios for HTTP requests
import { Link } from 'react-router-dom';



function Mylistsscreen({ product }) {
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleDelete = async () => {
        try {

            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.delete(
                `/mylist/`,
                {
                    data: { movie: product.title }, // Specify the request body with the movie title
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const { message } = response.data;

            if (response.status === 200) {
                setSuccessMessage(message);
                setError("");
                window.location.reload(); // Refresh the page
            } else {
                setError("Error deleting. Please try again later.");
                setSuccessMessage("");
            }
        } catch (error) {
            console.error("Error deleting movie:", error);
            setError("An error occurred. Please try again later.");
            setSuccessMessage("");
        }
    };

    return (
        <Card className='my-3 p-3 rounded'>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Link to={`/movies/${product.id}/`}>
            <Card.Img
            src={product.image_url}
            style={{ height: "400px" }} // Set the height directly in style attribute
            className="card-image" />
            </Link>
            <Card.Body>
                <Link to={`/movies/${product.id}/`} className='text-dark'>
                    <Card.Title as="h3">
                        <Link to={`/movies/${product.id}/`} className='text-dark'>
                            {product.title}
                        </Link>
                    </Card.Title>
                </Link>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Form.Check
                            type="checkbox"
                            label="Click on the Checkbox To Delete the Movie from MyList"
                            onChange={handleDelete} // Pass handleDelete function as onChange callback
                            style={{ color: 'blue' }}
                        />
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    );
}

export default Mylistsscreen;

import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Form, Alert, Button } from "react-bootstrap";
import axios from 'axios'; // Import axios for HTTP requests
import { Link } from 'react-router-dom';
import Rating from "./Rating_symbol"; // Assuming Rating component is imported

function Myratingscreen({ product, rating }) {
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [newRating, setNewRating] = useState(rating); // Initialize newRating state with rating prop

    const handleDelete = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");

            const response = await axios.delete(
                `/rating/`,
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

    const submitRating = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await axios.put(
                `/rating/`,
                {
                    movie: product.title,
                    rating: newRating, // Use newRating state instead of rating prop
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const { message } = response.data;

            if (response.status === 200) {
                setSuccessMessage(message);
                setError("");
            } else {
                setError("Error updating rating. Please try again later.");
                setSuccessMessage("");
            }
        } catch (error) {
            console.error("Error updating rating:", error);
            setError("An error occurred. Please try again later.");
            setSuccessMessage("");
        }
    };

    useEffect(() => {
        // Reload the page when successMessage changes
        if (successMessage) {
            window.location.reload();
        }
    }, [successMessage]);

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
                            label=" Click on the Checkbox To Delete the movie from MyRatings"
                            onChange={handleDelete} // Pass handleDelete function as onChange callback
                            style={{ color: 'blue' }}
                        />
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Rating value={newRating} onChange={(value) => setNewRating(value)} />
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Button onClick={submitRating} className="btn-block" disabled={newRating === rating}>
                            Update Rating
                        </Button>
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    );
}

export default Myratingscreen;

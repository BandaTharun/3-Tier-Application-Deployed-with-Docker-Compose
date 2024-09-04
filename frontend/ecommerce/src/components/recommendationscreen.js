


import React from 'react'
import {Card} from "react-bootstrap"
import {Link} from 'react-router-dom'

function recommend({product}) {
  return (

        <Card className='my-3 p-3 rounded'>
            <Link to={`/movies/${product.id}/`} key={product.id}>
            <Card className="movie-card">
            <Card.Img
            src={product.image_url}
            style={{ height: "400px" }} // Set the height directly in style attribute
            className="card-image" />
            </Card>
            </Link>
        <Card.Body>
        <Link to={`/movies/${product.id}/`}  className='text-dark'>
            <Card.Title as="h3">
            <Link to={`/movies/${product.id}/`} className='text-dark'>
                {product.title}
                </Link>
            </Card.Title>
           </Link>  
        <Card.Text as="div">
        </Card.Text>

        {/*     
        <Card.Text as="h6">
            {product.price} Rs
        </Card.Text>
        {/* 
        <Rating
          value={product.rating}
          text={`${product.numReviews} reviews`}
          color={"#f8e825"}
        /> 
        */}

        </Card.Body>
    </Card>
  )
}

export default recommend; 
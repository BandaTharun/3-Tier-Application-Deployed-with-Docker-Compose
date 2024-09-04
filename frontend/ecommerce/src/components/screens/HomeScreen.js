



import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Product from "../Product";
import movies_data from "../fetchmoviesdata";
import Footer from "../Footer"; // Import Footer component

function HomeScreen() {
  const products = movies_data();

  return (
    <>
      <Container >
        <br />
        <h1>Movies</h1>
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
              {product.title}
            </Col>
          ))}
        </Row>
      </Container>
      <Footer /> {/* Include Footer component here */}
    </>
  );
}

export default HomeScreen;

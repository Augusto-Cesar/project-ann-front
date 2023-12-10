import aws from 'aws-sdk';
import axios from "axios";
import React from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Table from "react-bootstrap/Table";
import Accordion from 'react-bootstrap/Accordion';


class Product extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            products: [],
            name: '',
            category: '',
            price: '',
            file: null
        }
    }

    urlImage = '';

    componentDidMount() {
        this.listProducts();
    }

    async listProducts() {
        // axios.get("http://localhost:8080/product/products")
        axios.get("https://prm6rppsh0.execute-api.us-east-1.amazonaws.com/dev/product/products")
            .then(response => {
                this.setState({ products: response.data });
            }
            ).catch(error => {
                console.error(error);
            });
    }

    deleteProduct = (id) => {
        // axios.delete("http://localhost:8080/product/products/" + id)
        axios.delete("https://prm6rppsh0.execute-api.us-east-1.amazonaws.com/dev/product/products/" + id)
            .then(response => {
                console.log(response.data);
                this.listProducts();
                alert("Product deleted!")
            })
            .catch(error => {
                console.error(error);
            })
    }

    createProduct = (product) => {
        // axios.post("http://localhost:8080/product",
        axios.post("https://prm6rppsh0.execute-api.us-east-1.amazonaws.com/dev/product",
            JSON.stringify(product), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data);
                this.listProducts();
                this.clearStateProduct();
                alert("Product created!")
            })
            .catch(error => {
                console.error(error);
            })
    }

    clearStateProduct() {
        this.setState({ name: '' });
        this.setState({ category: '' });
        this.setState({ price: '' });
        this.setState({ file: null });
    }

    setName = (e) => {
        this.setState({ name: e.target.value })
    }
    setCategory = (e) => {
        this.setState({ category: e.target.value })
    }
    setPrice = (e) => {
        this.setState({ price: e.target.value })
    }
    setFile = (e) => {
        // const file = e.target.files[0]
        this.setState({ file: e.target.files[0] })
    }

    submit = async () => {
        await this.uploadFile();
        const product = {
            name: this.state.name,
            category: this.state.category,
            price: this.state.price,
            urlImage: this.urlImage
        }
        this.createProduct(product);
    }

    uploadFile = async () => {
        // S3 Bucket Name
        const S3_BUCKET = "www.annsystem.images";

        // S3 Region
        const REGION = "us-east-1";

        // S3 Credentials
        aws.config.update({
            accessKeyId: "AKIATB6WV4BMQ6YYIBL5",
            secretAccessKey: "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",
        });
        const s3 = new aws.S3({
            params: { Bucket: S3_BUCKET },
            region: REGION,
        });

        // Files Parameters
        const params = {
            Bucket: S3_BUCKET,
            Key: this.state.file.name,
            Body: this.state.file,
        };

        try {
            const data = await s3.upload(params).promise();
            console.log('Imagem enviada com sucesso. URL:', data.Location);
            this.urlImage = data.Location;
            console.log('var.urlImage', this.urlImage)
        } catch (error) {
            console.error('Erro ao enviar imagem:', error);
        }
    };

    render() {

        return (
            <div>
                <Accordion defaultActiveKey={['1']} alwaysOpen>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Product registration</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="productname">
                                    <Form.Label>Product name</Form.Label>
                                    <Form.Control required type="text" placeholder="product name" value={this.state.name} onChange={this.setName} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="productcategory">
                                    <Form.Label>Product category</Form.Label>
                                    <Form.Control required type="text" placeholder="product category" value={this.state.category} onChange={this.setCategory} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="productprice">
                                    <Form.Label>Product price</Form.Label>
                                    <Form.Control required type="text" placeholder="product price" value={this.state.price} onChange={this.setPrice} />
                                </Form.Group>
                                <Form.Group controlId="productimage" className="mb-3">
                                    <Form.Label>Product image</Form.Label>
                                    <Form.Control required type="file" onChange={this.setFile} />
                                </Form.Group>
                                <Button variant="primary" onClick={this.submit}>Save product</Button>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>List of Products</Accordion.Header>
                        <Accordion.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.products.map((product) =>
                                            <tr key={product.id}>
                                                <td>
                                                    <Container>
                                                        <Image src={product.urlImage} thumbnail />
                                                    </Container>
                                                </td>
                                                <td align="left">
                                                    <p>
                                                        {product.name}
                                                    </p>
                                                    <p>
                                                        Categoty: {product.category}
                                                    </p>
                                                    <p>
                                                        Price: {'$' + product.price}
                                                    </p>
                                                </td>
                                                <td><Button variant="outline-danger" onClick={() => this.deleteProduct(product.id)}>Delete</Button></td>
                                            </tr>
                                        )
                                    }

                                </tbody>
                            </Table>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        )
    }

}

export default Product;


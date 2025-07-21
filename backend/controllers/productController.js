const express = require('express');
const Product = require('../models/Product'); // Adjust the path as needed

// Controller to get all products
const getAllProducts = async (req, res) => {
    try {
        console.log('GET /api/products called'); // Debugging
        const products = await Product.find();
        console.log('Products fetched:', products); // Debugging
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

// Controller to get a single product by title
const getProductByTitle = async (req, res) => {
    try {
        const productTitle = req.params.title;
        const product = await Product.findOne({ title: productTitle }); // Fetch product by title

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
};

// Controller to create a new product
const createProduct = async (req, res) => {
    try {
        const { title, price } = req.body;

        if (!title || !price) {
            return res.status(400).json({ message: 'Title and price are required' });
        }

        const newProduct = new Product({ title, price }); // Create a new product instance
        await newProduct.save(); // Save the product to the database

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
};

// Export controllers
module.exports = {
    getAllProducts,
    getProductByTitle,
    createProduct,
};
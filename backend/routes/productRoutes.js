const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route to get all products
router.get('/', productController.getAllProducts);

// Route to get a single product by title
router.get('/title/:title', productController.getProductByTitle);

// Route to create a new product
router.post('/', productController.createProduct);

// // Route to update a product by title
// router.put('/:title', updateProduct);

// // Route to delete a product by title
// router.delete('/:title', deleteProduct);

module.exports = router;
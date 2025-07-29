const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    stock: {
        type: Number,
        required: true,
        trim: true,
    },
    seller: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    reviews: {
        type: Array,
        required: true
    }
});

// Add indexes for better performance
productSchema.index({ title: 1 }); // For fast search by product title
productSchema.index({ brand: 1 }); // For filtering by brand
productSchema.index({ price: 1 }); // For sorting/filtering by price
productSchema.index({ stock: 1 }); // For filtering by stock

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sellerName: {type: String, },
    sellerEmail: {type: String, },
    buyerEmail: {
        type: String,
        required: true
      },
      phoneNumber: {type: String },
      productName: {type: String },
      productCategory: {type: String },
      productPrice: {type: String },
      productDeliveryTime: {type: String },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {type: String },
},{
    timestamps: true
  })

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
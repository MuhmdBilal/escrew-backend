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
      productPrice: {type: Number },
      productDeliveryTime: {type: Number },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true
  })

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
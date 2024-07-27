const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware');
const Product = require('../models/product');
const sendEmail = require('../nodemailer');
const fs = require('fs')
const path = require('path')
const handlebars = require("handlebars")
const productDetailsTemplateSource = fs.readFileSync(
    path.join(__dirname, "../templates/productDetails.handlebars"),
    "utf8"
  );
  const template = handlebars.compile(productDetailsTemplateSource);
router.post("/product",authMiddleware, async(req,res)=>{
    try{
        const product = new Product({
            ...req.body,
            userId: req.user._id 
          });
          await product.save();
          const mailOptions = {
            from: process.env.USER_EMAIL,
            to: req.body.buyerEmail,
            subject : "Product Purchase Confirmation'",
            html: template({ time:req.body.productDeliveryTime, name: req.body.productName }) 
          };
          await sendEmail(mailOptions)
          res.status(201).send({message: "order created successfully."});
    }catch(e){
        res.status(500).json({ message: 'Server Error' });
    }
})
module.exports = router;

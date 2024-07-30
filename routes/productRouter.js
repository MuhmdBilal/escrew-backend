const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware");
const Product = require("../models/product");
const sendEmail = require("../nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const productDetailsTemplateSource = fs.readFileSync(
  path.join(__dirname, "../templates/productDetails.handlebars"),
  "utf8"
);
const productAcceptTemplateSource = fs.readFileSync(
  path.join(__dirname, "../templates/productAccept.handlebars"),
  "utf8"
);
const productCancelTemplateSource = fs.readFileSync(
  path.join(__dirname, "../templates/productCancel.handlebars"),
  "utf8"
);
const productDispatchTemplateSource = fs.readFileSync(
  path.join(__dirname, "../templates/productDispatched.handlebars"),
  "utf8"
);
const productApprovedTemplateSource = fs.readFileSync(
  path.join(__dirname, "../templates/productApproved.handlebars"),
  "utf8"
);
const acceptTamplate = handlebars.compile(productAcceptTemplateSource);
const canceledTamplate = handlebars.compile(productCancelTemplateSource);
const dispatchTamplate = handlebars.compile(productDispatchTemplateSource);
const approvedTamplate = handlebars.compile(productApprovedTemplateSource);
const template = handlebars.compile(productDetailsTemplateSource);
router.post("/product", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: req.body.buyerEmail,
      subject: "Product Purchase Confirmation'",
      html: template({ orderId: req.body.orderId, paymentType:req.body.paymentType  }),
    };
    await sendEmail(mailOptions);
    res.status(201).send({ message: "order created successfully." });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/get-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findOne({ orderId: id });
    if (result) {
      res.status(200).json(result); // Send the found product
    } else {
      res.status(404).json({ message: "Product not found against this Order Number" });
    }
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
});
router.get("/product-accept/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findOneAndUpdate(
      { orderId: id },
      { status: "accepted" },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (result) {
      const mailOptions = {
        from: process.env.USER_EMAIL,
        to: result.sellerEmail,
        subject: "Order Accept Confirmation",
        html: acceptTamplate({
          productName: result.productName,
          productPrice: result.productPrice,
          orderId: result.orderId,
        }),
      };
      await sendEmail(mailOptions);
    }
    res
      .status(200)
      .json({ message: "Product status updated to approved", product: result });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
});
router.get("/product-cancel/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findOneAndUpdate(
      { orderId: id },
      { status: "canceled" },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (result) {
      const mailOptions = {
        from: process.env.USER_EMAIL,
        to: result.buyerEmail,
        subject: "Order Canceled Confirmation",
        html: canceledTamplate({
          productName: result.productName,
          productPrice: result.productPrice,
          orderId: result.orderId,
        }),
      };
      await sendEmail(mailOptions);
    }
    res
      .status(200)
      .json({ message: "Product status updated to approved", product: result });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/product-dispatch/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findOneAndUpdate(
      { orderId: id },
      { status: "dispatched" },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (result) {
      const mailOptions = {
        from: process.env.USER_EMAIL,
        to: result.buyerEmail,
        subject: "Order Dispatched Confirmation",
        html: dispatchTamplate({
          productName: result.productName,
          productPrice: result.productPrice,
          orderId: result.orderId,
        }),
      };
      await sendEmail(mailOptions);
    }
    res
      .status(200)
      .json({ message: "Product status updated to approved", product: result });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/product-approved/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findOneAndUpdate(
      { orderId: id },
      { status: "approved" },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (result) {
      const mailOptions = {
        from: process.env.USER_EMAIL,
        to: result.sellerEmail,
        subject: "Order Approved Confirmation",
        html: approvedTamplate({
          productName: result.productName,
          productPrice: result.productPrice,
          orderId: result.orderId,
        }),
      };
      await sendEmail(mailOptions);
    }
    res
      .status(200)
      .json({ message: "Product status updated to approved", product: result });
  } catch (e) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/get-all-order", async (req, res) => {
  try {
    const result = await Product.find({userId: req.user?._id})
    res.status(200).json({ data: result})
  } catch (e) {
    res.status(500).json({ message: "hello" });
  }
});
module.exports = router;

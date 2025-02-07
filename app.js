const express = require("express");
const axios = require("axios")
require("express-async-errors");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonHeroRouter = require("./routes/common/hero-routes");
const paymentsRouter = require("./routes/payments/payments-router");

const typeAuth = require("./middleware/type-auth")
const isAuth = require("./middleware/is-auth")

const notFoundMiddleware = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")


//create a database connection -> u can also
//create a separate file for this and then import/use that file here


const app = express();
const PORT = process.env.PORT || 5000;


app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(express.json());


// Authentication routes
app.use("/api/v1/auth", authRouter);

// admin routes
app.use("/api/v1/admin/products", isAuth, typeAuth("admin"), adminProductsRouter);
app.use("/api/v1/admin/orders", isAuth, typeAuth("admin"), adminOrderRouter);

// shop routes
app.use("/api/v1/shop/products", shopProductsRouter);
app.use("/api/v1/shop/cart", isAuth, typeAuth("user", 'admin'), shopCartRouter);
app.use("/api/v1/shop/address", isAuth, typeAuth("user", 'admin'), shopAddressRouter);
app.use("/api/v1/shop/order", isAuth, typeAuth("user", 'admin'), shopOrderRouter);
app.use("/api/v1/shop/search", shopSearchRouter);
app.use("/api/v1/shop/review", shopReviewRouter);

// Hero Image routes
app.use("/api/v1/common/hero", commonHeroRouter);

app.use("/api/v1/payments", paymentsRouter);


// error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("MongoDB connected")
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
  })
  .catch((error) => console.log(error));

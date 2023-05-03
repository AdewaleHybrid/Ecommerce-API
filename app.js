const express = require("express"); // EXPRESS
const app = express(); // EXPRESS
const port = 2000; // PORT
const cors = require("cors"); // CORS
const morgan = require("morgan"); // LOGGER
const mongoose = require("mongoose"); // DATABASE

//  = = = = = = = = = = SELF-DEFINED MODULES  = = = = = = = = = =
const userRouter = require("./routes/users"); // USER ROUTE
const productRouter = require("./routes/products"); // PRODUCT ROUTE
const categoryRouter = require("./routes/categories"); // CATEGORY ROUTE
const orderRouter = require("./routes/orders"); // ORDER ROUTE
// const authJwt = require("./helpers/jwt"); // JWT AUTH
const errorHandler = require("./helpers/error-handle"); // JWT ERROR HANDLER

//  = = = = = = = = = = SELF-DEFINED MODULES ENDS = = = = = = = = =
const path = require("path");
const { dirname } = require("path");
// = = = = = = = = = = MIDDLEWARES = = = = = = = = = =
app.use(express.static(path.join(__dirname, "/public")));
// ENABLE CORS
app.use(cors());
app.options("*", cors());
// = = DOTENV CONFIGURATION = =
require("dotenv/config");
const api = process.env.API_URL;
//  = = BODY PASER FOR JSON DATA.= =
app.use(express.json());
// = = BODY PASER FOR FORM INPUT = =
app.use(express.urlencoded({ extended: false }));
// = = REQUEST LOGGER = =
app.use(morgan("tiny"));
// = = IMPORT EXPRESS-JWT FUNCTION = =
// app.use(authJwt());
// = = ERROR HADLER FOR JWT = =
app.use(errorHandler);
// = = SET PULIC FOLDER = =
app.use(`/public/uploads`, express.static(__dirname + "/public/uploads"));

// = = = = = = = = = = MIDDLEWARES ENDS = = = = = = = = = =
// = = = = = = = = = =  ROUTES MIDDLEWARES = = = = = = = = = = = =
app.use(`${api}/products`, productRouter); // PRODUCT ROUTE
app.use(`${api}/categories`, categoryRouter); // CATEGORY ROUTE
app.use(`${api}/users`, userRouter); // USER ROUTE
app.use(`${api}/orders`, orderRouter); // ORDER ROUTE
// = = = = = = = = = =  ROUTES MIDDLEWARES ENDS = = = = = = = = = = = =

// = = = = = = = = = = = = DATABASE CONNECTION = = = = = = = = = = = = =
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log(`database connected succesfully`);
  })
  .catch((err) => {
    console.log(err);
  });
// = = = = = = = = = = = = DATABASE CONNECTION ENDS= = = = = = = = = = = = =
// = = = = = = = = = = = = = = =SERVER = = = = = = = = = = = = = = = =
app.listen(port, (req, res) => {
  console.log(`server is running on http://localhost:${port}`);
});

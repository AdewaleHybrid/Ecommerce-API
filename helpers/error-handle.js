// JWT ERROR HANDLER
function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "The User is not Authorized" });
  }
  if (err.name == "validationError") {
    return res.status(500).json({ message: err });
  } else {
    return res.status(500).json({ err });
  }
}

module.exports = errorHandler;

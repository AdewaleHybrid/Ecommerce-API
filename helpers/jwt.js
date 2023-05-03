// JWT FILE TO SECURE THE API
const { expressjwt: expressJwt } = require("express-jwt");
function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  return expressJwt({ secret, algorithms: ["HS256"], isRevoked: isRevoked }).unless({
    path: [
      // { url: `${api}/products`, method: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, method: ["GET", "OPTIONS"] }, // TO GET ALL PRODUCTS REQUEST INCLUDING PARAMETERS
      { url: /\/public\/uploads(.*)/, method: ["GET", "OPTIONS"] }, // TO GET ALL IMAGES REQUEST
      // { url: `${api}/categories`, method: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, method: ["GET", "OPTIONS"] }, // TO GET ALL CATEGORIES REQUEST INCLUDING PARAMETERS
      { url: /\/api\/v1\/orders(.*)/, method: ["GET", "OPTIONS"] }, // TO GET ALL ORDERS REQUEST INCLUDING PARAMETERS
      { url: `${api}/users`, method: ["GET", "OPTIONS"] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

//FUNCTION TO SET ROLE BETWEEN ADMIN & USERS
// req = token, token = data embedded in the token
const isRevoked = async (req, token) => {
  //console.log(token.payload.isAdmin);
  // NOT ADMIN
  if (token.payload.isAdmin === false) {
    // console.log("Not Admin");
    return true;
  } else {
    // ADMIN
    //console.log("Admin");
    return false;
  }
};
module.exports = authJwt;

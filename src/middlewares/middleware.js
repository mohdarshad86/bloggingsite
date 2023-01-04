const jwt = require("jsonwebtoken");

const authmid = async (req, res, next) => {
  let token = req.headers["x-api-key"];

  if (!token) {
    return res
      .status(401)
      .send({ status: false, msg: "Header is not present" });
  }

  let decodedToken = jwt.verify(token, "project-blogging");
  if (!decodedToken) {
    return res.status().send({ status: false, msg: "Invalid Token" });
  }

  next()
};

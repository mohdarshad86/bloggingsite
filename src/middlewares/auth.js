const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");
const { isValidObjectId } = require("mongoose");

exports.authMid1 = async (req, res, next) => {
  try {
    let token = req.headers["x-api-key"];

    if (!token) {
      return res
        .status(400)
        .send({ status: false, msg: "Header is not present" });
    }

    let decodedToken = jwt.verify(token, "project-blogging");
    if (!decodedToken) {
      return res.status(401).send({ status: false, msg: "Invalid Token" });
    }
    console.log(decodedToken);
    req.authorId = decodedToken.authorId;

    next();
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, msg: "Mid1 Catch", error: error.message });
  }
};

exports.authMid2 = async (req, res, next) => {
  try {
    //check
    let blogId = req.params.blogId;

    if (!blogId) return res.status(400).send("Please provide the blogId.");

    if (!isValidObjectId(blogId))
      return res
        .status(400)
        .send({ status: false, msg: "Given blogId is not valid id" });
    let blogData = await blogModel.findById(blogId);
    if (!blogData)
      return res.status(404).send({ msg: "Blog not found for this id." });

    if (blogData.isDeleted == true)
      return res.status(404).send("blog already deleted");
    if (blogData.authorId !== req.authorId) {
      return res
        .status(404)
        .send("You are not autharised to do this operation");
    }
    //point

    next();
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, msg: "Mid2 Catch", error: error.message });
  }
};

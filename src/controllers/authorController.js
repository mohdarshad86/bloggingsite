const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

module.exports.createAuthor = async function (req, res) {
  try {
    let data = req.body;
    if (!data) {
      res
        .status(400)
        .send({ status: false, msg: "Please provide details in body" });
    }

    let authorData = await authorModel.create(data);

    res.status(201).send({ status: true, data: authorData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ status: false, msg: error.message });
  }
};

exports.getAuthor = async (req, res) => {
  try {
    let authors = await authorModel.find();
    res.status(200).send({ status: true, data: authors });
  } catch (error) {
    console.log(error.message, error);
    res.status(500).send({ status: false, msg: error.message });
  }
};

exports.loginAuthor = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || (email == "" && !password) || password == "") {
      res.status(400).send({
        status: false,
        msg: "Please provide correct email or password",
      });
    }

    let author = await authorModel.findOne({
      email: email,
      password: password,
    });

    if (!author) {
      return res
        .status(401)
        .send({ status: false, msg: "Invalid username or password" });
    }

    let token = jwt.sign(
      {
        authorId: author._id.toString(),
      },
      "project-blogging"
    );

    res.status(201).setHeader("x-api-key", token);

    res.status(201).send({ status: true, data: token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ status: false, msg: error.message });
  }
  
};

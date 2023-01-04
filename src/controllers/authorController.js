const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

function validateName(id) {
  let regex = /^[a-zA-Z ]{2,30}$/;
  return regex.test(id);
}
function validatePass(id) {
  let regex = /^((?=.*[a-zA-Z])(?=.*\d).{3,20}$).*$/;
  return regex.test(id);
}
function validateEmail(id) {
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(id);
}

module.exports.createAuthor = async (req, res) => {
  try {
    let data = req.body;
    let { fname, lname, email, title, password } = data;
    if (!data) {
      res
        .status(400)
        .send({ status: false, msg: "Please provide details in body" });
    }

    if (!validateName(fname)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please use correct format" });
    }
    if (!validateName(lname)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please use correct format" });
    }
    if (!title || title == "") {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide title" });
    }

    title = data.title = title.trim();
    if (title) {
      if (!["Mr", "Mrs", "Miss"].includes(title)) {
        return res
          .status(400)
          .send({ status: false, msg: "Please provide valid title" });
      }
    }
    if (!validateEmail(email)) {
      return res.status(400).send({
        status: false,
        msg: "Please enter valid email",
      });
    }
    if (email) {
      let givenMail = await authorModel.findOne({ email: email });
      // {}, null
      if (givenMail) {
        return res
          .status(400)
          .send({ status: false, msg: "Email already in use" });
      }
    }
    if (!validatePass(password)) {
      return res.status(400).send({
        status: false,
        msg: "Please provide minimum 8 character password ",
      });
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

    if ((!email || email == "") && (!password || password == "")) {
      res.status(400).send({
        status: false,
        msg: "Please provide email or password",
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

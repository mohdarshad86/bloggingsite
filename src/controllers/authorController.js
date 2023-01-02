const authorModel = require("../models/authorModel");
const createAuthor = async function (req, res) {
  try {
    let data = req.body;
    if (!data) {
      res
        .status(400)
        .send({ status: false, msg: "Please provide detailes in body" });
    }
    let authorData = await authorModel.create(data);

    res.status(201).send({ status: true, data: authorData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ status: false, msg: "Internal error" });
  }
};

exports.getAuthor = async (req, res) => {
  try {
    let authors = await authorModel.find();
    res.status(200).send({ status: true, data: authors });
  } catch (error) {
    console.log(error.message, error);
    res.status(500).send({ status: false, msg: "Internal Server Error" });
  }
};

module.exports.createAuthor = createAuthor;

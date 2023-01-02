const blogModel = require("../models/blogModel")
const authorModel = require('../models/authorModel')
const createBlog = async function(req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length === 0)
            return res.status(400).send({ status: false, msg: "Please provide all the required data" })
        if (!data.authorId || data.authorId == "")
            return res.status(400).send({ status: false, msg: "Please Provide authorId" })
        let authors = await authorModel.findById(data.authorId)
        if (!authors)
            return res.status(404).send({ status: false, msg: "Author id not exists" })

        let blogData = await blogModel.create(data)

        res.status(201).send({ status: true, data: blogData })

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ status: false, msg: "Internal server error" })

    }
}
module.exports.createBlog = createBlog
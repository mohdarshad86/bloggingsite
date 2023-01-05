const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const { isValidObjectId } = require("mongoose");

const isValid = function(value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length === 0) return false;
    return true;
};

exports.createBlog = async(req, res) => {
    try {
        let data = req.body;

        if (Object.keys(data).length === 0)
            return res
                .status(400)
                .send({ status: false, msg: "Please provide all the required data" });

        if (!data.authorId || data.authorId == "")
            return res
                .status(400)
                .send({ status: false, msg: "Please Provide authorId" });

        if (!data.title || data.title == "")
            return res
                .status(400)
                .send({ status: false, msg: "Please Provide title" });

        if (!data.body || data.body == "")
            return res
                .status(400)
                .send({ status: false, msg: "Please Provide body" });

        if (!data.category || data.category == "")
            return res
                .status(400)
                .send({ status: false, msg: "Please Provide category" });

        let authors = await authorModel.findById(data.authorId);
        //{} null
        if (!authors)
            return res
                .status(404)
                .send({ status: false, msg: "Author id not exists" });

        let blogData = await blogModel.create(data);

        res.status(201).send({ status: true, data: blogData });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: false, msg: error.message });
    }
};

exports.getBlog = async(req, res) => {
    try {
        if (Object.keys(req.query).length == 0) {
            let blogs = await blogModel.find({
                isDeleted: false,
                isPublished: true,
                authorId: req.authorId,
            });

            console.log(blogs);
        if (blogs.length == 0) {
            return res.status(404).send({
                status: false,
                msg: "No such blog found",
            });
        }

            return res.status(200).send({ status: true, data: blogs });
        }

        let { authorId, category, subcategory, tags } = req.query;
        if (authorId) {
            if (!isValidObjectId(authorId))
                return res
                    .status(400)
                    .send({ status: false, msg: "Given AuthorId is not valid id" });
        }

        let blogs = await blogModel.find({
            isDeleted: false,
            isPublished: true,
            authorId: req.authorId,
            $or: [
                { authorId: authorId },
                { category: category },
                { subcategory: subcategory },
                { tags: tags },
            ],
        });

        console.log(blogs);
        if (blogs.length == 0) {
            return res.status(404).send({
                status: false,
                msg: "No such blog found",
            });
        }

        res.status(200).send({ status: true, data: blogs });
    } catch (error) {
        console.log(error.message, error);
        res.status(500).send({ status: false, msg: error.message });
    }
};

exports.updateBlog = async(req, res) => {
    try {
        let data = req.body;

        let blogId = req.params.blogId;

        //We have shifted this code to mid2

        let updatedBlogData = await blogModel.findOneAndUpdate({ _id: blogId }, {
            $set: {
                title: data.title,
                body: data.body,
                isPublished: true,
                publishedAt: new Date(),
            },
            $push: { tags: data.tags, subcategory: data.subcategory },
        }, { new: true });

        res.status(201).send({ status: true, data: updatedBlogData });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};

exports.deleteBlogByParams = async(req, res) => {
    try {
        //we have //We have shifted this code to mid2
        let blogId = req.params.blogId
        let deleteBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true });

        console.log(deleteBlog);

        res.status(200).send({ status: true, msg: "Blog deleted" });
    } catch (error) {
        console.log("delete blog controller", error.message);
        res.status(500).send({ status: false, msg: error.message });
    }
};

exports.DeletedByQuery = async(req, res) => {
    try {
        if (Object.keys(req.query).length == 0) {
            return res
                .status(404)
                .send({ status: false, msg: "Query params required" });
        }
        let { category, subcategory, tags, authorId, isPublished } = req.query;
        let filterdata = {};
        filterdata.isDeleted = false;
        filterdata.isPublished = true;
        if (authorId) {
            filterdata.authorId = authorId;
        }

        if (category) {
            filterdata.category = category;
        }
        if (subcategory) {
            filterdata.subcategory = subcategory;
        }
        if (tags) {
            filterdata.tags = tags;
        }

        if (isPublished) {
            filterdata.isPublished = isPublished;
        }
        let data = await blogModel.find(filterdata);
        //handle for empty []
        if (data.length == 0) {
            return res
                .status(400)
                .send({ status: false, msg: "Please provide correct details" });
        }
        if (!data)
            return res.status(404).send({
                status: false,
                msg: "blog is published or blog is already deleted",
            });

        //Autharisation
        // if (blogData.authorId !== req.authorId) {
        //   return res.status(404).send("You are not autharised to edit this blog");
        // }

        let updatedData = await blogModel.updateMany(
            filterdata, { isDeleted: true, deletedAt: new Date() }, { new: true }
        );

        if (updatedData.modifiedCount == 0) {
            return res
                .status(200)
                .send({ status: false, msg: "nothing to be deleted" });
        }

        console.log(updatedData);
        return res.status(200).send({ status: true, msg: "data is deleted" });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};
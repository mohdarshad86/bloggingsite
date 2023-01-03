const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

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

        let authors = await authorModel.findById(data.authorId);

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
        let { authorId, category, subcategory, tags } = req.query;

        let blogs = await blogModel.find({
            isDeleted: false,
            isPublished: true,
            $or: [
                { authorId: authorId },
                { category: category },
                { subcategory: subcategory },
                { tags: tags },
            ],
        });
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

        if (!blogId) return res.status(400).send("Please provide the id.");

        let deletedData = await blogModel.findById(blogId);
        if (!deletedData)
            return res.status(404).send({ msg: "user not found for this id." });

        if (deletedData.isDeleted == true)
            return res.status(404).send("blog already deleted");

        let updatedBlogData = await blogModel.findOneAndUpdate({ _id: blogId }, {
            $set: {
                title: data.title,
                body: data.body,
                isPublished: true,
                publishedAt: new Date(),
            },
            $push: { tags: data.tags, subcategory: data.subcategory },
        }, { new: true });

        res.status(201).send({ status: false, data: updatedBlogData });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};

exports.deleteBlogByParams = async(req, res) => {
    try {
        let blogId = req.params.blogId;

        let data = await blogModel.findById(blogId);

        if (!data)
            return res
                .status(404)
                .send({ status: false, msg: "Blog does not exist" });

        if (data.isDeleted == true) {
            return res
                .status(404)
                .send({ status: false, msg: "Blog already deleted" });
        }

        let deleteBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true });

        console.log(deleteBlog);

        res.status(200).send({ status: true, msg: "Blog deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: false, msg: error.message });
    }
};

exports.DeletedByQuery = async(req, res) => {
    try {
        let filterdata = { isDeleted: false }
        let { category, subcategory, tags, authorId, isPublished } = req.query

        if (authorId) {
            filterdata.authorId = authorId
        }

        if (category) {
            filterdata.category = category
        }
        if (subcategory) {
            filterdata.subcategory = subcategory
        }
        if (tags) {
            filterdata.tags = tags
        }
        if (isPublished) {
            filterdata.isPublished = isPublished
        }

        let data = await blogModel.findOne(filterdata)
        if (!data)
            return res.status(404).send({ status: false, msg: "Blog already deleted" })
        let updatedData = await blogModel.updateOne(filterdata, { isDeleted: true }, { new: true })
        console.log(updatedData)
        return res.status(200).send({ status: true, msg: "data is deleted" })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

};
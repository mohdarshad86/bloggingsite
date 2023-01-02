const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        ref: "author",
        required: true

    },
    tags: [{ type: String }],
    category: {
        type: String,
        required: true
    },

    subcategory: [{ type: String }],
    deletedAt: {
        type: Date,
        date: Date.now()

    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date,
        date: new Date()
    },
    isPublished: {
        type: Boolean,
        default: false
    }


}, { timestamps: true })

module.exports = mongoose.model("blog", blogSchema);
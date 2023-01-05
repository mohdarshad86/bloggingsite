const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
    },

    authorId: {
      type: ObjectId,
      ref: "author",
      required: true,
    },

    tags: [{ type: String }],

    category: {
      type: String,
      required: true,
      trim: true,
    },

    subcategory: [{ type: String }],

    deletedAt: {
      type: Date,
      date: Date.now(),
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
      date: new Date(),
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blog", blogSchema);

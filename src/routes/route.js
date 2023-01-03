const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const express = require("express");
const router = express.Router();

router.post("/authors", authorController.createAuthor);

router.post("/blogs", blogController.createBlog);

router.get("/authors", authorController.getAuthor);

router.get("/blogs", blogController.getBlog);

router.put("/blogs/:blogId", blogController.updateBlog);

router.delete("/blogs/:blogId", blogController.deleteBlogByParams);

router.delete("/blogs", blogController.DeletedByQuery) 

module.exports = router;

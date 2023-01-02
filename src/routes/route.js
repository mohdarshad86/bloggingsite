const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const express = require("express");
const router = express.Router();

router.post("/authors", authorController.createAuthor);
router.post("/blogs", blogController.createBlog);

router.get("/authors", authorController.getAuthor);
router.get("/blogs", blogController.getBlog);


module.exports = router;

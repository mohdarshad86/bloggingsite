const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const middleWare = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

router.post("/authors", authorController.createAuthor);

router.post("/blogs", middleWare.authMid1, blogController.createBlog);

router.get("/authors", authorController.getAuthor);

router.get("/blogs", middleWare.authMid1, blogController.getBlog);

router.put(
  "/blogs/:blogId",
  middleWare.authMid1,
  middleWare.authMid2,
  blogController.updateBlog
);

//day2
router.delete(
  "/blogs/:blogId",
  middleWare.authMid1,
  middleWare.authMid2,
  blogController.deleteBlogByParams
);

router.delete(
  "/blogs",
  middleWare.authMid1,
  
  blogController.DeletedByQuery
);

//day3

router.post("/login", authorController.loginAuthor);

module.exports = router;
